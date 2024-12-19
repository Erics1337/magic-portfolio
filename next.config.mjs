import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: { },
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Ensures Next.js generates static files
    distDir: 'out', // This is the output directory for Cloudflare Pages
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
        mdxRs: true,
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': '/src',  // This allows absolute imports from the src directory
        };
        return config;
    },
};

export default withNextIntl(withMDX(nextConfig));
