/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: true,
  experimental: {
    turbopack: false,
  },
};

module.exports = nextConfig;
