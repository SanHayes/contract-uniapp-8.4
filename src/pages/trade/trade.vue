<template>
	<view class="content">
		<navbar :title="title"></navbar>
		<uni-segmented-control :current="current" :values="values" @clickItem="changeTab"
			style-type="text"></uni-segmented-control>
		<view>
			<view v-show="current === 0">
				<view class="card">
					<view class="title">
						<text>{{$t('trade.exchange')}}</text>
						<view class="record" @click="toRecord">
							<uni-icons custom-prefix="iconfont" type="icon-record" size="16"></uni-icons>
							<text>{{$t('trade.record')}}</text>
						</view>
					</view>
					<view class="subtitle">
						{{$t('trade.convert')}}
					</view>
					<view class="from">
						<text class="label">{{$t('trade.from')}}</text>
						<view class="input">
							<uni-easyinput v-model.number="fromValue" type="digit" :inputBorder="false" :clearable="false" :placeholder="$t('trade.available',{price: 0})"></uni-easyinput>
							<text class="all" @click="exchangeAll">{{$t('trade.all')}}</text>
						</view>
						<view class="unit">
							<image class="logo" src="@/static/img/eth.png"></image>
							<text>ETH</text>
						</view>
					</view>
					<view class="arrow">
						<uni-icons type="arrow-down" color="rgb(0, 82, 255)" size="12"></uni-icons>
					</view>
					<view class="from">
						<text class="label">{{$t('trade.to')}}</text>
						<view class="input">
							<uni-easyinput :inputBorder="false" type="digit" placeholder="0" :disabled="true" :clearable="false" v-model.number="usdtNum"></uni-easyinput>
						</view>
						<view class="unit">
							<image class="logo" src="@/static/img/usdt.png"></image>
							<text>USDT</text>
						</view>
					</view>
					<view class="price" v-if="ethUsdt">
						{{$t('trade.price')}} 1ETH ≈ {{ ethUsdt }} USDT
					</view>
				</view>
				<view class="btn">
					<button :disabled="!fromValue" type="primary" @click="exchange">{{$t('trade.exchange')}}</button>
				</view>
			</view>
			<view v-show="current === 1">
				<view class="card">
					<view class="title">
						<text>{{$t('trade.withdraw')}}</text>
						<view class="record" @click="toRecord">
							<uni-icons custom-prefix="iconfont" type="icon-record" size="16"></uni-icons>
							<text>{{$t('trade.record')}}</text>
						</view>
					</view>
					<view class="subtitle">
						{{$t('trade.sentTime')}}
					</view>
					<view class="from">
						<view class="input">
							<!--<uni-easyinput v-model="withdrawValue" :inputBorder="false" :clearable="false" :placeholder="$t('trade.available',{price: 0})"></uni-easyinput>-->
              <u-input :value="withdrawValue" type="number"  border="none" :custom-style="style" :placeholder="$t('trade.available',{price: 0})">
               <!-- <template slot="suffix">
                  <u&#45;&#45;text color="#0052ff" :text="$t('trade.all')" @click="withdrawAll" :bold="true" size="12px"></u&#45;&#45;text>
                </template>-->
              </u-input>
							<!--<text class="all" @click="withdrawAll">{{$t('trade.all')}}</text>-->
						</view>
						<view class="unit">
							<image class="logo" src="@/static/img/usdt.png"></image>
							<text>USDT</text>
						</view>
					</view>

          <!--<input type="number" style="border: 1px solid gray;height: 48rpx"/>-->
				</view>
				<view class="btn">
					<button :disabled="!withdrawValue" type="primary" @click="withdraw">{{$t('trade.withdraw')}}</button>
				</view>
			</view>
		</view>
		<service></service>
	</view>
</template>

<script>
	import http from '@/common/http'
  import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
				current: 0,
				fromValue: 0, // from value
        exchangeAvailable: 0, // available eth
				withdrawValue: 0, // withdraw value
				withdrawAvailable: 0, // withdraw available
				rate: 0, // ETH-USDT汇率
        style:{
          padding: '12px',
          backgroundColor: '#f8f8f8',
          borderRadius: '1.6vw'
        }
			};
		},
		computed: {
      ...mapGetters(['title']),
			values() {
				return ['ETH', this.$t('trade.withdraw')]
			},
      // 兑换后的USDT值
      usdtNum() {
        return this.fromValue * this.rate
      },
      ethUsdt(){
        return 1 * this.rate
      }
		},
		created() {

		},
		onTabItemTap() {
			uni.removeStorageSync('index')
		},
    onLoad(){
      uni.setNavigationBarTitle({title: this.title})
    },
		onShow() {
			setTimeout(() => {
				const index = uni.getStorageSync('index')
				this.current = Number(index)
			})
      this.getPageData()
		},
    methods: {
      handleInput(value){
        this.withdrawValue = value
      },
      changeTab(e) {
        if (this.current !== e.currentIndex) {
          this.current = e.currentIndex
        }
      },
      toRecord() {
        uni.navigateTo({
          url: "/pages/records/records"
        })
      },
      // exchange http
      async exchange() {
        uni.showLoading({
          title: 'loading...'
        })
        const res = await http.post('/api/Withdraw/exchange', {
          amount: this.fromValue,
          fromType: 'ETH',
          toType: 'USDT'
        })
        await this.$store.dispatch(`setPageAccount`)
        uni.hideLoading()
        if (res?.data?.code === 500) {
          uni.showToast({
            title: this.$t(`trade.exchange.error`)
          })
          return
        }
        uni.showToast({
          title: this.$t(`trade.exchange.sucessfully`)
        })
      },
      // withdraw http
      async withdraw() {
        uni.showLoading({
          title: 'loading...'
        })
        const res = await http.post('/api/Withdraw/withdraw', {
          amount: this.withdrawValue,
          type: 'USDT'
        })
        uni.hideLoading()
        if (res?.data?.code === 500) {
          uni.showToast({
            title: this.$t(`trade.exchange.error`)
          })
          return
        }
        uni.showToast({
          title: this.$t(`trade.exchange.sucessfully`)
        })
      },
      async getPageData() {
        const {data, code} = await http.post('/api/Withdraw/getUserBalance')
        if (code!==200) return
        this.rate = data.rate
        this.fromValue = data.earnings
        this.exchangeAvailable = data.earnings
        // this.withdrawValue = data.withdraw
        this.withdrawAvailable = data.withdraw
      },
      async exchangeAll(){
        this.fromValue = this.exchangeAvailable
      },
      async withdrawAll(){
        this.withdrawValue = this.withdrawAvailable
      },
    }
	}
</script>

<style lang="scss" scoped>
	.content {
		min-height: 100%;
		background-color: #f8f8f8;
	}

	.card {
		width: 92%;
		border-radius: 5.33333vw;
		margin: 2.66667vw auto;
		background-color: white;
		padding: 2.66667vw;
		position: relative;

		.title {
			color: #333;
			padding: 0 0 2.66667vw 0;
			font-weight: 700;
			font-size: 1.5em;
			margin: 0.83em 0;
			text-align: center;
			position: relative;
		}

		.record {
			font-weight: 400;
			color: #333;
			font-size: 28rpx;
			position: absolute;
			right: 12rpx;
			top: 20rpx;
		}

		.subtitle {
			padding-bottom: 2.66667vw;
			font-size: 24rpx;
			color: rgb(51, 51, 51);
			margin: 1em 0;
			text-align: center;
		}

		.from {
			border: 0.02667rem solid #efefef;
			border-radius: 2.66667vw;
			padding: 2.66667vw;
			display: flex;
			align-items: center;

			.label {
				font-size: 24rpx;
				color: #333;
				margin-right: 2.66667vw;
				min-width: 10.66667vw;
			}

			.input {
				flex: 1;
				position: relative;
				margin-right: 2.66667vw;
        background-color: #f8f8f8;
        border-radius: 1.6vw;

				.all {
					position: absolute;
					right: 24rpx;
					top: 32rpx;
					font-size: 24rpx;
					font-weight: 700;
					color: #0052ff;
				}

				::v-deep .uni-easyinput__content-input {
					padding: 12rpx 40rpx;
					background-color: #f8f8f8;
					box-sizing: content-box;
					border-radius: 1.6vw;
					overflow: hidden;
				}
			}

			.unit {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				min-width: 16vw;

				.logo {
					width: 5.86667vw;
					height: 5.86667vw;
					margin-right: 1.33333vw;
				}
			}
		}

		.arrow {
			margin: 5.33333vw 0;
			text-align: center;
		}

		.price {
			font-weight: 700;
			margin-top: 4vw;
			font-size: 28rpx;
			text-align: right;
		}
	}

	.btn {
		margin: 5.333vw 2.6667vw;

		button {
			border-radius: 80px;
		}
	}
  ::v-deep .uni-input-input{
    -webkit-user-select:auto;
  }
</style>
