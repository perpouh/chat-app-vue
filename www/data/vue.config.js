// vue.config.js
module.exports = {
  // options...
  devServer: {
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
      },
  }
}