const path = require('path');
// const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require("child_process")
// const banner = require("./banner.js")

module.exports = {
  mode: 'development',
  entry: {
    main: './index.js'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: path.resolve('./myLoader.js')
      // },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './dist',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 2kb
        }
      }
    ]
  },
  plugins: [
    // new MyWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}\n
        Commit: ${childProcess.execSync('git config user.name')}
      `
    })
  ]
}