<template>
	<view :class="[textColor]">{{ num }}</view>
</template>

<script>
	export default {
		data() {
			return {
				speed: 100,
				digit: 0,
				from: 0,
				time: null,
				done: false,
				times: 0
			};
		},
		props: {
			digitTo: {
				type: Number,
				default: 1000,
			},
			digitFrom: {
				type: Number,
				default: 0,
			},
			runTime: {
				type: Number,
				default: 500,
			},
			digitFiex: {
				type: Number,
				default: 0,
			},
			digitDelay: {
				type: Number,
				default: 500,
			},
			modeType: {
				type: String,
				default: 'AVERAGE'
			},
			textColor: {
				type: String,
				default: 'zh_text_black'
			}
		},
		computed: {
			num() {
				if (this.done) {
					return this.formatMoney(this.digit)
				}
				return this.digit
			}
		},
		methods: {
			start() {
				let times;
        let that = this;
				that.digit = that.from
				if (that.modeType === "RANDOM") {
					times = that.runTime / that.speed;
					let i = 0;
					this.time = setInterval(() => {
            let dVal;
            let addVal = 0;
            if (times == 0) {
							clearInterval(that.time);
							that.time = null
						} else if (times == 1) {
							dVal = (that.digitTo - that.digit) / times;
							addVal = dVal;
						} else {
              dVal = (that.digitTo - that.digit) / times;
              addVal = parseFloat(Math.random() * dVal).toFixed(that.digitFiex);
						}
            that.digit = (parseFloat(that.digit) + parseFloat(addVal)).toFixed(that.digitFiex);
						times--;
					}, that.speed)
				} else if (that.modeType === "AVERAGE") {
          times = that.runTime / that.speed;
          const dValue = (that.digitTo - that.from) / times;
          let i = 0;
					that.time = setInterval(() => {
						// console.log(i, times, that.speed);
						that.digit = parseFloat((that.from + dValue * i)).toFixed(that.digitFiex);
						if (times <= i) {
							// console.log('clearInterval', that.time);
							clearInterval(that.time);
							that.time = null
							that.done = true
						}
						i++;
					}, that.speed)
				}
			},
			formatMoney(str) {
				// console.log('format str', str);
				const [a, b] = String(str).split('.')
				const inteStr = Number(a).toLocaleString('en-US')
				if (b) {
					return inteStr + `.${b}`
				}
				return inteStr
			}
		},
		created() {
			let that = this;
			this.from = this.digitFrom
			setTimeout(() => {
				that.start();
			}, that.digitDelay);
		},
		watch: {
			digitTo(newVal, oldVal) {
				this.from = oldVal;
				this.done = false
				this.start();
			},
			time(newVal) {
				// console.log('digit time', newVal)
			}
		},
		beforeDestroy() {
			console.log('beforeDestroy');
			clearInterval(this.time)
			this.time = null
		}
	}
</script>

<style>
	.zh_text_white {
		color: #FFFFFF;
	}

	.zh_text_black {
		color: #000000;
	}
</style>