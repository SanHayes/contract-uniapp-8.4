<template>
	<view>
		<navbar></navbar>
		<view class="banner">
			<view class="desc">
				<view class="refer">
					<view class="title">{{$t('share.refer')}}</view>
					<view class="title">{{$t('share.earn')}}</view>
					<view class="up">
						{{$t('share.up',{percent: 0})}}
					</view>
					<view class="view" @click="shareView">{{$t('share.view')}}</view>
				</view>
				<image class="bg" src="../../static/img/share/bg_share.png" mode="aspectFit"></image>
			</view>
			<view class="level">
				<view class="level-item">
					<view class="title">{{$t('share.myLevel')}}</view>
					<view class="value">
            {{ myLevel.name || '--' }}
					</view>
				</view>
				<view class="level-item">
					<view class="title">Level 1</view>
					<view class="value">
            {{ myLevel.rate1 || '--' }}
					</view>
				</view>
				<view class="level-item">
					<view class="title">Level 2</view>
					<view class="value">
            {{ myLevel.rate2 || '--' }}
					</view>
				</view>
				<view class="level-item">
					<view class="title">Level 3</view>
					<view class="value">
            {{ myLevel.rate3 || '--' }}
					</view>
				</view>
			</view>
		</view>
		<view class="tabs">
			<uni-segmented-control styleType="text" :current="current" :values="values"
				@clickItem="handleClick"></uni-segmented-control>
		</view>
		<view class="content">
			<view v-if="current === 0" class="referral">
				<view class="title">{{$t('share.link')}}</view>
				<view class="link">
					<text class="href">{{inviteUrl}}</text>
					<button class="copy" type="primary" size="mini" @click="copy">{{$t('share.copy')}}</button>
				</view>
				<view class="desc">{{$t('share.desc')}}</view>
				<view class="steps">
					<view class="step">
						<image class="icon" src="../../static/img/share/share1.svg" mode="aspectFit"></image>
						<view class="text">1.{{$t('share.get')}}</view>
					</view>
					<view class="step">
						<image class="icon" src="../../static/img/share/share2.svg" mode="aspectFit"></image>
						<view class="text">2.{{$t('share.invite')}}</view>
					</view>
					<view class="step">
						<image class="icon" src="../../static/img/share/share3.svg" mode="aspectFit"></image>
						<view class="text">3.{{$t('share.earn')}}</view>
					</view>
					</uni-grid>
				</view>
			</view>
			<view v-if="current === 1">
				<view class="datas">
					<view class="box">
						<view class="value">0</view>
						<view class="label">{{$t('share.size')}}</view>
					</view>
					<view class="box">
						<view class="value">0</view>
						<view class="label">{{$t('share.promoters')}}</view>
					</view>
					<view class="box">
						<view class="value">0</view>
						<view class="label">{{$t('share.total')}}(ETH)</view>
					</view>
					<view class="box">
						<view class="value">0</view>
						<view class="label">{{$t('share.today')}}(ETH)</view>
					</view>
				</view>
			</view>
			<view v-show="current === 2">
				<view class="filter-wrap">
					<text class="label">{{$t('share.level')}}</text>
					<view class="filters">
						<view :class="['filter', {active: index === levelIndex}]" v-for="(item,index) in levels" :key="index"
							@click="changeLevel(index)">{{item.text}}</view>
					</view>
				</view>
				<image class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit"></image>
			</view>
		</view>
    <u-modal v-model="showModel" title="" confirm-text="Confirm" confirm-color="#ee0a24" width="90%">
      <view class="slot-content">
          <view class="model-list">
            <view class="level">
              <view class="title">Level</view>
              <view class="title">Minimum Balance</view>
              <view class="title">Commission Rate</view>
            </view>
            <view class="level-list"  v-for="(item,index) in levelList" :key="index">
              <view class="value">{{ item.name }}</view>
              <view class="value">{{ item.balance }}</view>
              <view class="value">
                <view>Lv.1:{{item.rate1}} </view>
                <view>Lv.2:{{item.rate2}} </view>
                <view>Lv.3:{{item.rate3}} </view>
              </view>
            </view>
          </view>
      </view>
    </u-modal>
		<service></service>
	</view>
</template>

<script>
	import http from '@/common/http'
  import {mapGetters} from "vuex";

	export default {
		data() {
			return {
				current: 2,
				levelIndex: 0,
        levelList: [],
        myLevel: '',
        showModel: false,
      };
		},
    onLoad(){
      this.getLevels()
    },
		computed: {
      ...mapGetters([
        'inviteUrl',
          'user'
      ]),
			values() {
				return [this.$t('share.referral'), this.$t('share.team'), this.$t('share.record')]
			},
			levels() {
        return [{
          text: this.$t("trade.all"),
        },
          {
            text: this.$t("share.level1"),
          },
          {
            text: this.$t("share.level2"),
          },
          {
            text: this.$t("share.level3"),
          },
        ]
      }
		},
		onShow(){
		  this.getTeamInfo()
      if(this.$store.getters.user?.user_level > 0) {
        this.myLevel = this.levelList.filter((item, index) => {
          console.log("item" ,item)
          console.log("index" ,index)
          return this.$store.getters.user?.user_level === index + 1
        })
      }
		},
		methods: {
			handleClick(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			copy() {
				uni.setClipboardData({
					data: this.url,
					success: function() {
						console.log('success');
					}
				});
			},
			changeLevel(index) {
				this.levelIndex = index
			},
			// get team infomations
			async getTeamInfo() {
				const res = await http.post('/api/Referral/getShareTeam')
				const { datas = {} } = res
			},
      shareView() {
        this.showModel = true
      },

      async getLevels (){
        const res = await http.post('/api/Referral/getShareTeam')
        this.levelList = res.data.levels

      }
		}
	}
</script>

<style lang="scss" scoped>
	.banner {
		background-color: white;
		padding: 2.66667vw;

		.desc {
			display: flex;
			justify-content: space-between;

			.title {
				color: #0052ff;
				font-size: 36rpx;
				margin: 0.83em 0;
				font-weight: bold;
			}

			.up,
			.view {
				color: #959ba7;
				font-size: 24rpx;
				margin: 1em 0;
			}

			.view {
				color: #0052ff;
			}
		}

		.bg {
			width: 35vw;
			height: 35vw;
		}

		.level {
			display: flex;
			justify-content: space-between;
			background-color: rgb(0 82 255 / 5%);
			margin: 5.33333vw 0 0;
			border-radius: 2.13333vw;
			padding: 2.66667vw;

			.level-item {
				text-align: center;
				font-size: 24rpx;

				.title {
					margin: 1.333vw 0;
				}
			}
		}
	}

	.tabs {
		background-color: #f8f8f8;
		padding: 8rpx 0;
	}

	.referral {
		padding: 0 4vw;

		.title {
			color: #0052ff;
			font-size: 28rpx;
			font-weight: bold;
			margin: 1em 0;
		}

		.link {
			background-color: #f8f8f8;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32rpx 20rpx;

			.href {
				flex: 1;
			}
		}

		.desc {
			margin: 1em 0;
			color: #959ba7;
			font-size: 24rpx;
		}

		.icon {
			width: 120rpx;
			height: 120rpx;
			margin: 0 auto;
		}

		.steps {
			display: flex;
			justify-content: space-between;
			margin-top: 9.3333vw;

			.step {
				text-align: center;
			}
		}

		.text {
			margin: 1.3333vw 0;
			color: #0052ff;
			font-size: 28rpx;
			font-weight: bold;
		}
	}

	.datas {
		display: flex;
		flex-wrap: wrap;
		padding: 0 2vw;
	}

	.box {
		box-shadow: 0 0 4.26667vw #efefef;
		background-color: #fff;
		border-radius: 1.6vw;
		padding: 4vw;
		width: 45%;
		margin: 5vw auto 0;

		.value,
		.label {
			margin: 1.33333vw 0;
			color: #0052ff;
			font-weight: bold;
			font-size: 28rpx;
			text-align: center;
		}

		.label {
			font-size: 24rpx;
			color: #333;
		}
	}

	.filter-wrap {
		margin: 4vw;
		display: flex;
		align-items: center;

		.label {
			font-size: 24rpx;
			color: #333;
		}
	}

	.filters {
		display: flex;
		align-items: center;

		.filter {
			margin: 0 1.33333vw;
			color: rgb(0, 82, 255);
			border-radius: 4rpx;
			padding: 4rpx 12rpx;
			font-size: 24rpx;

			&.active {
				background-color: #0052ff;
				color: white;
			}
		}
	}

	.no-data {
		width: 40vw;
		height: 40vw;
		margin: 40rpx auto;
		display: block;
	}
  .model-list {
    margin: 15rpx;
    border: 1px solid #ddd;
    border-radius: 10rpx;
    .level {
      display: flex;
      background-color: #eee;
      .title {
        flex: 1;
        text-align: center;
        padding: 10rpx 0;
        font-size: 24rpx;
      }
    }
    .level-list{
      border-top: 1px solid #ddd;
      display: flex;
      align-items: center;
      .value {
        flex: 1;
        text-align: center;
        padding: 10rpx 0;
        font-size: 24rpx;
      }
    }
  }
</style>
