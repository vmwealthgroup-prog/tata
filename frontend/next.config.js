/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Mandatory for Hostinger deployment
  reactStrictMode: true,
  swcMinify: true,
  // Disabling Turbopack for production builds to avoid compilation crashes on lower-tier servers
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
};

export default nextConfig;
