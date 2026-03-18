import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  transpilePackages: ["@openuidev/react-ui", "@openuidev/react-headless", "@openuidev/react-lang"],
};

export default nextConfig;
