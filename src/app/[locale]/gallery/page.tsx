import { Flex } from "@/once-ui/components";
import MasonryGrid, { GalleryImage } from "@/components/gallery/MasonryGrid";
import { baseURL, renderContent } from "@/app/resources";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getBlogPosts, getWorkProjects } from '@/app/utils/utils';



export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {

	const t = await getTranslations();
	const { gallery } = renderContent(t);

	const title = gallery.title;
	const description = gallery.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/gallery`,
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

export default async function Gallery(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);
	const t = await getTranslations();
	const { gallery, person } = renderContent(t);

	const blogPosts = await getBlogPosts(locale) || [];
	const workProjects = await getWorkProjects(locale) || [];

	// Collect all images with their sources and links
	const galleryImages = [
		...blogPosts.flatMap(post => {
			const images: GalleryImage[] = [];
			if (post.metadata.image) {
				images.push({
					src: post.metadata.image,
					alt: post.metadata.title,
					link: `/${locale}/blog/${post.slug}`,
					type: 'blog',
					orientation: 'horizontal',
					fallbackSrc: '/images/placeholder-blog.svg'
				});
			}
			return images;
		}),
		...workProjects.flatMap(project => {
			const images: GalleryImage[] = [];
			// Handle both single image and image array
			const projectImages = project.metadata.images || 
				(project.metadata.image ? [project.metadata.image] : []);
			
			projectImages.forEach(image => {
				images.push({
					src: image,
					alt: project.metadata.title,
					link: `/${locale}/work/${project.slug}`,
					type: 'project',
					orientation: 'horizontal',
					fallbackSrc: '/images/placeholder-project.svg'
				});
			});
			return images;
		})
	].filter(image => image.src); // Filter out any undefined images

    return (
        <Flex fillWidth>
            <script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'ImageGallery',
						name: gallery.title,
						description: gallery.description,
						url: `https://${baseURL}/gallery`,
						image: galleryImages.map((image) => ({
                            '@type': 'ImageObject',
                            url: `${baseURL}${image.src}`,
                            description: image.alt,
                        })),
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
            <MasonryGrid images={galleryImages}/>
        </Flex>
    );
}