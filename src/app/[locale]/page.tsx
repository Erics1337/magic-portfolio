import React from 'react';

import { Heading, Flex, Text, Button, Avatar, RevealFx, Arrow } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';
import { baseURL, routes, renderContent } from '@/app/resources'; 
import { Mailchimp } from '@/components';
import { PostsContainer } from '@/components/blog/PostsContainer';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { getWorkProjects, getBlogPosts, filterPostsByTitles } from '@/app/utils/utils';
import { Posts } from '@/components/blog/Posts';

import Hero from '@/components/Hero'


export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const t = await getTranslations();
    const { home } = renderContent(t);
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}`,
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

// Curated list of work projects to show on the homepage (in order)
const CURATED_WORK_PROJECTS = [
    'Beyond the FAQ: Building a Multi-Tenant Virtual Manager with LangChain and Makerkit',
    'Transforming Financial Education: How I Automated Certification for 2,000+ Exit Planning Advisors',
    'Securing High-End Bicycle Deliveries at America\'s First Bike-Only Logistics Company',
    'Enhancing Web Accessibility for the NIH National Heart Lung and Blood Institute',
    'Building the Future of Customer Service: Enterprise AI Call Center Platform at Nularian',
    'Building a Lightning-Fast Search Engine for California\'s $300B Transportation Projects'
];

// Curated list of blog posts to show on the homepage (in order)
const CURATED_BLOG_POSTS = [
    'Beyond the FAQ: Building a Multi-Tenant Virtual Manager with LangChain and Makerkit',
    'My Favorite Coding YouTube Channels and Dev Personalities'
];

export default async function Home(
    { params: {locale}}: { params: { locale: string }}
) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations();
    const { home, about, person, newsletter } = renderContent(t);
    
    // Get all work projects and blog posts
    const allWorkProjects = await getWorkProjects(locale);
    const allBlogPosts = await getBlogPosts(locale);
    
    // Filter to only include curated items in the specified order
    const [curatedWorkProjects, curatedBlogPosts] = await Promise.all([
        filterPostsByTitles(allWorkProjects, CURATED_WORK_PROJECTS),
        filterPostsByTitles(allBlogPosts, CURATED_BLOG_POSTS)
    ]);
	return (
		<Flex
			maxWidth="m" fillWidth gap="xl"
			direction="column" alignItems="center">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
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
			<div className="w-screen -mx-8">
				<Hero />
			</div>
			<Flex
				fillWidth
				direction="column"
				paddingY="l" gap="m">
					<Flex
						direction="column"
						fillWidth maxWidth="s">
						<RevealFx
							translateY="4" fillWidth justifyContent="flex-start" paddingBottom="m">
							<Heading
								wrap="balance"
								variant="display-strong-l">
								{home.headline}
							</Heading>
						</RevealFx>
						<RevealFx
							translateY="8" delay={0.2} fillWidth justifyContent="flex-start" paddingBottom="m">
							<Text
								wrap="balance"
								onBackground="neutral-weak"
								variant="heading-default-xl">
								{home.subline}
							</Text>
						</RevealFx>
						<RevealFx translateY="12" delay={0.4}>
							<Flex fillWidth>
								<Button
									id="about"
									data-border="rounded"
									href={`/${locale}/about`}
									variant="tertiary"
									size="m">
									<Flex
										gap="8"
										alignItems="center">
										{about.avatar.display && (
											<Avatar
												style={{marginLeft: '-0.75rem', marginRight: '0.25rem'}}
												src={person.avatar}
												size="m"/>
											)}
											{t("about.title")}
											<Arrow trigger="#about"/>
									</Flex>
								</Button>
							</Flex>
						</RevealFx>
					</Flex>
				
			</Flex>
            {/* Featured Work Projects */}
            <RevealFx translateY="16" delay={0.6}>
                <Projects locale={locale} posts={curatedWorkProjects} />
            </RevealFx>
            
            {/* Featured Blog Posts */}
            {routes['/blog'] && curatedBlogPosts.length > 0 && (
                <Flex
                    fillWidth gap="24"
                    mobileDirection="column">
                    <Flex flex={1} paddingLeft="l">
                        <Heading
                            as="h2"
                            variant="display-strong-xs"
                            wrap="balance">
                            Latest from the blog
                        </Heading>
                    </Flex>
                    <Flex
                        flex={3} paddingX="20">
                        <Posts 
                            locale={locale} 
                            blogs={curatedBlogPosts} 
                            columns={curatedBlogPosts.length > 1 ? '2' : '1'}
                            thumbnail={true}
                        />
                    </Flex>
                </Flex>
            )}
			{ newsletter.display &&
				<Mailchimp newsletter={newsletter} />
			}
		</Flex>
	);
}
