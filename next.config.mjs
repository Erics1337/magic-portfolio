import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: { },
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    images: {
        unoptimized: true,
        domains: ['*'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    trailingSlash: true,
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000', 'ericsdevportfolio.com']
        }
    }
};

// Handle font loading for Cloudflare Pages
if (process.env.CLOUDFLARE_PAGES) {
    nextConfig.assetPrefix = 'https://ericsdevportfolio.com';
} else {
    nextConfig.assetPrefix = '';
}

export default withNextIntl(withMDX(nextConfig));
