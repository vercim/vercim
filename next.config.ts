import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

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

export default function nextConfig(phase: string): NextConfig {
  return {
    ...config,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  };
}
