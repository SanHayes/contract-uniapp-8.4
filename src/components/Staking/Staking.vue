<template>
	<view class="staking">
		<view class="title">{{$t('index.staking')}}</view>
		<view class="sub-title">{{$t('index.revenue')}}</view>
		<view class="detail">{{$t('index.details')}}</view>
		<view class="list-header">
			<text>{{$t('index.address')}}</text>
			<text>{{$t('index.quantity')}}</text>
		</view>
		<mao-scroll :data="data" :showNum="showNum" :lineHeight="lineHeight" :animationScroll="animationScroll"
			:animation="animation">
			<template v-slot="{line}">
				<view class="line">
					<text class="label">{{line.wallet_address}}</text>
					<text class="value">{{line.send_balance}} ETH</text>
				</view>
			</template>
		</mao-scroll>
	</view>
</template>

<script>
	export default {
		name: "Staking",
		props: {
			data: {
        type: [Array, Object],
				default: []
			}
		},
		data() {
			return {
				showNum: 10,
				lineHeight: 48,
				animationScroll: 800,
				animation: 50,
			};
		}
	}
</script>

<style lang="scss" scoped>
	.staking {
		border-radius: 5.33333vw 5.33333vw 0 0;
		background-color: white;
		padding: 0.83em 5% 0;
		margin-bottom: 10px;

		.title,
		.detail {
			margin-bottom: 0.83em;
			font-size: 36rpx;
			font-weight: bold;
		}

		.title {
			text-align: center;
		}

		.sub-title {
			margin-bottom: 5.33333vw;
			font-size: 24rpx;
			text-align: center;
		}

		.list-header {
			display: flex;
			justify-content: space-between;
			font-size: 3.7333vw;
			height: 8vw;
			color: #a1a1b3;
		}

		.line {
			display: flex;
			justify-content: space-between;
			font-weight: 700;
			font-size: 24rpx;

			.label {
				color: #0052ff;
			}

			.value {
				color: #333;
			}
		}
	}
</style>