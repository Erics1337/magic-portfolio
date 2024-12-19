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

async function getPosts(contentType: string, locale: string): Promise<Post[]> {
    try {
        // Get the base URL for the request
        // For Cloudflare Pages, use the pages URL or fall back to localhost for development
        const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_SITE_URL || 
            (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');

        // Ensure we have a base URL
        if (!baseUrl) {
            throw new Error('No base URL configured. Set CF_PAGES_URL or NEXT_PUBLIC_SITE_URL environment variable.');
        }

        // Use absolute URL and ensure it starts with https:// or http://
        const url = new URL(`/content/${locale}/${contentType}/content.json`, baseUrl).toString();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${contentType} content`);
        }
        const posts = await response.json();
        console.log(`Fetched posts: ${posts.length}`);
        console.log(`Posts metadata: ${JSON.stringify(posts.map(p => p.metadata))}`);
        return posts;
    } catch (error) {
        console.error(`Error fetching ${contentType} content:`, error);
        return [];
    }
}

export async function getBlogPosts(locale: string): Promise<Post[]> {
    return getPosts('blog', locale);
}

export async function getWorkProjects(locale: string): Promise<Post[]> {
    return getPosts('work', locale);
}
