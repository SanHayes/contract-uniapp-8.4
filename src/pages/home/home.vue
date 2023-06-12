<template>
	<view class="home">
		<tony-scroll :list="list"></tony-scroll>
	</view>
</template>

<script>
	import tonyScroll from '@/components/tony-scroll/tony-scroll.vue'
export default {
	data() {
		return {
			list:[
				{
					time: '2019年1月',
					phone: '1855****7766',
					prize: 'iphone1164G一部'
				},
				{
					time: '2019年2月',
					phone: '1855****7766',
					prize: 'iphone1164G一部'
				},
				{
					time: '2019年3月',
					phone: '1855****7766',
					prize: 'iphone1164G一部'
				},
				{
					time: '2019年4月',
					phone: '1855****7766',
					prize: 'iphone1164G一部'
				},
				{
					time: '2019年5月',
					phone: '1855****7766',
					prize: 'iphone1164G一部'
				},
				{
					time: '2019年6月',
					phone: '1855****7766',
					prize: 'iphone1164G一部'
				}
			]
		};
	},
	components: {
		tonyScroll
	},
	onLoad() {
	},
	methods: {
	}
};
</script>

<style>
	
</style>
