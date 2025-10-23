import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set the correct root directory for Turbopack
  turbopack: {
    root: './',
  },
  images: {
    remotePatterns: [
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
