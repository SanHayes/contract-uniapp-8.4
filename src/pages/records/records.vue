<template>
	<view class="record">
		<uni-segmented-control :current="current" :values="tabs" @clickItem="activeTab"></uni-segmented-control>
		<view class="content">
      <view v-if="current === 0" class="records">
        <view class="ul" v-for="(item,index) in exchangeList" :key="index">
          <view class="time">{{ item.create_time }}</view>
          <view class="status"><text>{{ $t('record.currency') }}：{{ item.token.symbol }}</text></view>
          <view class="fee" :class="item.in_out === 'in' ? 'red' : 'blue'">{{ $t('record.num') }}：{{ item.in_out === "in" ? '+' : '-' }}{{ item.amount }} </view>
        </view>
        <image class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit" v-if="exchangeList.length === 0"></image>
      </view>

      <view v-if="current === 1" class="records">
        <view class="ul" v-for="(item,index) in withdrawList" :key="index">
          <view class="time">{{ item.create_time }}</view>
          <view class="status"><text>{{ $t('record.currency') }}：{{ item.token.symbol }}</text></view>
          <view class="fee" :class="item.in_out === 'in' ? 'red' : 'blue'">{{ $t('record.num') }}：{{ item.in_out === "in" ? '+' : '-' }} {{ item.amount }} </view>
        </view>
        <image class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit" v-if="withdrawList.length === 0"></image>
      </view>
      <view v-if="current === 2" class="records">
        <view class="ul" v-for="(item,index) in incomeList" :key="index">
          <view class="time">{{ item.create_time }}</view>
          <view class="status"><text>{{ $t('record.currency') }}：{{ item.token.symbol }}</text></view>
          <view class="fee" :class="item.in_out === 'in' ? 'red' : 'blue'">{{ $t('record.num') }}：{{ item.in_out === "in" ? '+' : '-' }} {{ item.amount }} </view>
        </view>
        <image class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit" v-if="incomeList.length === 0"></image>
      </view>
		</view>
	</view>
</template>

<script>
import http from '@/common/http'
	export default {
		data() {
			return {
				current: 0,
        exchangeList: [],
        withdrawList: [],
        incomeList: [],
			};
		},
		computed: {
			tabs() {
				return [this.$t('trade.exchange'), this.$t("trade.withdraw"), this.$t("record.income")]
			}
		},
    onShow(){
      this.getDate();
    },
		methods: {
			activeTab(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
      async getDate() {
        const exchange = await http.post('/api/Record/exchange')
        this.exchangeList = exchange.data.data
        const withdraw = await http.post('/api/Record/withdraw')
        this.withdrawList = withdraw.data.data
        const income = await http.post('/api/Record/income')
        this.incomeList = income.data.data
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

  .content {
    .ul {
      border-bottom: 1px solid #eee;
      font-size: 26rpx;
      padding: 20rpx;
      .time {
        text-align: right;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 10rpx;
      }
      .addressTo {
        padding: 10rpx 0;
      }
      .status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10rpx 0;
      }
      .fee {
        padding: 10rpx 0 0;
      }
    }
  }
  .red {
    color: red;
  }
  .blue {
    color: #0A98D5;
  }
</style>
