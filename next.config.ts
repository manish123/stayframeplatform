import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // This is needed for route groups to work properly
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable React's experimental compiler
  compiler: {
    reactRemoveProperties: false,
  },
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable static optimization for all pages
  output: 'standalone',
  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pb7i6jljvjqbdgtm.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      // Add other domains as needed
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
