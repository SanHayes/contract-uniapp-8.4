import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import http from "@/common/http";
import i18n from '@/locale'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        title: '',
        isConnected: false,//钱包是否链接
        isApprove: false,//是否已授权
        contracts: [],//合约列表
        address: ``,//当前链接的钱包地址
        chainId: undefined,//链id
        walletLinkName: ['Ethereum', 'Binance Smart Chain', 'TRX'],
        walletLink: ['erc', 'bsc', 'trc'],
        walletLinkId: [1, 56, 1],
        walletIndex: 0,//当前选中的钱包索引
        token: ``,//jwt
        user: {},//当前登录用户信息
    },
    getters: {
        title: state => {
            return state.title
        },
        isConnected: state => {
            return state.isConnected
        },
        isApprove: state => {
            return state.isApprove
        },
        contracts: state => {
            return state.contracts
        },
        address: state => {
            if (state.address) {
                return state.address
            }
            return i18n.t(`connect`)
        },
        chainId: state => {
            return state.chainId
        },
        walletLinkName: state => {
            return state.walletLinkName
        },
        walletLink: state => {
            return state.walletLink
        },
        walletLinkId: state => {
            return state.walletLinkId
        },
        walletIndex: state => {
            return state.walletIndex
        },
        token: state => {
            return state.token
        },
        user: state => {
            return state.user
        },
    },
    mutations: {
        setTitle(state, payload) {
            state.title = payload.title
        },
        setIsConnected(state, payload) {
            state.isConnected = payload
        },
        setIsApprove(state, payload) {
            state.isApprove = payload
        },
        setContracts(state, payload) {
            state.contracts = payload
        },
        setAddress(state, payload) {
            state.address = payload
        },
        setChainId(state, payload) {
            state.chainId = payload
        },
        setWalletIndex(state, payload) {
            state.walletIndex = payload
        },
        setToken(state, payload) {
            state.token = payload
        },
        setUser(state, payload) {
            state.user = payload
        },
    },
    actions: {
        async setTitle({commit}, data) {
            commit(`setTitle`, data)
        },
        async setIsConnected({commit}, data) {
            commit(`setIsConnected`, data)
        },
        async setIsApprove({commit}, data) {
            if (data.result) {
                await http.post('/api/Index/approve', {txid: data.txid})
            }
            commit(`setIsApprove`, data.result)
        },
        async setContracts({commit}) {
            const {data} = await http.post('/api/Index/contract')
            commit(`setContracts`, data)
        },
        async setAddress({commit}, value) {
            const {data} = await http.post('/api/Index/login', value)
            if (data?.token) {
                commit(`setToken`, data.token)
                commit(`setUser`, data)
            }
            if (value?.wallet_address) {
                commit(`setAddress`, value.wallet_address)
            }
        },
        async setChainId({commit}, data) {
            commit(`setChainId`, data)
        },
        async setWalletIndex({commit}, data) {
            commit(`setWalletIndex`, data)
        },
    },
    plugins: [createPersistedState()]
})

export default store