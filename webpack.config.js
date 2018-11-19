const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const webpackMerge = require("webpack-merge");

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge({
    entry: './src/index.ts',
    mode,
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          exclude: [
            path.resolve(__dirname,'node_modules/excalibur')
          ],
          enforce: "pre",
        },
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|bmp|json|tmx|tsx|mp3)$/,
          use: [{
            loader: 'file-loader',
            options: {
              emitFile: true
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      filename: '[name].js',
      sourceMapFilename: '[file].map',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin([
        { from: 'src/map', to: 'map/' },
        { from: 'src/images', to: 'images' },
        { from: 'src/sounds', to: 'sounds' }
      ]),
      new HtmlWebPackPlugin({
        title: 'Isle'
      }),
      // new HtmlWebpackIncludeAssetsPlugin({
      //   assets: [ 'map/example.json' ]
      // })
    ]
  },
  modeConfig(mode)
  );
};
