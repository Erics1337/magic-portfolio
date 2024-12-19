/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
    output: 'export',  // Enable static exports
    distDir: 'out',   // Specify the output directory
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

module.exports = withNextIntl(nextConfig);
