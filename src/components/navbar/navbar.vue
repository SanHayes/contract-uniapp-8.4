<template>
	<view>
		<uni-nav-bar height="96rpx" leftWidth="180rpx" rightWidth="300rpx" :border="false">
			<view slot="left">
				<picker @change="handleChange" :value="value" :range="langArr" range-key="text">
					<view class="lang">
						<text class="text">{{currentLang}}</text>
						<uni-icons type="bottom" size="12"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="center">
				<image class="logo" src="@/static/img/logo.png"></image>
				<text class="name">{{title}}</text>
			</view>
			<view slot="right">
				<!-- <button class="mini-btn" type="primary" size="mini"></button> -->
				<view class="right">
					<button class="mini-btn" type="primary" size="mini" @click="chooselink">
						<text class="text">{{address|maskAddr}}</text>
						<uni-icons custom-prefix="iconfont" type="icon-duidiaojiaohuanduihuan" size="12" color="#fff"></uni-icons>
					</button>
					<uni-icons type="notification" size="21"></uni-icons>
				</view>
			</view>
		</uni-nav-bar>
	</view>
</template>
<script>
  import { mapGetters } from 'vuex'
  import {commonMixin} from "@/mixins";
	export default {
    mixins: [commonMixin],
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				lang: '',
        langArr: [
          {
            lang: 'en',
            text: 'English'
          },
          {
            lang: 'zh-TW',
            text: '繁體中文'
          },
          {
            lang: 'ja',
            text: '日本語'
          },
          {
            lang: 'es',
            text: 'español'
          },
          {
            lang: 'vi',
            text: 'Tiếng Việt'
          },
          {
            lang: 'IN',
            text: 'Bahasa Indonesia'
          },
          {
            lang: 'hi',
            text: 'हिन्दी或हिंदी'
          },
        ],
				value: 0,
				pattern: {
					icon: "/static/img/service.jpg"
				}
			}
		},
		watch: {
		},
		created() {
		},
    computed: {
      ...mapGetters([
        'contracts',
        'isConnected',
        'address',
        'chainId',
        'walletLinkName',
        'walletLink',
      ]),
			currentLang() {
				return this.langArr[this.value]?.text ?? `English`
			},
		},
		mounted() {
			const lang = uni.getLocale()
			if (lang) {
				this.value = this.langArr.findIndex(item => item.lang === lang)
			}
		},
		methods: {
			handleChange(e) {
				const index = e.detail.value
				const langObj = this.langArr[index]
				this.value = index
				this.$i18n.locale = langObj.lang
				uni.setLocale(langObj.lang)
				this.$emit('change')
			},
		}
	}
</script>
<style lang="scss" scoped>
	// ::v-deep .uni-navbar__header {
	// 	height: 96rpx !important;
	// }
	.lang {
		font-size: 28rpx;

		.text {
			margin-right: 16rpx;
		}
	}

	.logo {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}

	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		font-size: 4.26667vw;
		font-weight: bold;

		.name {
			white-space: nowrap;
		}
	}

	.right {
		display: flex;
		align-items: center;

		.mini-btn {
			padding: 8rpx;
			line-height: 1.5;
			font-size: 24rpx;
			margin-right: 12rpx;
		}

		.text {
			padding-right: 8rpx;
		}
	}
</style>