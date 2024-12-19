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
    const rawContent = await fs.promises.readFile(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(rawContent);
    const metadata = frontMatter as Metadata;
    
    return {
        metadata,
        slug: path.basename(filePath, '.mdx'),
        content
    };
}

async function generateContentJson(contentType: string, locale: string) {
    try {
        // Ensure output directories exist
        const contentDir = path.join(process.cwd(), 'public', 'content', locale, contentType);
        await fs.promises.mkdir(contentDir, { recursive: true });

        const sourceDir = path.join(process.cwd(), 'content', locale, contentType);
        const files = await getMDXFiles(sourceDir);
        
        console.log(`Processing ${files.length} files for ${contentType}...`);
        
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
        throw error; // Re-throw to fail the build if content generation fails
    }
}

async function main() {
    const locales = ['en']; // Add more locales as needed
    const contentTypes = ['blog', 'work'];
    
    for (const locale of locales) {
        for (const contentType of contentTypes) {
            await generateContentJson(contentType, locale);
        }
    }
}

main().catch(console.error);
