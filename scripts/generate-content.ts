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
    const contentDir = path.join(
        process.cwd(), 
        'src/app/[locale]', 
        contentType === 'blog' ? 'blog/posts' : 'work/projects',
        locale
    );
    const outputDir = path.join(process.cwd(), 'public', 'content', locale, contentType);
    
    try {
        // Create output directory if it doesn't exist
        await fs.promises.mkdir(outputDir, { recursive: true });
        
        // Read all MDX files
        const mdxFiles = await getMDXFiles(contentDir);
        const posts = await Promise.all(
            mdxFiles.map(async (file) => {
                const filePath = path.join(contentDir, file);
                return await readMDXFile(filePath);
            })
        );
        
        // Write to JSON file
        const outputPath = path.join(outputDir, 'content.json');
        await fs.promises.writeFile(
            outputPath,
            JSON.stringify(posts, null, 2)
        );
        
        console.log(`Generated ${outputPath}`);
    } catch (error) {
        console.error(`Error generating content for ${contentType}:`, error);
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
