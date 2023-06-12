const pkg = require('./package.json')
const dayjs = require('dayjs')
const Webpack = require('webpack')
const { short } = require('git-rev-sync')

// 适配spug获取commit id的方式
const SPUG_GIT_COMMIT_ID = process.env.SPUG_GIT_COMMIT_ID

const info = {
    ...pkg,
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    commit: `${SPUG_GIT_COMMIT_ID ?? short()}`,
}

process.env.VUE_APP_INFO = JSON.stringify(info)

module.exports = {
    transpileDependencies: ['@dcloudio/uni-ui'],
    devServer: {
        proxy: {
            '/api': {
                target: 'https://blockapi.ethvip.info/',
                changeOrigin: true
            },
        }
    },
    configureWebpack() {
        return {
            plugins: [
                new Webpack.DefinePlugin({
                    __APP_INFO__: process.env.VUE_APP_INFO,
                }),
            ]
        }
    },
}