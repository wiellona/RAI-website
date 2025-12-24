import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true, // Temporary to ignore backend errors
  },
};

export default nextConfig;
