<template>
	<view class="account">
		<navbar>
		</navbar>
		<view class="card">
			<view class="row">
				<view class="earnings">
					<view class="label">{{$t("account.earnings")}}</view>
					<view class="value">0.000000 ETH</view>
				</view>
				<view class="record">
					<uni-icons custom-prefix="iconfont" type="icon-record" size="16"></uni-icons>
					<text>{{$t('trade.record')}}</text>
				</view>
			</view>
			<view class="row">
				<view class="today">
					<view class="label">{{$t("account.today")}}</view>
					<view class="value">0.000000 ETH</view>
				</view>
				<view class="yield tr">
					<view class="label">{{$t("account.yield")}}</view>
					<view class="value">--</view>
				</view>
			</view>
			<view class="row mt10">
				<view class="pool">
					<view class="label">{{$t("account.pool")}}</view>
					<view class="value">0.00 usdt</view>
				</view>
				<view class="balance tr">
					<view class="label">{{$t("account.balance")}}</view>
					<view class="value">0.00 usdt</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="currency">
				<view class="unit">
					<image class="logo" src="@/static/img/eth.png"></image>
					<text>ETH</text>
				</view>
				<button class="mini-btn" type="primary" size="mini" @click="toTrade(0)">
					<uni-icons custom-prefix="iconfont" type="icon-duidiaojiaohuanduihuan" size="12" color="#fff"></uni-icons>
					<text class="text">{{$t('trade.exchange')}}</text>
				</button>
			</view>
			<view class="amount">
				<view class="total tl">
					<view class="label">{{$t("account.total")}}</view>
					<view class="value">0.00000</view>
				</view>
				<view class="freeze">
					<view class="label">{{$t("account.freeze")}}</view>
					<view class="value">0.00000</view>
				</view>
				<view class="available tr">
					<view class="label">{{$t("account.available")}}</view>
					<view class="value">0.00000</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="currency">
				<view class="unit">
					<image class="logo" src="@/static/img/usdt.png"></image>
					<text>usdt</text>
				</view>
				<button class="mini-btn" type="primary" size="mini" @click="toTrade(1)">
					<uni-icons custom-prefix="iconfont" type="icon-tixian" size="12" color="#fff"></uni-icons>
					<text class="text">{{$t('trade.withdraw')}}</text>
				</button>
			</view>
			<view class="amount">
				<view class="total tl">
					<view class="label">{{$t("account.total")}}</view>
					<view class="value">0.00000</view>
				</view>
				<view class="freeze">
					<view class="label">{{$t("account.freeze")}}</view>
					<view class="value">0.00000</view>
				</view>
				<view class="available tr">
					<view class="label">{{$t("account.available")}}</view>
					<view class="value">0.00000</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			toTrade(index) {
				uni.setStorageSync('index', index)
				uni.switchTab({
					url: "/pages/trade/trade"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.account {
		min-height: calc(100vh - 100rpx);
		background-color: #f8f8f8;
	}

	.card {
		margin: 20rpx;
		background-color: white;
		padding: 3vw;
		border-radius: 2vw;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;

		&.mt10 {
			margin-top: 20rpx;
		}

		.label {
			color: #333;
			font-size: 24rpx;
		}

		.value {
			color: #0052ff;
			font-weight: 700;
			font-size: 24rpx;
		}

		.earnings {
			.value {
				color: #0052ff;
				font-weight: 700;
				font-size: 36rpx;
				margin: 30rpx 0;
			}
		}

		.record {
			font-size: 28rpx;
			color: #333333;
		}
	}

	.currency {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.logo {
			width: 60rpx;
			height: 60rpx;
			margin-right: 2.66667vw;
		}

		.unit {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #333333;
		}

		.mini-btn {
			margin: 0;
		}
	}

	.tr {
		text-align: right;
	}

	.tl {
		text-align: left;
	}

	.amount {
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-align: center;

		.label {
			margin: 4vw 0 1.33333vw 0;
			font-size: 24rpx;
			font-weight: 700;
		}

		.value {
			font-size: 24rpx;
			padding: 1.33333vw 0 0 0;
		}
	}
</style>