/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable caching during development to prevent stale data issues
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Enable faster refresh
  reactStrictMode: true,
  // Disable ESLint during production build (warnings only)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable caching for API routes in development
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev }) => {
      if (dev) {
        // Disable webpack caching in development
        config.cache = false;
      }
      return config;
    },
  }),
};

export default nextConfig;
