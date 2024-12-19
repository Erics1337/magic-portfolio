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
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : '';

        const response = await fetch(`${baseUrl}/content/${locale}/${contentType}/content.json`);
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
