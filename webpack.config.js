const path = require('path')

module.exports = {
  entry: {
    app: './src/game.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'meltdownatomiccity.bundle.js'
  }
}