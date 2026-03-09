import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEAPI_AI_KEY: process.env.DEAPI_AI_KEY,
  },
  serverExternalPackages: ["@boundaryml/baml"],
  transpilePackages: [
    "@bm/ai-shared",
  ],
};

export default nextConfig;
