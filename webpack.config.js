const path = require('path');

module.exports = {
  entry: './src/app/entry.js',
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
  },
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { presets: [ 'es2015' ] },
      }
    ],
  },
};