
let path = require('path')
let webpack = require('webpack')

module.exports = {
    entry: {
        "main": './src/js/calendar'
    },
    output: {
        path: path.resolve(__dirname, './dist'),  //指定打包到dist文件
        filename: 'calendar.js'
    },
    module: {
        rules: [
            {
                test: /\.scss?$/,
                exclude: /node_modules/,
                loader: "style-loader!css-loader!sass-loader"
            }
        ]
    }
}