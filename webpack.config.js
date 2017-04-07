var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: "./entry.js",
  output: {
    // path: './dist',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: "style!css",
      },
      {
        test: /\.less$/,
        loader: "style!css!postcss!less",
      }
    ]
  }
}