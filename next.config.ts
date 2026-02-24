import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["sharp", "heic-convert"],
};

export default nextConfig;
