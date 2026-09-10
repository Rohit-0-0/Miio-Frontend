import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'assets.guesty.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Prevent accidental jsdom pulls (e.g. isomorphic-dompurify) from breaking Netlify SSR
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],
};

export default nextConfig;
