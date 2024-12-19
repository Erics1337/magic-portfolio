import mdx from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const withMDX = mdx({
    extension: /\.mdx?$/,
    options: { },
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        runtime: 'edge', // Use Cloudflare's edge runtime
        outputFileTracingRoot: __dirname, // Ensure correct output paths
      },
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': '/src',  // This allows absolute imports from the src directory
        };
        return config;
    },
};

if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
  }

export default withNextIntl(withMDX(nextConfig));
