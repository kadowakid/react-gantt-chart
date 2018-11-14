const webpack = require('webpack');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;
const dev = NODE_ENV === 'development';

const config = {
  mode: NODE_ENV,
  devtool: dev ? 'inline-source-map' : undefined,
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'app.js'
  },
  devServer: {
    contentBase: 'docs',
    port: 9000,
    open: true
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.s?css$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    })
  ],
  performance: {
    hints: false
  }
};

module.exports = config;