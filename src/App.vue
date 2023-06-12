<script>
	export default {
		onLaunch: function() {
			const lang = uni.getLocale()
			const langs = ['en', 'es', 'hi', 'IN', 'ja', 'vi', 'zh-TW'];
			if (!langs.includes(lang)) {
				uni.setLocale('en'),
					this.$i18n.locale = 'en'
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/uni.css";
	@import "./common/app.css";
	@import "./static/font/iconfont.css";

	.statusbar {
		height: var(--status-bar-height);
	}

	.uni-tabbar__item {
		border-left: 1px solid #fff;
	}

	.uni-tabbar__item:first-child {
		border-left: 0px;
	}
</style>