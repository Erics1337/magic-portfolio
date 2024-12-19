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

const SAMPLE_BLOG_POST = `---
title: Hello World
publishedAt: '2024-01-01'
summary: Welcome to my blog
image: /images/placeholder-blog.svg
images: []
tags: ['welcome', 'blog']
team: []
---

# Hello World

Welcome to my blog! This is a sample post.
`;

const SAMPLE_WORK_PROJECT = `---
title: Sample Project
publishedAt: '2024-01-01'
summary: A sample project
image: /images/placeholder-project.svg
images: ['/images/placeholder-project.svg']
tags: ['sample', 'project']
team: []
---

# Sample Project

This is a sample project showcasing my work.
`;

async function ensureDirectoryExists(dir: string) {
    try {
        await fs.promises.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory ${dir}:`, error);
        throw error;
    }
}

async function createSampleContent() {
    const contentDir = path.join(process.cwd(), 'src', 'app', '[locale]');
    const locales = ['en'];
    const contentTypes = ['blog/posts', 'work/projects'];

    for (const locale of locales) {
        for (const contentType of contentTypes) {
            const dir = path.join(contentDir, contentType, locale);
            await ensureDirectoryExists(dir);

            // Create sample content if directory is empty
            const files = await fs.promises.readdir(dir);
            if (files.length === 0) {
                const sampleContent = contentType.includes('blog') ? SAMPLE_BLOG_POST : SAMPLE_WORK_PROJECT;
                const sampleFile = path.join(dir, `sample.mdx`);
                await fs.promises.writeFile(sampleFile, sampleContent);
                console.log(`Created sample ${contentType} content in ${sampleFile}`);
            }
        }
    }
}

async function getMDXFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.promises.readdir(dir);
        return files.filter((file) => path.extname(file) === '.mdx');
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
        return [];
    }
}

async function readMDXFile(filePath: string): Promise<Post> {
    try {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const slug = path.basename(filePath, '.mdx');

        return {
            metadata: data as Metadata,
            slug,
            content
        };
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

async function generateContentJson(contentType: string, locale: string) {
    try {
        // Ensure output directories exist
        const contentDir = path.join(process.cwd(), 'public', 'content', locale, contentType.split('/')[0]);
        await ensureDirectoryExists(contentDir);

        const sourceDir = path.join(process.cwd(), 'src', 'app', '[locale]', contentType, locale);
        const files = await getMDXFiles(sourceDir);
        
        console.log(`Processing ${files.length} files for ${contentType} in ${sourceDir}...`);
        
        const posts = await Promise.all(
            files.map(async (file) => {
                try {
                    return await readMDXFile(path.join(sourceDir, file));
                } catch (error) {
                    console.error(`Error processing file ${file}:`, error);
                    return null;
                }
            })
        );

        const validPosts = posts.filter((post): post is Post => post !== null);
        const outputPath = path.join(contentDir, 'content.json');
        
        await fs.promises.writeFile(
            outputPath,
            JSON.stringify(validPosts, null, 2)
        );
        
        console.log(`Generated ${outputPath} with ${validPosts.length} entries`);
    } catch (error) {
        console.error(`Error generating content for ${contentType}:`, error);
        throw error;
    }
}

async function main() {
    try {
        // Create sample content if needed
        await createSampleContent();

        // Generate content for each type
        await generateContentJson('blog/posts', 'en');
        await generateContentJson('work/projects', 'en');
        
        console.log('Content generation completed successfully!');
    } catch (error) {
        console.error('Error generating content:', error);
        process.exit(1);
    }
}

main().catch(console.error);
