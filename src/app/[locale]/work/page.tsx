import { getWorkProjects } from '@/app/utils/utils';
import { Flex } from '@/once-ui/components';
import { baseURL, renderContent } from '@/app/resources';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { WorkContent } from '@/components/work/WorkContent';
import { ProjectsContainer } from '@/components/work/ProjectsContainer';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string }}
) {
    const t = await getTranslations();
    const { work } = renderContent(t);

    const title = work.title;
    const description = work.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [ogImage],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function Work({ params: { locale } }: { params: { locale: string } }) {
    unstable_setRequestLocale(locale);
    const posts = await getWorkProjects(locale) || [];
    console.log('Fetched posts:', posts.length);
    console.log('Posts metadata:', posts.map(p => ({ 
        title: p.metadata.title, 
        tags: p.metadata.tags 
    })));
    
    const t = await getTranslations();
    const { person } = renderContent(t);

    const validPosts = posts.filter(post => 
        post && 
        post.metadata && 
        post.metadata.title && 
        post.metadata.summary
    );
    console.log('Valid posts:', validPosts.length);
    console.log('Valid posts metadata:', validPosts.map(p => ({ 
        title: p.metadata.title, 
        tags: p.metadata.tags 
    })));

    return (
        <Flex
            fillWidth maxWidth="m"
            direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'Work',
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                        hasPart: validPosts.map(project => ({
                            '@type': 'CreativeWork',
                            headline: project.metadata.title,
                            description: project.metadata.summary,
                            datePublished: project.metadata.publishedAt,
                        })),
                    }),
                }}
            />
            <h1 className="text-4xl font-bold mb-8">Professional Case Studies</h1>
            <WorkContent posts={validPosts} locale={locale} />
        </Flex>
    );
}