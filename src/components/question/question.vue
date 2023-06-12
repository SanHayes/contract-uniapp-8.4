<template>
	<view class="question">
		<view class="title">{{$t('index.question')}}</view>
		<view class="sub-title">{{$t('index.frequently')}}</view>
		<view class="content">
			<uni-collapse ref="collapse">
				<uni-collapse-item v-for="(item,index) in data" :key="item.id" :title="item.problem_title" title-border="none">
					<view class="problem-content">
						<text class="text">{{item.problem_content}}</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	export default {
		name: "question",
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.question {
		border-radius: 5.33333vw 5.33333vw 0 0;
		background-color: white;
		padding: 0.83em 2.66667vw 0;
		margin-bottom: 10px;

		.title {
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

		.content {
			border-radius: 2.66667vw;
			box-shadow: 0 0 5.33333vw 0 rgba(0, 0, 0, .05);
		}

		::v-deep .uni-collapse-item__title {
			background-color: #f8f8f8;
		}

		::v-deep .uni-collapse-item__title-box {
			background-color: #f8f8f8;
			line-height: 1.5;
		}

		::v-deep .uni-collapse-item__title-text {
			white-space: pre-wrap;
			font-weight: 700;
			color: #333;
			font-size: 28rpx;
		}

		.problem-content {
			color: #969799;
			font-size: 28rpx;
			padding: 24rpx 32rpx;
			line-height: 42rpx;
		}
	}
</style>