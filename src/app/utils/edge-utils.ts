type Team = {
    name: string;
    role: string;
    avatar: string;
    linkedIn: string;
};

type Metadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tags?: string[];
    team: Team[];
};

type Post = {
    metadata: Metadata;
    slug: string;
    content: string;
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

async function getPosts(contentType: string, locale: string): Promise<Post[]> {
    try {
        // Use relative path for content fetching
        const baseContentType = contentType.split('/')[0]; // 'blog' from 'blog/posts'
        const contentPath = `/content/${locale}/${baseContentType}/content.json`;
        
        // Always fetch from the API in Edge runtime
        const baseUrl = getBaseUrl();
        const url = new URL(contentPath, baseUrl).toString();
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${contentType} content`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${contentType} content:`, error);
        return [];
    }
}

export async function getBlogPosts(locale: string): Promise<Post[]> {
    return getPosts('blog/posts', locale);
}

export async function getWorkProjects(locale: string): Promise<Post[]> {
    return getPosts('work/projects', locale);
}
