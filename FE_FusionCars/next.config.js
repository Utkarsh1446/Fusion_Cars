/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com', 'res.cloudinary.com'],
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Enable compression
  compress: true,
  // Disable ESLint during builds (optional - remove if you want strict checks)
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Production URL (optional)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
