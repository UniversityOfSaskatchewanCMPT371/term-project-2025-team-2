const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, './app.js')
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns:[
                {from: 'index.html', to: 'index.html'},
                {from: 'styles.css', to: 'styles.css'},
                {from: 'manifest.json', to: 'manifest.json'},
                {from: 'icons/', to: 'icons/'}
            ],
        }),
    ],
    mode: 'development',
};