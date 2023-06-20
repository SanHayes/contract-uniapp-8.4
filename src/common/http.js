import Request from 'luch-request'
import store from '@/store'
import i18n from '@/locale'

const http = new Request();
//全局配置修改
http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = process.env.VUE_APP_BASE_URL
    return config
})

//在请求之前拦截
http.interceptors.request.use((config) => {
    // 可使用async await 做异步操作
    config.header = {
        ...config.header,
    }
    console.log(`request config`, config)
    // 演示custom 用处
    // if (config.custom.auth) {
    //   config.header.token = 'token'
    // }
    // if (config.custom.loading) {
    //  uni.showLoading()
    // }
    const {getters} = store
    // 全局请求参数
    const globalParam = {
        "language": uni.getLocale(),
        "wallet_address": getters.address === i18n.t(`connect`) ? null : getters.address,
        "link": getters.walletLink[getters.walletIndex]
    }
    config.data = {...config.data, ...globalParam}
    /**
     /* 演示
     if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
      return Promise.reject(config)
    }
     **/
    return config
}, config => {
    // 可使用async await 做异步操作
    return Promise.reject(config)
})

//在请求之后拦截
http.interceptors.response.use((res) => {
    uni.hideLoading()
    uni.hideNavigationBarLoading()
    const {statusCode, data} = res
    if (statusCode === 200) {
        return Promise.resolve(data)
    }
}, (res) => {
    console.log(`res onReject`, res)
    // 容错处理
    return Promise.resolve({})
})
export default http