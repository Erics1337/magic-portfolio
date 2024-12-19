import { getBlogPosts, getWorkProjects } from '@/app/utils/edge-utils'
import { baseURL, routes as routesConfig } from '@/app/resources'
import { routing } from '@/i18n/routing'

export default async function sitemap() {
    const locales = routing.locales;
    const includeLocalePrefix = locales.length > 1;

    const blogPosts = await Promise.all(locales.map(async (locale) => {
        const posts = await getBlogPosts(locale);
        return posts.map((post) => ({
            url: `${baseURL}${includeLocalePrefix ? `/${locale}` : ''}/blog/${post.slug}`,
            lastModified: post.metadata.publishedAt,
        }));
    }));

    const workPosts = await Promise.all(locales.map(async (locale) => {
        const posts = await getWorkProjects(locale);
        return posts.map((post) => ({
            url: `${baseURL}${includeLocalePrefix ? `/${locale}` : ''}/work/${post.slug}`,
            lastModified: post.metadata.publishedAt,
        }));
    }));

    const blogs = blogPosts.flat();
    const works = workPosts.flat();

    const routes = Object.entries(routesConfig)
        .filter(([_, enabled]) => enabled)
        .map(([route]) => ({
            url: `${baseURL}${route === '/' ? '' : route}`,
            lastModified: new Date().toISOString(),
        }));

    return [...routes, ...blogs, ...works]
}