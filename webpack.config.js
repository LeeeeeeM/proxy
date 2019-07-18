const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'


module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/main.js'),
    // test: path.resolve(__dirname, './test.js')
  },
  mode: devMode ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, './src/main.js'),
    filename: '[name].js',
    publicPath: '/'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          // compact: false
        }
      },
      exclude: /node_modules/
    }, {
      test: /\.css/,
      use: ['style-loader', 'css-loader']
    }]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: '8081',
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['main']
    }),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   filename: 'test.html',
    //   inject: 'body',
    //   chunks: ['test']
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  node: {
    fs: 'empty',
    console: true
  }
}