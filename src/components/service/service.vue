<template>
	<view>
		<liu-drag-button @clickBtn="clickBtn">
			<image class="service" src="../../static/img/service/service.jpg" mode="aspectFit"></image>
		</liu-drag-button>
		<uni-popup ref="popup" type="center">
			<view class="content">
				<view class="icon-wrap">
					<image class="icon" src="../../static/img/service/service.png" mode="aspectFit"></image>
				</view>
				<view class="title">
					{{$t("service.assistant")}}
				</view>
				<view class="tips">
					{{$t("service.tips")}}
				</view>
				<view class="btns" v-for="(item,index) in links" :key="index">
					<uni-icons custom-prefix="iconfont" color="white" :type="item.icon" size="48rpx"></uni-icons>
					<text class="text">
						{{item.text}}
					</text>
				</view>
				<view class="close" @click="close">
					<uni-icons size="48rpx" color="#f56285" type="closeempty"></uni-icons>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "service",
		data() {
			return {

			};
		},
		computed: {
			links() {
				return [{
					text: this.$t('service.online'),
					icon: 'icon-chat-smile--fill'
				}, {
					text: this.$t('service.app'),
					icon: 'icon-whatsapp'
				}, {
					text: this.$t('service.telegram'),
					icon: 'icon-telegram'
				}, ]
			}
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			clickBtn() {
				this.open()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.service {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		overflow: hidden;
	}

	.content {
		background-color: white;
		width: 90vw;
		border-radius: 4.23vw;
		padding: 20px;
		position: relative;
	}

	.icon-wrap {
		text-align: center;
	}

	.icon {
		width: 120rpx;
		height: 120rpx;
		margin: 48rpx auto 0;
	}

	.title {
		margin-top: 10px;
		text-align: center;
		color: #f56285;
		font-weight: 700;
	}

	.tips {
		font-size: 28rpx;
		margin: 28rpx 0;
		padding: 0 10vw;
		text-align: center;
		color: #7b9695;
	}

	.btns {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		background: linear-gradient(90deg, #f15e8a, #ed77c9);
		width: 100%;
		height: 40px;
		border-radius: 20px;
		font-weight: 700;
		font-size: 28rpx;
		margin-bottom: 10px;
	}

	.text {
		padding-left: 12px;
	}

	.close {
		position: absolute;
		right: 24px;
		top: 24px;
	}
</style>