import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/algoforge",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
