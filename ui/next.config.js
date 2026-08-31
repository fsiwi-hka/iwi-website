/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: "export",
  // Nur fuer `next dev`: im statischen Export werden Rewrites nicht angewendet,
  // dort uebernimmt der `handle /api/*`-Block im Caddyfile den Proxy aufs Backend.
  rewrites: () => {
    return [{ source: '/api/:path*', destination: 'http://localhost:5200/api/:path*' }];
  }
}

module.exports = nextConfig
