module.exports = {
    outputDir: 'dist',
    publicPath: process.env.NODE_ENV === 'production' ? '/@molgenis-ui/snp-visualization/dist/' : '/',
    configureWebpack: {
      devtool: 'source-map'
    }
  }