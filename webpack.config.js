const path = require('path');
// const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require("child_process")
// const banner = require("./banner.js")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const apiMocker = require("connect-api-mocker");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const mode = process.env.NODE_ENV || "development"; // 기본값을 development로 설정

module.exports = {
  mode,
  entry: {
    // main: './index.js'
    main: './src/app.js'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  devServer: {
    overlay: true,
    stats: "errors-only",
    port: 9001,
    before: (app) => {
      app.use(apiMocker('/api', '/mocks/api'))
    },
    hot: true,
  },
  optimization: {
    minimizer:
      mode === "production"
        ? [
          new OptimizeCSSAssetsPlugin(),
          // NOTE: TerserPlugin 설정되지 않으면 dist/main.js가 난독화되지 않음
          // new TerserPlugin({
          //   terserOptions: {
          //     compress: {
          //       drop_console: true, // 콘솔 로그를 제거한다
          //     },
          //   },
          // }),
          ]
        : [],
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: path.resolve('./myLoader.js')
      // },
      {
        test: /\.css$/,
        use: [ process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          // publicPath: './dist',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 2kb
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}\n
        Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
        Author: ${childProcess.execSync('git config user.name')}
      `
    }),
    new webpack.DefinePlugin({
      TWO: 1+1,
      'api.domain': JSON.stringify('https://dev.api.com'),
      // api: {
      //   domain: JSON.stringify('https://dev.api.com'),
      // },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: { // 템플릿에 주입할 파라매터 변수 지정
        env: process.env.NODE_ENV === 'development' ? '(개발용)' : '',
      },
      minify: process.env.NODE_ENV === 'production' ? {
        collapseWhitespace: true, // 빈칸 제거
        removeComments: true, // 주석 제거
      } : false,
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ]
}