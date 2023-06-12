<template>
	<view>
		<uni-nav-bar height="96rpx" leftWidth="180rpx" rightWidth="300rpx" :border="false">
			<view slot="left">
				<picker @change="handleChange" :value="value" :range="langArr" range-key="text">
					<view class="lang">
						<text class="text">{{langArr[value].text}}</text>
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
	import comweb3 from "@/common/web3.min.js"
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
			}
		},
		watch: {
			isconnect(newVal) {
				newVal && this.$emit('connect')
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
			getcontract() {
				uni.showLoading()
				var that = this
				var ysdata = {}
				ysdata['action'] = 'contract'
				let ys_over = comjs.ApiSync(ysdata);
				ys_over.then(function(res) {
					that.contract = res.data
					comjs.log(that.contract)
				});
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
						if (that.walletlink[that.chainId] == 'trc') {
							that.trccontent()
						} else {
							that.ethcontent()
						}
					}
				})
			},
			async ethcontent() {
				//检测是否以太环境
				var that = this
				var obj = setInterval(async () => {
					if (window.ethereum) {
						clearInterval(obj);
						if (typeof web3 !== 'undefined') {
							that.web3js = new comweb3(web3.currentProvider);
						} else {
							that.web3js = new comweb3(new Web3.providers.HttpProvider("http://localhost:8545"));
						}
						const myadd = await ethereum.request({
							method: 'eth_requestAccounts'
						});
						//const echainId = await ethereum.request({method: 'eth_chainId'});
						comjs.msg(echainId)
						that.ethcontent_chain()
					} else if (window.tronWeb) {
						comjs.msg('tronWeb')
						if (window.tronWeb.defaultAddress.base58) {
							clearInterval(obj);
							that.address = window.tronWeb.defaultAddress.base58
							that.isconnect = true
							that.chainId = 2;
							that.mychainId = 1;
							that.contenttxt = that.address.substr(0, 5) + '***' + that.address.substr(-5)
							that.tronWeb = window.tronWeb;
						}
					} else {
						comjs.msg('not net')
						clearInterval(obj);
						if (!that.isauto) {
							that.show_ethWallet_list()
						}
					}
				}, 100)
			},
			async trccontent() {
				var that = this
				if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
					that.address = window.tronWeb.defaultAddress.base58
					that.isconnect = true
					that.chainId = 2;
					that.mychainId = 1;
					that.contenttxt = that.address.substr(0, 5) + '***' + that.address.substr(-5)
					that.tronWeb = window.tronWeb;
				} else {
					that.show_ethWallet_list()
				}
			},
			show_ethWallet_list() {
				//钱包跳转
				let that = this
				let dappdomain = 'http://www.1.com/' //本站域名
				//各个以太坊钱包地址
				let walletName = ['MetaMask', 'Coinbase', 'imToken', 'TokenPocket', 'TrustWallet']
				let walletUrl = {}
				walletUrl[0] = 'https://metamask.app.link/dapp/' + dappdomain
				walletUrl[1] = 'https://go.cb-w.com/'
				walletUrl[2] = 'imtokenv2://navigate/DappView?url=' + dappdomain
				walletUrl[3] = 'tpdapp://open?params={"url": "' + dappdomain + '", "chain": "ETH"}'
				walletUrl[4] = 'https://link.trustwallet.com/open_url?url=' + dappdomain
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
				var that = this
				try {
					const echainId = await ethereum.request({
						method: 'eth_chainId'
					});
					//comjs.msg(echainId);
					that.mychainId = comweb3.utils.hexToNumber(echainId)
					if (that.isauto) {
						if (that.mychainId == 1) {
							that.chainId = 0;
						} else if (that.mychainId == 56) {
							that.chainId = 1;
						}
						that.ethcontent_address();
					} else {
						if (that.mychainId == that.walletlinkid[that.chainId]) {
							that.ethcontent_address();
						} else if (!that.isauto) {
							comjs.jsalert('请切换链到: ' + that.walletlinkName[that.chainId]);
						}
					}
				} catch (e) {
					comjs.jsalert('连接失败');
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