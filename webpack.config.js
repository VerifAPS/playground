const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',

    devServer: {
        contentBase: './dist',
        hot: true
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        /*new MonacoWebpackPlugin({
            languages: ['json'],
            features: [
                'clipboard',
                'comment',
                'contextmenu',
                'coreCommands',
                'cursorUndo',
                'dnd',
                'find',
                'format',
                'hover',
                'inPlaceReplace',
                'iPadShowKeyboard',
                'linesOperations',
                'links',
                'parameterHints',
                'quickCommand',
                'quickFixCommands',
                'smartSelect',
                'suggest',
                'wordHighlighter',
                'wordOperations',
            ],
        }),*/
        new ManifestPlugin(),
        new HtmlWebpackPlugin({
            title: 'ST Editor',
            inject: 'body',
            template: 'src/index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader", options: {sourceMap: true}},
                    /*{
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },*/
                    {loader: "sass-loader", options: {sourceMap: true}}
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(txt|st)$/,
                use: 'raw-loader'
            }
        ]
    }
}

