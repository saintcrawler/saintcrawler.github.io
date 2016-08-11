const path = require('path'); 
const host = 'localhost';
const port = 8000;

module.exports = {
  entry: [
    'webpack-dev-server/client?http://' + host + ':' + port,
    'webpack/hot/only-dev-server',
    './js/index'
  ],

  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.js'
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

  devServer: {
    host,
    port,
    publicPath: '/dist/js',    
    historyApiFallback: true
  }
};