// const wp_conf = require('./webpack.prod.conf')

module.exports = {
  publicPath: '/static/',

  // configureWebpack: {
  //   output: {
  //     libraryExport: 'default'
  //   },
  // devtool: 'nosources-source-map'
  // }
  pages: {
    main: {
      entry: 'src/pages/main/main.js',
      template: 'public/main.html',
      filename: 'main.html',
      title: 'Main',
      chunks: ['chunk-vendors', 'chunk-common', 'main']
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
    debug: {
      entry: 'src/pages/debug/debug.js',
      template: 'public/debug.html',
      filename: 'debug.html',
      title: 'Debug',
      chunks: ['chunk-vendors', 'chunk-common', 'debug']
    },
  },

  productionSourceMap: false
}