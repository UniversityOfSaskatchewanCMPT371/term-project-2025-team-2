const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, './app.js')
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    // Module rules to deal with different type of files
    module: {
        rules: [
            // Handling CSS files
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    plugins: [
        // Clean the output directory before each build
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        }),

        new CopyWebpackPlugin({
            patterns:[
                {from: 'styles.css', to: 'styles.css'},
                {from: 'manifest.json', to: 'manifest.json'},
                {from: 'icons/', to: 'icons/'},
                {from: 'service-worker.js', to: 'service-worker.js'},
                {from: 'script.js', to: 'script.js'},
                {from: 'loader/', to: 'loader/'},
                {from: 'tagDictionary/', to: 'tagDictionary/'},
                {from: 'logger/', to: 'logger/'}

            ],
        }),
    ],
    mode: 'development',
};
