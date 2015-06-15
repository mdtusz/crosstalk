module.exports = {
  entry: './src/crosstalk.js',
  output: {
    path: __dirname + '/build',
    filename: 'crosstalk.min.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  externals: [{
    "window": "window"
  }]
};