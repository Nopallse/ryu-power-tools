import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ryu.pariamankota.tech',
      },
      {
        protocol: 'https',
        hostname: 'ryu.pariamankota.tech',
      },
    ],
  },
};

export default nextConfig;
