<template>
	<view class="pool">
		<view class="title">
			{{$t('index.pool')}}
		</view>
		<view class="data">
			<text class="label">{{$t('index.output')}}</text>
			<view class="value">
        <u-count-to :end-val="Number(data.platform_total_output || 0)" separator="," color="#0052ff" font-size="12" :bold="true"></u-count-to>
				<text class="blue">ETH</text>
			</view>
		</view>
		<view class="data">
			<text class="label">{{$t('index.valid')}}</text>
			<view class="value">
        <u-count-to :end-val="data.node_sum" separator="," color="#0052ff" font-size="12" :bold="true"></u-count-to>
			</view>
		</view>
		<view class="data">
			<text class="label">{{$t('index.participants')}}</text>
			<view class="value">
        <u-count-to :end-val="data.participation" separator="," font-size="12" :bold="true"></u-count-to>
			</view>
		</view>
		<view class="data">
			<text class="label">{{$t('index.userRevenue')}}</text>
			<view class="value">
				<text class="appro"> ≈ </text>
        <u-count-to :end-val="Number(data.user_income_sum || 0)" separator="," font-size="12" :bold="true"></u-count-to>
				<text>USDT</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "DataPool",
		props: {
			data: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.pool {
		padding: 0.83em 5% 0;
		background-color: white;
		margin-bottom: 10px;

		.title {
			margin-bottom: 0.83em;
			font-size: 1.5em;
			font-weight: bold;
			text-align: center;
		}

		.data {
			height: 9.33333vw;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.label {
			font-size: 24rpx;
			color: #a1a1b3;
		}

		.value {
			display: flex;
			font-size: 24rpx;
			font-weight: 700;
		}

		.blue {
			color: #0052ff;
		}
	}
</style>