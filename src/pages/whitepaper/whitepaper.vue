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
			this.file = options.file
      // this.file = '/hybrid/html/web/viewer.html?file='+encodeURIComponent(options.file)
		},
		methods: {

		}
	}
</script>

<style>

</style>
