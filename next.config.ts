import type { NextConfig } from "next";

// Only set for GitHub Pages builds (CI). Leave unset for local `npm run dev`.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/website" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
