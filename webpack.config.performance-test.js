const path = require('path');

// This config file is used to create a webpack bundle that we use on
// test/performance-test.html to profile the performance footprint of the
// component.
module.exports = {
  entry: path.join(__dirname, 'test/performance-test.jsx'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'performance-test.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
