<template>
	<view>
		<uni-nav-bar height="96rpx" leftWidth="180rpx" rightWidth="300rpx" :border="false">
			<view slot="left">
				<picker @change="handleChange" :value="value" :range="langArr" range-key="text">
					<view class="lang">
						<text class="text">{{currentLang}}</text>
						<uni-icons type="bottom" size="12"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="center">
				<image class="logo" src="@/static/img/logo.png"></image>
				<text class="name">{{webTitle}}</text>
			</view>
			<view slot="right">
				<!-- <button class="mini-btn" type="primary" size="mini"></button> -->
				<view class="right">
					<button class="mini-btn" type="primary" size="mini" @click="chooselink">
						<text class="text">{{btnText}}</text>
						<uni-icons custom-prefix="iconfont" type="icon-duidiaojiaohuanduihuan" size="12" color="#fff"></uni-icons>
					</button>
					<uni-icons type="notification" size="21"></uni-icons>
				</view>
			</view>
		</uni-nav-bar>
	</view>
</template>
<script>
	import comjs from "@/common/util.js"
	import http from '@/common/http.js'
  import Web3 from 'web3'
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				lang: '',
				langArr: [{
						lang: 'en',
						text: 'English'
					},
					{
						lang: 'zh-TW',
						text: '繁體中文'
					},
					{
						lang: 'ja',
						text: '日本語'
					},
					{
						lang: 'es',
						text: 'español'
					},
					{
						lang: 'vi',
						text: 'Tiếng Việt'
					},
					{
						lang: 'IN',
						text: 'Bahasa Indonesia'
					},
					{
						lang: 'hi',
						text: 'हिन्दी或हिंदी'
					},
				],
				value: 0,
				webTitle: '',
				contract: [],
				contenttxt: '',
				isconnect: false,
				isauto: true,
				walletlinkName: ['Ethereum', 'Binance Smart Chain', 'TRX'],
				walletlink: ['erc', 'bsc', 'trc'],
				walletlinkid: [1, 56, 1],
				chainId: 100,
				web3js: null,
				pattern: {
					icon: "/static/img/service.jpg"
				}
			}
		},
		watch: {
			isconnect(newVal) {
				newVal && this.$emit('connect')
			},
			address(newVal) {
				newVal && uni.setStorageSync('address', newVal)
			}
		},
		created() {
			this.getcontract()
		},
		computed: {
			btnText() {
				if (this.contenttxt) {
					return this.contenttxt
				}
				return this.$t('connect')
			},
			currentLang() {
				return this.langArr[this.value]?.text ?? `English`
			}
		},
		mounted() {
			if (this.title) {
				this.webTitle = this.title
			} else {
				this.webTitle = uni.getStorageSync('title')
			}
			const lang = uni.getLocale()
			if (lang) {
				this.value = this.langArr.findIndex(item => item.lang === lang)
			}
		},
		methods: {
			async getcontract() {
				uni.showLoading()
				const res = await http.post('/index/Index/contract')
				uni.hideLoading()
				this.contract = res.data
			},
			chooselink() {
				//选择链
				if (this.isconnect) {
					return true;
				}
				this.isauto = false
				let that = this
				uni.showActionSheet({
					title: null,
					itemList: that.walletlinkName,
					success: (res) => {
						that.chainId = res.tapIndex
						//that.chainId = that.walletlinkid[res.tapIndex]
						//console.log(that.link)
						if (that.walletlink[that.chainId] === 'trc') {
							that.trccontent()
						} else {
							that.ethcontent()
						}
					}
				})
			},
			async ethcontent() {
				//检测是否以太环境
				// const that = this;
				const obj = setInterval(async () => {
					if (window.ethereum) {
						clearInterval(obj);
						if (typeof web3 !== 'undefined') {
              this.web3js = new Web3(web3.currentProvider);
						} else {
              this.web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
						}
						// const myadd = await ethereum.request({
						// 	method: 'eth_requestAccounts'
						// });
						// const echainId = await ethereum.request({
						// 	method: 'eth_chainId'
						// });
						// comjs.msg(echainId)
						await this.ethcontent_chain()
					} else if (window.tronWeb) {
						comjs.msg('tronWeb')
						if (window.tronWeb.defaultAddress.base58) {
							clearInterval(obj);
              this.address = window.tronWeb.defaultAddress.base58
              this.isconnect = true
              this.chainId = 2;
              this.mychainId = 1;
              this.contenttxt = this.address.substring(0, 5) + '***' + this.address.substring(this.address.length-5,this.address.length)
              this.tronWeb = window.tronWeb;
						}
					} else {
						comjs.msg('not net')
						clearInterval(obj);
						if (!this.isauto) {
              this.show_ethWallet_list()
						}
					}
				}, 100);
			},
			async trccontent() {
				if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
					this.address = window.tronWeb.defaultAddress.base58
					this.isconnect = true
					this.chainId = 2;
					this.mychainId = 1;
					this.contenttxt = this.address.substring(0, 5) + '***' + this.address.substring(this.address.length-5,this.address.length)
					this.tronWeb = window.tronWeb;
				} else {
					this.show_ethWallet_list()
				}
			},
			show_ethWallet_list() {
				//钱包跳转
				let dappdomain = process.env.VUE_APP_DAPPDOMAIN //本站域名
				//各个以太坊钱包地址
				let walletName = ['MetaMask', 'Coinbase', 'imToken', 'TokenPocket', 'TrustWallet']
				let walletUrl = {}
				walletUrl[0] = `https://metamask.app.link/dapp/${dappdomain}`
				walletUrl[1] = 'https://go.cb-w.com/'
				walletUrl[2] = `imtokenv2://navigate/DappView?url=${dappdomain}`
				walletUrl[3] = `tpdapp://open?params={"url": "${dappdomain}", "chain": "ETH"}`
				walletUrl[4] = `https://link.trustwallet.com/open_url?url=${dappdomain}`
				uni.showActionSheet({
					title: null,
					itemList: walletName,
					success: (res) => {
						console.log('url', walletUrl[res.tapIndex])
						window.location.href = walletUrl[res.tapIndex]
					}
				})
			},
			handleChange(e) {
				const index = e.detail.value
				const langObj = this.langArr[index]
				this.value = index
				this.$i18n.locale = langObj.lang
				uni.setLocale(langObj.lang)
				this.$emit('change')
			},
			async ethcontent_chain() {
				try {
					const echainId = await ethereum.request({
						method: 'eth_chainId'
					});
          this.mychainId = Web3.utils.hexToNumber(echainId)
          console.log(`that.mychainId`,this.mychainId)
					if (this.isauto) {
						if (this.mychainId === 1) {
              this.chainId = 0;
						} else if (this.mychainId === 56) {
              this.chainId = 1;
						}
						await this.ethcontent_address();
					} else {
            // 使用测试网的情况下，下面判断导致一直无法获取地址
						// if (that.mychainId == that.walletlinkid[that.chainId]) {
							await this.ethcontent_address();
						// } else if (!that.isauto) {
						// 	comjs.jsalert('请切换链到: ' + that.walletlinkName[that.chainId]);
						// }
					}
				} catch (e) {
					console.log(`e`, e)
					comjs.jsalert('连接失败');
				}
			},
			async ethcontent_address() {
				const accounts = await this.web3js.eth.getAccounts();
				if (accounts && accounts[0]) {
					this.address = accounts[0]
					this.isconnect = true
					this.contenttxt = this.address.substring(0, 5) + '***' + this.address.substring(this.address.length-5,this.address.length)
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	// ::v-deep .uni-navbar__header {
	// 	height: 96rpx !important;
	// }
	.lang {
		font-size: 28rpx;

		.text {
			margin-right: 16rpx;
		}
	}

	.logo {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}

	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		font-size: 4.26667vw;
		font-weight: bold;

		.name {
			white-space: nowrap;
		}
	}

	.right {
		display: flex;
		align-items: center;

		.mini-btn {
			padding: 8rpx;
			line-height: 1.5;
			font-size: 24rpx;
			margin-right: 12rpx;
		}

		.text {
			padding-right: 8rpx;
		}
	}
</style>