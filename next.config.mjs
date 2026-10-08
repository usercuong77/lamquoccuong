/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/edit", destination: "/edit/index.html" },
      { source: "/edit/", destination: "/edit/index.html" },
      { source: "/bio", destination: "/bio/index.html" },
      { source: "/bio/", destination: "/bio/index.html" },
      { source: "/nuoitoi", destination: "/nuoitoi/index.html" },
      { source: "/nuoitoi/", destination: "/nuoitoi/index.html" }
    ];
  }
};

export default nextConfig;
