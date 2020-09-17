const path = require('path')

module.exports = {
  entry: {
    app: './src/game.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'meltdownatomiccity.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
}