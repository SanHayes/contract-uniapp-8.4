<template>
	<view class="partners">
		<view class="title">{{$t('index.whitepaper')}}</view>
		<view class="sub-title">{{$t('index.view')}}</view>
		<view class="white">
			<view class="white-img">
				<image class="icon" v-for="(item,index) in data" :key="item.id" :src="item.icon" mode="aspectFit"
					@click="toOutLink(item.file)"></image>
			</view>
		</view>
		<view class="title">{{$t('index.partners')}}</view>
		<view class="sub-title">{{$t('index.businessP')}}</view>
		<uni-grid :column="3" :show-border="false" :square="false" @change="change">
			<uni-grid-item v-for="(item ,index) in list" :index="index" :key="index">
				<view class="grid-item-box">
					<image class="image" :src="item.src" @error="loadErr" mode="aspectFit" />
					<!-- <text class="text">{{item.text}}</text> -->
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	export default {
		name: "partners",
		props: {
			data: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				list: [{
						src: '/static/img/index/p1.png'
					},
					{
						src: '/static/img/index/p2.png'
					},
					{
						src: '/static/img/index/p3.png'
					},
					{
						src: '/static/img/index/p4.png'
					},
					{
						src: '/static/img/index/p5.png'
					},
					{
						src: '/static/img/index/p6.png'
					},
				]
			};
		},
		methods: {
			change(e) {
				let {
					index
				} = e.detail
			},
			loadErr(e) {
				console.log(e.detail.errMsg)
			},
			toOutLink(str) {
				if (str.includes(`http://`) || str.includes(`https://`)) {
					uni.navigateTo({
						url: "/pages/whitepaper/whitepaper?file=" + str
					})
					// //#ifdef H5
					// 	 window.location.href = str
					// 	 //#endif
					// 	 // #ifdef APP-PLUS
					// 	 plus.runtime.openURL(str, res => {
					// 	   console.log(res);
					// 	 });
					// 	 //#endif
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.partners {
		border-radius: 5.33333vw 5.33333vw 0 0;
		background-color: white;
		padding: 0.83em 2.66667vw 0;
		margin-bottom: 20px;

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
	}

	.image {
		width: 100%;
		height: 10vw;
		margin: 0;
		display: block;
	}

	.grid-item-box {
		background-color: #dddddd;
		padding: 1.33333vw;
		border-radius: 1.06667vw;
	}

	::v-deep .uni-grid-item__box {
		padding: 16rpx;
	}

	.white {
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;

		.white-img {
			width: 30%;
			border-radius: 1.06667vw;
			overflow: hidden;
			padding-bottom: calc(45/111*30%);
			position: relative;
			margin: 2.66667vw 0;

			.icon {
				position: absolute;
				height: 100%;
				width: 100%;
				display: block;
			}
		}
	}
</style>