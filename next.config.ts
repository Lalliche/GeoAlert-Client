import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    buildActivity: false,
    //buildActivityPosition: "bottom-right",
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": "./src/components",
    };
    return config;
  },
  /* env: {
    API_URL: "https://api.example.com",
    DEV_MODE: true,
  }, */
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
