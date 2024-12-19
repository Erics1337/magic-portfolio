import { Flex, Heading } from '@/once-ui/components';
import { Mailchimp } from '@/components';
import { BlogContent } from '@/components/blog/BlogContent';
import { baseURL, renderContent } from '@/app/resources'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getBlogPosts } from '@/app/utils/edge-utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const t = await getTranslations();
	const { blog } = renderContent(t);

	const title = blog.title;
	const description = blog.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/blog`,
			images: [
				{
					url: ogImage,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function Blog(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);

	const [t, allPosts] = await Promise.all([
		getTranslations(),
		getBlogPosts(locale)
	]);

	const { person, blog, newsletter } = renderContent(t);

	// Sort posts by date
	const sortedPosts = [...allPosts].sort((a, b) => {
		return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
	});

    return (
        <Flex
			fillWidth maxWidth="s"
			direction="column">
            <script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Blog',
						headline: blog.title,
						description: blog.description,
						url: `https://${baseURL}/blog`,
						image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
						author: {
							'@type': 'Person',
							name: person.name,
                            image: {
								'@type': 'ImageObject',
								url: `${baseURL}${person.avatar}`,
							},
						},
					}),
				}}
			/>
            <Heading
                marginBottom="l"
                variant="display-strong-s">
                {blog.title}
            </Heading>
			<BlogContent posts={sortedPosts} locale={locale} />
            {newsletter.display && (
                <Mailchimp newsletter={newsletter} />
            )}
        </Flex>
    );
}