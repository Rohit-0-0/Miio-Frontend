import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
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
  transpilePackages: ['sonner'],
};

export default nextConfig;
