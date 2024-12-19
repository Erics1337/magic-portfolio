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
    images: {
        unoptimized: true, // Required for static export
        domains: [], // Add any external image domains here if needed
        remotePatterns: [], // Add any remote image patterns here if needed
    },
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
        config.module.rules.push({
            test: /\.json$/,
            type: 'json',
        });
        return config;
    },
};

export default withNextIntl(withMDX(nextConfig));
