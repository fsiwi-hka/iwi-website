module.exports = {
    future: {
        webpack5: false,
    },
    webpack: function(config) {
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader',
        })
        return config
    },
    trailingSlash: true
}
