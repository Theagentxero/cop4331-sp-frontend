//console.log("We Have Begin Working")
module.exports = {
    devServer: {
        proxy: {
        '/api': {
          target: 'https://api.crabrr.com',
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: false
        }
      }
    }
  
  }