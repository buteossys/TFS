/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker/Cloud Run
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: []
  },
  // Removed rewrites - all API calls now go through Next.js API routes
  // which proxy to the headless backend at https://api.soar-commerce.com
};

module.exports = nextConfig; 