//console.log("We Have Begin Working")
module.exports = {
    devServer: {
        proxyTable: {
        '/api': {
          target: 'http://127.0.0.1:3030',
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: false
        }
      }
    }
  
  }