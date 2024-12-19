import { notFound } from 'next/navigation';
import { CustomMDX } from '../../../../components/mdx';
import { Avatar, Button, Flex, Heading, Text } from '../../../../once-ui/components';
import { baseURL, renderContent } from '../../../resources';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { formatDate } from '../../../utils/formatDate';
import ScrollToHash from '../../../../components/ScrollToHash';
import enBlogContent from '@/content/en/blog/content.json';

interface BlogParams {
    params: { 
        slug: string;
        locale: string;
    };
}

export async function generateStaticParams() {
    try {
        return enBlogContent.map(post => ({
            locale: 'en',
            slug: post.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for blog posts:', error);
        return [];
    }
}

export async function generateMetadata({ params: { slug, locale } }: BlogParams) {
    let post = enBlogContent.find((post) => post.slug === slug)

    if (!post) {
        return
    }

    return {
        title: post.metadata.title,
        description: post.metadata.summary,
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.summary,
            type: 'article',
            publishedTime: post.metadata.publishedAt,
            url: `https://demo.magic-portfolio.com/blog/${slug}`,
            images: [
                {
                    url: post.metadata.image,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.metadata.title,
            description: post.metadata.summary,
            images: [post.metadata.image],
        },
    }
}

export default async function Blog({ params }: BlogParams) {
    unstable_setRequestLocale(params.locale);
    let post = enBlogContent.find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }

    const t = await getTranslations();
    const { person } = renderContent(t);

    return (
        <Flex as="section"
            fillWidth maxWidth="xs"
            direction="column"
            gap="m">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.metadata.title,
                        datePublished: post.metadata.publishedAt,
                        dateModified: post.metadata.publishedAt,
                        description: post.metadata.summary,
                        image: post.metadata.image
                            ? `https://${baseURL}${post.metadata.image}`
                            : `https://${baseURL}/og?title=${post.metadata.title}`,
                        url: `https://${baseURL}/${params.locale}/blog/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                    }),
                }}
            />
            <Button
                href={`/${params.locale}/blog`}
                variant="tertiary"
                size="s"
                prefixIcon="chevronLeft">
                Posts
            </Button>
            <Heading
                variant="display-strong-s">
                {post.metadata.title}
            </Heading>
            <Flex
                gap="12"
                alignItems="center">
                { person.avatar && (
                    <Avatar
                        size="s"
                        src={person.avatar}/>
                )}
                <Text
                    variant="body-default-s"
                    onBackground="neutral-weak">
                    {formatDate(post.metadata.publishedAt)}
                </Text>
            </Flex>
            <Flex
                as="article"
                direction="column"
                fillWidth>
                <CustomMDX source={post.content} />
                {post.metadata.tags && (
                    <Flex
                        gap="2"
                        wrap={true}
                        marginTop="32"
                        justifyContent="flex-start">
                        {post.metadata.tags.map((tag: string, index: number) => (
                            <Text
                                key={index}
                                size="xs"
                                paddingX="4"
                                paddingY="2"
                                style={{
                                    background: 'var(--neutral-alpha-weak)',
                                    borderRadius: 'var(--radius-s)',
                                }}>
                                {tag.trim()}
                            </Text>
                        ))}
                    </Flex>
                )}
            </Flex>
            <ScrollToHash />
        </Flex>
    )
}
