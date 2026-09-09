import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent dir that
  // happens to contain a lockfile (e.g. the home directory).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
