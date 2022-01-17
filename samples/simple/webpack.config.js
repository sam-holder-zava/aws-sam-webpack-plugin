const path = require('path')
const AwsSamPlugin = require('aws-sam-webpack-plugin')
const awsSamPlugin = new AwsSamPlugin()

module.exports = {
  entry: () => awsSamPlugin.entry(),
  
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: path.resolve('.')
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],

    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  
  target: 'node',
  externals: process.env.NODE_ENV === 'development' ? [] : ['aws-sdk'],
  mode: process.env.NODE_ENV || 'production',
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ]
  },

  plugins: [
    awsSamPlugin
  ],

}