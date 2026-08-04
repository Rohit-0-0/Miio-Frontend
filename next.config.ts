import type { NextConfig } from "next";
console.log("NEXT CONFIG LOADED");
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
    ],
  },
};

export default nextConfig;
