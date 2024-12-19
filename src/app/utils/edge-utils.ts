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

// TODO: Replace this with your actual data fetching logic
// This could be an API call, database query, or static data
const MOCK_POSTS: Post[] = [
    {
        metadata: {
            title: "Sample Post",
            publishedAt: "2023-01-01",
            summary: "This is a sample post",
            images: [],
            team: []
        },
        slug: "sample-post",
        content: "Sample content"
    }
];

export async function getBlogPosts(locale: string): Promise<Post[]> {
    'use server';
    // TODO: Implement actual data fetching logic
    return MOCK_POSTS;
}

export async function getWorkProjects(locale: string): Promise<Post[]> {
    'use server';
    // TODO: Implement actual data fetching logic
    return MOCK_POSTS;
}
