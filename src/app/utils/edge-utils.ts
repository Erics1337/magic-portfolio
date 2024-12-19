type Team = {
    name: string;
    role: string;
    avatar: string;
    linkedIn: string;
};

type BaseMetadata = {
    title: string;
    publishedAt: string;
    summary: string;
    tags?: string[];
};

type BlogMetadata = BaseMetadata & {
    image: string;
};

type WorkMetadata = BaseMetadata & {
    images: string[];
    team: Team[];
};

type BasePost = {
    slug: string;
    content: string;
};

type BlogPost = BasePost & {
    metadata: BlogMetadata;
};

type WorkPost = BasePost & {
    metadata: WorkMetadata;
};

// Helper to safely get base URL
function getBaseUrl(): string {
    if (process.env.CF_PAGES_URL) {
        return process.env.CF_PAGES_URL;
    }
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    return 'http://localhost:3000';
}

import enBlogContent from '@/content/en/blog/content.json';
import enWorkContent from '@/content/en/work/content.json';

async function getPosts(contentType: string, locale: string): Promise<BlogPost[] | WorkPost[]> {
    try {
        // Return static content during build time
        if (locale === 'en') {
            if (contentType === 'blog/posts') {
                return enBlogContent as BlogPost[];
            } else if (contentType === 'work/projects') {
                return enWorkContent as WorkPost[];
            }
        }
        
        throw new Error(`Content not found for ${contentType} in locale ${locale}`);
    } catch (error) {
        console.error(`Error fetching ${contentType} content:`, error);
        return [];
    }
}

export function getBlogPosts(locale: string): Promise<BlogPost[]> {
    return getPosts('blog/posts', locale) as Promise<BlogPost[]>;
}

export function getWorkProjects(locale: string): Promise<WorkPost[]> {
    return getPosts('work/projects', locale) as Promise<WorkPost[]>;
}

export const baseURL = getBaseUrl();
