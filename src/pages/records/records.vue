<template>
	<view class="record">
		<uni-segmented-control :current="current" :values="tabs" @clickItem="activeTab"></uni-segmented-control>
		<view class="content">
			<image class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0
			};
		},
		computed: {
			tabs() {
				return [this.$t('trade.exchange'), this.$t("trade.withdraw"), this.$t("record.income")]
			}
		},
		methods: {
			activeTab(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.record {
		background-color: #f8f8f8;
		height: 100vh;
	}

	.no-data {
		width: 40vw;
		height: 40vw;
		margin: 80rpx auto;
		display: block;
	}
</style>