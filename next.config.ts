import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Turbopack-specific configuration
  experimental: {
    turbo: {
      resolveAlias: {
        "@components": [path.resolve(__dirname, "./src/components")],
        // Add other aliases here
      }
    },
    scrollRestoration: true,
  },
};

export default nextConfig;