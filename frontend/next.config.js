
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move turbopack under experimental
  experimental: {
    turbopack: {
      // your turbopack rules or options go here
    },
  },
};

module.exports = nextConfig;
