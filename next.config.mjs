import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: { },
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    experimental: {
        workerThreads: false, // Disable worker threads if applicable
        outputFileTracing: true,
      },
    output: "standalone", // Use the standalone build for Next.js
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': '/src',  // This allows absolute imports from the src directory
        };
        return config;
    },
};

export default withNextIntl(withMDX(nextConfig));
