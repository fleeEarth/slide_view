const resolve = dir => require('path').join(__dirname, dir);
module.exports = {
  publicPath: './',
  assetsDir: 'static',
  outputDir: 'dist',
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 3100,
    open: false,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/slide', // 代理地址，这里设置的地址会代替 axios 中设置的 baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置（是否允许开启代理）
        secure: false, // https 协议才设置
        pathRewrite: { // 路径重写
          '^/api': '/'
        },
      },
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
}