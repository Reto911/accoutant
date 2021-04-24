// const wp_conf = require('./webpack.prod.conf')

module.exports = {
  publicPath: '/static/',
  pages: {
    index: {
      entry: 'src/pages/index/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Index',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    login: {
      entry: 'src/pages/login/login.js',
      template: 'public/login.html',
      filename: 'login.html',
      title: 'Login',
      chunks: ['chunk-vendors', 'chunk-common', 'login']
    },
    register: {
      entry: 'src/pages/register/register.js',
      template: "public/register.html",
      filename: "register.html",
      title: 'Register',
      chunks: ['chunk-vendors', 'chunk-common', 'register']
    },
    reset: {
      entry: 'src/pages/reset/reset.js',
      template: "public/reset.html",
      filename: "reset.html",
      title: 'Reset',
      chunks: ['chunk-vendors', 'chunk-common', 'reset']
    },
  }
  // configureWebpack: {
  //   output: {
  //     libraryExport: 'default'
  //   },
    // devtool: 'nosources-source-map'
  // }
}