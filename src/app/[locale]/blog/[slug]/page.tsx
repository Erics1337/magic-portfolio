import { notFound } from 'next/navigation';
import { CustomMDX } from '../../../../components/mdx';
import { getBlogPosts } from '../../../utils/edge-utils';
import { Avatar, Button, Flex, Heading, Text } from '../../../../once-ui/components';
import { baseURL, renderContent } from '../../../resources';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { formatDate } from '../../../utils/formatDate';
import ScrollToHash from '../../../../components/ScrollToHash';

export const runtime = 'edge';

interface BlogParams {
    params: { 
        slug: string;
        locale: string;
    };
}

export async function generateStaticParams() {
    const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts: { slug: string; locale: string }[] = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = await getBlogPosts(locale);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export async function generateMetadata({ params: { slug, locale } }: BlogParams) {
    let post = (await getBlogPosts(locale)).find((post) => post.slug === slug)

    if (!post) {
        return
    }

    let {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata;
    let ogImage = image
        ? `https://${baseURL}${image}`
        : `https://${baseURL}/og?title=${title}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            url: `https://${baseURL}/${locale}/blog/${post.slug}`,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    }
}

export default async function Blog({ params }: BlogParams) {
    unstable_setRequestLocale(params.locale);
    let post = (await getBlogPosts(params.locale)).find((post) => post.slug === params.slug)

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
