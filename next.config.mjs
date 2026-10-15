/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/*': ['./private/admin-credentials.txt'],
  },
  async rewrites() {
    return [
      { source: "/edit", destination: "/edit/index.html" },
      { source: "/edit/", destination: "/edit/index.html" },
      { source: "/bio", destination: "/bio/index.html" },
      { source: "/bio/", destination: "/bio/index.html" },
      { source: "/nuoitoi", destination: "/nuoitoi/index.html" },
      { source: "/nuoitoi/", destination: "/nuoitoi/index.html" },
      { source: "/thiepcuoi", destination: "/thiepcuoi/index.html" },
      { source: "/thiepcuoi/", destination: "/thiepcuoi/index.html" },
      { source: "/thiepmoinhatrai", destination: "/thiepcuoi/index.html" },
      { source: "/thiepmoinhatrai/", destination: "/thiepcuoi/index.html" },
      { source: "/thiepmoinhagai", destination: "/thiepcuoi/index.html" },
      { source: "/thiepmoinhagai/", destination: "/thiepcuoi/index.html" },
      { source: "/thiepcuoi/nhatrai", destination: "/thiepcuoi/index.html" },
      { source: "/thiepcuoi/nhatrai/", destination: "/thiepcuoi/index.html" },
      { source: "/thiepcuoi/nhagai", destination: "/thiepcuoi/index.html" },
      { source: "/thiepcuoi/nhagai/", destination: "/thiepcuoi/index.html" }
    ];
  }
};

export default nextConfig;
