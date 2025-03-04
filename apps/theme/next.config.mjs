import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), 'env.local'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default nextConfig;
