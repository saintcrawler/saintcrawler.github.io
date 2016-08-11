const path = require('path'); 
const webpack = require('webpack');

module.exports = {
  entry: [
    './js/index'
  ],

  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.min.js'
  },
  
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'js')
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ]
};