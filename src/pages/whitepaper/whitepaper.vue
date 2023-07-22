<template>
	<web-view :src="file"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				file: ''
			}
		},
		onLoad(options) {
			this.file = options.file+"#scrollbars=0&toolbar=0&statusbar=0"
      // this.file = '/hybrid/html/web/viewer.html?file='+encodeURIComponent(options.file)
		},
		methods: {

		}
	}
</script>

<style>

</style>
