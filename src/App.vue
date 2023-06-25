<script>
export default {
  onLaunch() {
    const lang = uni.getLocale()
    const langs = ['en', 'es', 'hi', 'IN', 'ja', 'vi', 'zh-TW'];
    if (!langs.includes(lang)) {
      uni.setLocale('en')
      this.$i18n.locale = 'en'
    }
    this.$store.dispatch(`setContracts`)
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
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
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>