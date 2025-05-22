import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/", // when someone accesses /
        destination: "/login", // redirect them to /login
        permanent: false, // use true if it's a permanent redirect
      },
    ];
  },

  experimental: {
    turbo: {
      resolveAlias: {
        "@components": [path.resolve(__dirname, "./src/components")],
      },
    },
    scrollRestoration: true,
  },
};

export default nextConfig;
