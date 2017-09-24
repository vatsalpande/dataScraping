const path = require('path');
 var webpack = require('webpack');
new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: "jquery",
    'window.jQuery': 'jquery',
    'window.$': 'jquery'
}),

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'css-loader' ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
            },
            // {test: /datatables\.net.*/, loader: 'imports?define=>false'}
        ]
    }
};