/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Enable SWR for better caching and performance
  swcMinify: true,
  // Enable compression
  compress: true,
}

module.exports = nextConfig
