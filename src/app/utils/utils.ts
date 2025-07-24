'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

async function getMDXFiles(dir: string): Promise<string[]> {
    const files = await fs.promises.readdir(dir);
    return files.filter((file) => path.extname(file) === '.mdx');
}

async function readMDXFile(filePath: string): Promise<Post> {
    try {
        const rawContent = await fs.promises.readFile(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(rawContent);
        const metadata = frontMatter as Metadata;
        
        return {
            metadata,
            slug: path.basename(filePath, '.mdx'),
            content
        };
    } catch (error) {
        console.error(`Error reading MDX file ${filePath}:`, error);
        throw error;
    }
}

async function getMDXData(dir: string): Promise<Post[]> {
    try {
        const POSTS_PATH = path.join(process.cwd(), dir);
        // console.log('Looking for posts in:', POSTS_PATH);
        
        // Check if directory exists
        try {
            await fs.promises.access(POSTS_PATH);
        } catch (error) {
            console.warn(`Directory not found: ${POSTS_PATH}`);
            return [];
        }

        const postFilePaths = await fs.promises.readdir(POSTS_PATH);
        // console.log('Found files:', postFilePaths);
        
        const mdxFiles = postFilePaths.filter((path) => /\.mdx?$/.test(path));
        // console.log('MDX files:', mdxFiles);

        const posts = await Promise.all(
            mdxFiles.map(async (filePath) => {
                try {
                    const fullPath = path.join(POSTS_PATH, filePath);
                    return await readMDXFile(fullPath);
                } catch (error) {
                    console.error(`Error processing file ${filePath}:`, error);
                    return null;
                }
            })
        );

        // Filter out any null values from failed reads
        const validPosts = posts.filter((post): post is Post => post !== null);
        // console.log('Valid posts:', validPosts.length);
        return validPosts;
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
        return [];
    }
}

export async function getPosts(customPath: string[] = ['', '', '', '']): Promise<Post[]> {
    try {
        const dir = path.join(...customPath);
        // console.log('Getting posts from directory:', dir);
        const posts = await getMDXData(dir);
        return Array.isArray(posts) ? posts : [];
    } catch (error) {
        console.error('Error in getPosts:', error);
        return [];
    }
}

export async function getBlogPosts(locale: string) {
    'use server'
    return getPosts(['src', 'app', '[locale]', 'blog', 'posts', locale]);
}

export async function getWorkProjects(locale: string) {
    'use server'
    // console.log('Getting work projects for locale:', locale);
    const projects = await getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);
    // console.log('Found projects:', projects.length);
    return projects;
}

export async function filterPostsByTitles(posts: any[], titles: string[]): Promise<any[]> {
    'use server';
    if (!posts || !Array.isArray(posts)) return [];
    
    return titles
        .map(title => {
            // Find the first post that includes the title (case insensitive)
            const post = posts.find(p => 
                p.metadata.title.toLowerCase().includes(title.toLowerCase())
            );
            return post;
        })
        .filter(Boolean); // Remove any undefined values if a title wasn't found
}