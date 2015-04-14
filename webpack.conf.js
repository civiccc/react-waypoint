/* global process */

var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

module.exports = {
  output: {
    library: 'Waypoint',
    libraryTarget: 'var'
  },

  externals: {
    react: 'React'
  },

  node: {
    Buffer: false
  },

  plugins: plugins
};
