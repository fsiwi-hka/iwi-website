module.exports = {
  images: { unoptimized: true },
  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  trailingSlash: true
}
