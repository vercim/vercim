import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.modrinth.com',
      },
      {
        protocol: 'https',
        hostname: 'media.forgecdn.net',
      },
    ],
  },
};

export default config;
