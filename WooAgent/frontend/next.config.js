/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  // Enable static exports for production
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
};

module.exports = nextConfig;
