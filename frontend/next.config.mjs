/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Tree-shake lucide-react icons at build time to prevent long compilation tasks
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Ensure modern JavaScript targets without legacy polyfill bloat
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
