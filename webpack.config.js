var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './js/app.js',
  output: { path: __dirname + '/build', filename: 'bundle.js', publicPath: __dirname + '/build/' },
  devServer: {
  	contentBase: "./.."
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
    	'process.env': {
    		'NODE_ENV': JSON.stringify('production')
    	}
    })
  ]
};