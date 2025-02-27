/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    productionBrowserSourceMaps: true,
}

module.exports = nextConfig
