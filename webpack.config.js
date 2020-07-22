
const nodeExternals = require('webpack-node-externals');

var path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            {
                                plugins: [
                                    '@babel/plugin-transform-react-jsx'
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    },
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react')
        }
    }
};