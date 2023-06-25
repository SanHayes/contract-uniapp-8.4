<template>
  <view>
    <view class="contain">
      <view class="ul" v-if="false">
        <view class="time">2022-11-12</view>
        <view class="conten">MediaQueryObserver 对象，用于监听页面 media query 状态的变化，如界面的宽高是不是在某个指定的范围内</view>
      </view>
    </view>
  </view>
</template>

<script>
import http from '@/common/http'
export default {
  name: "message",
  data() {
    return {
      messageList: ''
    }
  },
  onShow() {

  },
  methods: {
    async getDate() {
      const res = await http.post('/')
      this.messageList = res?.data
    }
  }
}
</script>

<style lang="scss" scoped>
  .contain{
    padding: 20rpx;
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
    }
  }
</style>
