import Request from 'luch-request'
const http = new Request();
http.setConfig((config) => {
	/* config 为默认全局配置*/
	config.baseURL = process.env.NODE_ENV === 'development' ? 'https://blockapi.ethvip.info/' :
		'https://hantec22.com/99'
	config.header = {
		authorization: 'ethvip.info'
	}
	return config
})
http.interceptors.response.use((res) => {
	const {
		statusCode,
		data
	} = res
	if (statusCode === 200) {
		return Promise.resolve(data)
	}
}, (res) => {

})
export default http