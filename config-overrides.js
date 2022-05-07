const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "http": require.resolve("stream-http"),
        "console": require.resolve("console-browserify"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        stream: require.resolve("stream-browserify"),
        'process/browser': require.resolve("process/browser"),
        buffer: require.resolve("buffer"),

    };
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.resolve.alias = {
        ...config.resolve.alias,
        'process/browser': "process/browser"

    }
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            'process/browser': "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    config.ignoreWarnings = [/Failed to parse source map/];  // gets rid of a billion source map warnings
    return config
}
