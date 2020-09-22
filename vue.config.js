module.exports = {
	publicPath: process.env.NODE_ENV === 'development' ? '/' : '/qa/',
	outputDir: 'dist',
	assetsDir: 'static',
	lintOnSave: false,
	productionSourceMap: false,
	devServer: {
		port: 8081,
		open: false,
		https: false,    //是否开启https
		overlay: {
			warnings: false,
			errors: true
		}
	}
}
