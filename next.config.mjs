/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ieye-growth',
  assetPrefix: '/ieye-growth',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
