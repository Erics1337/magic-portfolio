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
    },
    trailingSlash: true,
};

export default withNextIntl(withMDX(nextConfig));
