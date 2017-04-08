var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './entry.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader", options: {
            strictMath: true,
            noIeCompat: true
          }
        }]
      }]
  },
  devServer: {
    //contentBase: path.join(__dirname, "dist"),
    //compress: true,
    port: 9004,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin()
    // prints more readable module names in the browser console on HMR updates
  ]

}