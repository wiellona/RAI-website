import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  // reactCompiler: true, // Disabled - requires babel-plugin-react-compiler
};

export default nextConfig;
