module.exports = {
	transpileDependencies: ['@dcloudio/uni-ui'],
	devServer: {
		proxy: {
			'/api': {
				target: 'https://blockapi.ethvip.info/',
				changeOrigin: true
			},
		}
	}
}