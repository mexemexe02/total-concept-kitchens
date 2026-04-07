/** @type {import('next').NextConfig} */
// Standalone output bundles a minimal Node server for Docker / Coolify (self-hosted).
const nextConfig = {
  output: "standalone",
  // Starter page loads SVGs from nextjs.org via next/image — needs an allowlist.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextjs.org",
        pathname: "/icons/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
