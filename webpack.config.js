var HTMLWebpack = require('html-webpack-plugin');
var ExtractText = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    main: './src',
  },
  output: {
    path: './build',
    filename: '[name].js',
  },
  devtool: debug ? '#source-map' : null,
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'react-hot-loader!babel-loader', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' },
      { test: /\.scss$/, loader: ExtractText.extract('style', 'css?sourceMap!sass') },
      { test: /\.sass$/, loader: ExtractText.extract('style', 'css?sourceMap!sass?indentedSyntax=true') },
      { test: /\.css$/, loader: ExtractText.extract('style', 'css?sourceMap') },
      { test: /\.(png|jpg|woff2?|ttf|eot|svg)(\?|$)/, loader: 'file' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  babel: {
    stage: 0,
    optional: ['runtime']
  },
  plugins: [
    new ExtractText('bundle.css', { disable: debug, allChunks: true }),
    new HTMLWebpack({
      inject: true,
      template: 'src/assets/index.html',
    }),
    new webpack.DefinePlugin({
      DEBUG: debug
    })
  ],
};
