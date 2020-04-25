const path = require('path');

/**
 * @typedef { import("webpack").Configuration } WebpackConfig
 * @type WebpackConfig
 */
const baseConfig = {
    mode: 'development',
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        publicPath: '/',
        globalObject: 'this'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: []
}
/**
 * @type WebpackConfig
 */
const serverConfig = {
    ...baseConfig,
    target: 'node',
    entry: {
        server: path.resolve(__dirname, 'src/Server.ts')
    }
}
/**
 * @type WebpackConfig
 */
const clientConfig = {
    ...baseConfig,
    target: 'web',
    entry: {
        client: path.resolve(__dirname, 'src/Client.ts')
    }
}
module.exports = [clientConfig, serverConfig];