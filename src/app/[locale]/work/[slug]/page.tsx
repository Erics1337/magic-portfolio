import { notFound } from 'next/navigation';
import { CustomMDX } from '../../../../components/mdx';
import { getWorkProjects } from '../../../utils/utils';
import { AvatarGroup, Button, Flex, Heading, Text } from '../../../../once-ui/components';
import { baseURL, renderContent } from '../../../resources';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '../../../../i18n/routing';
import { formatDate } from '../../../utils/formatDate';
import ScrollToHash from '../../../../components/ScrollToHash';
import { ProjectImages } from '../../../../components/work/ProjectImages';


interface WorkParams {
    params: {
        slug: string;
        locale: string;
    };
}

export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
    const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts: { slug: string; locale: string }[] = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = await getWorkProjects(locale);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export async function generateMetadata({ params: { slug, locale } }: WorkParams): Promise<any> {
    const posts = await getWorkProjects(locale);
    const post = posts.find((post) => post.slug === slug)

    if (!post) {
        return
    }

    let {
        title,
        publishedAt: publishedTime,
        summary: description,
        images,
        image,
        team,
    } = post.metadata
    let ogImage = image
        ? `https://${baseURL}${image}`
        : `https://${baseURL}/og?title=${title}`;

    return {
        title,
        description,
        images,
        team,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            url: `https://${baseURL}/${locale}/work/${post.slug}`,
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

export default async function Project({ params }: WorkParams) {
    unstable_setRequestLocale(params.locale);
    const posts = await getWorkProjects(params.locale);
    const post = posts.find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }

    const t = await getTranslations();
    const { person } = renderContent(t);

    const avatars = post.metadata.team?.map((person) => ({
        src: person.avatar,
    })) || [];

    return (
        <Flex as="section"
            fillWidth maxWidth="m"
            direction="column" alignItems="center"
            gap="l">
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
                        url: `https://${baseURL}/${params.locale}/work/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                    }),
                }}
            />
            <Flex
                fillWidth maxWidth="xs" gap="16"
                direction="column">
                <Button
                    href={`/${params.locale}/work`}
                    variant="tertiary"
                    size="s"
                    prefixIcon="chevronLeft">
                    Projects
                </Button>
                <Heading
                    variant="display-strong-s">
                    {post.metadata.title}
                </Heading>
            </Flex>
            {post.metadata.images.length > 0 && (
                <ProjectImages
                    images={post.metadata.images}
                    title={post.metadata.title}
                />
            )}
            <Flex style={{margin: 'auto'}}
                as="article"
                maxWidth="xs" fillWidth
                direction="column">
                <Flex
                    gap="12" marginBottom="24"
                    alignItems="center">
                    { post.metadata.team && (
                        <AvatarGroup
                            reverseOrder
                            avatars={avatars}
                            size="m"/>
                    )}
                    <Text
                        variant="body-default-s"
                        onBackground="neutral-weak">
                        {formatDate(post.metadata.publishedAt)}
                    </Text>
                </Flex>
                <CustomMDX source={post.content} />
                {post.metadata.tags && post.metadata.tags.length > 0 && (
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
                                {tag}
                            </Text>
                        ))}
                    </Flex>
                )}
            </Flex>
            <ScrollToHash />
        </Flex>
    )
}
