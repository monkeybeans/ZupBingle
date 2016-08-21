module.exports = {
  entry: ['./client/src/app.js'],
  output: {
    path: './public/js',
    filename: 'zup-bingle.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
  }
};
