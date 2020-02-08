//console.log("We Have Begin Working")
module.exports = {
  devServer: {
      proxy: {
      '/api': {
        target: 'https://api.crabrr.com',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false
      },
      '/img': {
        target: 'http://img.crabrr.com',
        pathRewrite: { '^/img': '' },
        changeOrigin: true,
        secure: false
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/_global.scss";`
      }
    }
  }
  
}