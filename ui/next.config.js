/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  trailingSlash: true,
  output: "export",
  rewrites: () => {
    return [{ source: '/api/:path*', destination: 'http://localhost:5200/api/:path*' }];
  }
}

module.exports = nextConfig