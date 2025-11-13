/** @type {import('next').NextConfig} */
const FRAMER = 'https://nexumserver.com'; // <- set this

const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: false },
  async rewrites() {
    return [
      // Proxy everything EXCEPT /cloud and /api to Framer
      { source: '/', destination: `${FRAMER}/` },
      { source: '/((?!cloud|api|_next|favicon.ico|robots.txt|sitemap.xml).*)', destination: `${FRAMER}/:1` },
    ];
  },
};

export default nextConfig;
