<template>
	<view class="content">
		<navbar :title="title" @change='changeLang' @connect="updateConnect"></navbar>
		<view class="banner">
			<image :src="banner" class="bannerimg" mode="widthFix"></image>
			<view class="banner-content">
				<view class="banner-t">{{$t('index.voucher')}}</view>
				<view class="banner-m">{{$t('index.pledge')}}</view>
				<view class="banner-tip">{{$t('index.mining')}}</view>
				<view class="btns">
					<button type="primary" class="button" size="mini" @click="doapprove">{{$t('receive')}}</button>
					<button type="default" class="button" size="mini" @click="view">{{$t('certificate')}}</button>
				</view>
			</view>
		</view>
		<DataPool v-if="mining_pool" :data="mining_pool"></DataPool>
		<Staking v-if="earnings" :data="earnings"></Staking>
		<question v-if="problem.length>0" :data="problem"></question>
		<partners v-if="white.length>0" :data="white"></partners>
		<service/>

    <u-modal v-model="showNotice" :title="noticeTitle" :confirm-text="$t('confirm')" confirm-color="#ee0a24">
      <view class="slot-content">
        <rich-text :nodes="noticeContent"></rich-text>
      </view>
    </u-modal>
	</view>
</template>

<script>
	import http from '@/common/http'
  import { mapGetters } from 'vuex'
  import {commonMixin} from "@/mixins";
  import problem from '@/locale/problem.json'
	export default {
    mixins: [commonMixin],
		data() {
			return {
				mining_pool: null,
				earnings: [],
				problem: [],
				banner: '',
				title: '',
				white: [],
        notice: null,
        showNotice: false,
        noticeContent: ``,
        noticeTitle: ``,
			}
		},
		onLoad(option) {
      const {code = null} = option
      this.$store.dispatch(`setInviteCode`, code)
      const lang = uni.getLocale()
      this.problem = problem[lang]
			//通过接口获取合约信息
			this.getContent()
		},
		onShow() {
			//自动检测是否以太链，在钱包中，以太坊或币安环境自动登陆
			//this.connect()
		},
    computed: {
      ...mapGetters([
        'address',
        'contracts',
        'isConnected',
        'isApprove',
        'walletLinkName',
        'walletLink',
        'walletLinkId',
        'walletIndex',
      ]),
    },
		methods: {
			view() {
				uni.navigateTo({
					url: '/pages/certificate/certificate'
				})
			},
			async updateConnect() {
        console.log('updateConnect')
        await this.$store.dispatch(`setIsConnected`, true)
      },
			changeLang(lang) {
        this.problem = problem[lang]
				this.getContent()
			},
			async getContent() {
        const res = await http.post('/api/Index/home')
				const {data={}} = res
				const title = data?.title
				this.mining_pool = data?.mining_pool || {}
				this.earnings = data?.earnings || []
        if (data?.problem?.length){
          this.problem = data?.problem
        }
				this.banner = data?.banner
				this.title = title
				this.white = data?.white_paper
				this.notice = data?.notice
        if (Object.keys(this.notice).length > 0) {
          this.showNotice = true
          this.noticeContent = this.notice.content
          this.noticeTitle = this.notice.title
        }
        // save service url to store
				this.$store.commit('setState', {
					key: 'service',
					value: data.service || {}
				})
        await this.$store.dispatch(`setTitle`, data)
        await uni.setNavigationBarTitle({title: data?.title})
			},
		}
	}
</script>

<style>
	.toprap {
		position: relative;
		text-align: center;
		line-height: 44px;
		height: 44px;
		overflow: hidden;
		padding: 0 200px;
	}

	.bagconnect {
		position: absolute;
		right: 10px;
		top: 5px;
		height: 34px;
		line-height: 34px;
		background: blue;
		font-size: 14px;
		padding: 0 10px;
		border-radius: 5px;
		color: #fff;
	}

	.banner {
		position: relative;
		color: #fff;
	}

	.bannerimg {
		width: 100%;
		height: 48vw !important;
	}

	.banner-content {
		position: absolute;
		left: 5.3vw;
		top: 8vw;
		width: calc(100vw - 10.6vw);
	}

	.banner-t {
		color: #fff;
		font-size: 40rpx;
	}

	.banner-m {
		font-size: 40rpx;
		margin: 1.86667vw 0;
	}

	.banner-tip {
		font-size: 24rpx;
		margin: 24rpx 0;
	}

	.btns {
		display: flex;
		justify-content: space-between;

		.button {
			margin: 0;
		}
	}

	.content {
		background-color: #f8f8f8;
	}
</style>

<style lang="scss" scoped>
.slot-content {
  font-size: 28rpx;
  color: $u-content-color;
  padding-left: 30rpx;
  padding-top: 30rpx;
  min-height: 300rpx;
}
</style>
