var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: ['./entry.js','webpack/hot/only-dev-server'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader"
        }]
      },
      {
        test: /\.(png)$/,
        loader: 'url-loader'
      }
      ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 6002,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin()
    // prints more readable module names in the browser console on HMR updates
  ]

}