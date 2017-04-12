const path = require('path');

const config = {
  entry: path.join(__dirname, 'spec/performance-test.jsx'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'performance-test.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
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

module.exports = config;
