<template>
  <view>
    <navbar :title="title"></navbar>
    <view class="banner">
      <view class="desc">
        <view class="refer">
          <view class="title">{{ $t('share.refer') }}</view>
          <view class="title">{{ $t('share.earn') }}</view>
          <view class="up">
            {{ $t('share.up', {percent: 0}) }}
          </view>
          <view class="view" @click="shareView">{{ $t('share.view') }}</view>
        </view>
        <image class="bg" src="../../static/img/share/bg_share.png" mode="aspectFit"></image>
      </view>
      <view class="level">
        <view class="level-item">
          <view class="title">{{ $t('share.myLevel') }}</view>
          <view class="value">
            {{ levelLists.mylevel || '--' }}
          </view>
        </view>
        <view class="level-item">
          <view class="title">Level 1</view>
          <view class="value">
            {{ levelLists.level1_count || '--' }}
          </view>
        </view>
        <view class="level-item">
          <view class="title">Level 2</view>
          <view class="value">
            {{ levelLists.level2_count || '--' }}
          </view>
        </view>
        <view class="level-item">
          <view class="title">Level 3</view>
          <view class="value">
            {{ levelLists.level3_count || '--' }}
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
        <view class="title">{{ $t('share.link') }}</view>
        <view class="link">
          <text class="href">{{ inviteUrl }}</text>
          <button class="copy" type="primary" size="mini" @click="copy">{{ $t('share.copy') }}</button>
        </view>
        <view class="desc">{{ $t('share.desc') }}</view>
        <view class="steps">
          <view class="step">
            <image class="icon" src="../../static/img/share/share1.svg" mode="aspectFit"></image>
            <view class="text">1.{{ $t('share.get') }}</view>
          </view>
          <view class="step">
            <image class="icon" src="../../static/img/share/share2.svg" mode="aspectFit"></image>
            <view class="text">2.{{ $t('share.invite') }}</view>
          </view>
          <view class="step">
            <image class="icon" src="../../static/img/share/share3.svg" mode="aspectFit"></image>
            <view class="text">3.{{ $t('share.earn') }}</view>
          </view>
          </uni-grid>
        </view>
      </view>
      <view v-if="current === 1">
        <view class="datas">
          <view class="box">
            <view class="value">{{ levelLists.team_size }}</view>
            <view class="label">{{ $t('share.size') }}</view>
          </view>
          <view class="box">
            <view class="value">{{ levelLists.level1_count }}</view>
            <view class="label">{{ $t('share.promoters') }}</view>
          </view>
          <view class="box">
            <view class="value">{{ levelLists.total_revenue }}</view>
            <view class="label">{{ $t('share.total') }}(ETH)</view>
          </view>
          <view class="box">
            <view class="value">{{ levelLists.today_revenue }}</view>
            <view class="label">{{ $t('share.today') }}(ETH)</view>
          </view>
        </view>
      </view>
      <view v-show="current === 2">
        <view class="filter-wrap">
          <text class="label">{{ $t('share.level') }}</text>
          <view class="filters">
            <view :class="['filter', {active: index === levelIndex}]" v-for="(item,index) in levels" :key="index"
                  @click="changeLevel(index)">{{ item.text }}
            </view>
          </view>
        </view>

        <view v-show="levelIndex === 0" style="padding: 0 20rpx 10rpx">

          <view class="model-list" v-if="level1 || level2 || level3">
            <view class="level">
              <view class="title">{{ $t('用户名') }}</view>
              <view class="title">{{ $t('等级') }}</view>
            </view>
            <view class="level-list" v-for="(ite1,i1) in level1" :key="`level1-${i1}`">
              <view class="value">{{ ite1.username }}</view>
              <view class="value">{{ ite1.user_level }}</view>
            </view>
            <view class="level-list" v-for="(ite2,i2) in level2" :key="`level2-${i2}`">
              <view class="value">{{ ite2.username }}</view>
              <view class="value">{{ ite2.user_level }}</view>
            </view>
            <view class="level-list" v-for="(ite3,i3) in level3" :key="`level3-${i3}`">
              <view class="value">{{ ite3.username }}</view>
              <view class="value">{{ ite3.user_level }}</view>
            </view>
          </view>
          <image v-else class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit"></image>
        </view>
        <view v-show="levelIndex === 1"  style="padding: 0 20rpx 10rpx">
          <view class="model-list" v-if="level1">
            <view class="level">
              <view class="title">{{ $t('用户名') }}</view>
              <view class="title">{{ $t('等级') }}</view>
            </view>
            <view class="level-list" v-for="(item1,index1) in level1" :key="index1">
              <view class="value">{{ item1.username }}</view>
              <view class="value">{{ item1.user_level }}</view>
            </view>
          </view>
          <image v-else class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit"></image>
        </view >
        <view v-show="levelIndex === 2"  style="padding: 0 20rpx 10rpx">
          <view class="model-list" v-if="level2">
            <view class="level">
              <view class="title">{{ $t('用户名') }}</view>
              <view class="title">{{ $t('等级') }}</view>
            </view>
            <view class="level-list" v-for="(item2,index2) in level2" :key="index2">
              <view class="value">{{ item2.username }}</view>
              <view class="value">{{ item2.user_level }}</view>
            </view>
          </view>
          <image v-else class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit"></image>
        </view>
        <view v-show="levelIndex === 3"  style="padding: 0 20rpx 10rpx">
          <view class="model-list" v-if="level3">
            <view class="level">
              <view class="title">{{ $t('用户名') }}</view>
              <view class="title">{{ $t('等级') }}</view>
            </view>
            <view class="level-list" v-for="(item3,index3) in level3" :key="index3">
              <view class="value">{{ item3.username }}</view>
              <view class="value">{{ item3.user_level }}</view>
            </view>
          </view>
          <image v-else class="no-data" src="../../static/img/share/no-data.svg" mode="aspectFit"></image>
        </view>
      </view>
    </view>
    <u-modal v-model="showModel" title="" confirm-text="Confirm" confirm-color="#ee0a24" width="90%">
      <view class="slot-content">
        <view class="model-list">
          <view class="level">
            <view class="title">{{ $t('share.level') }}</view>
            <view class="title">{{ $t('share.min') }}</view>
            <view class="title">{{ $t('share.rate') }}</view>
          </view>
          <view class="level-list" v-for="(item,index) in levelList" :key="index">
            <view class="value">{{ item.name }}</view>
            <view class="value">{{ item.balance }}</view>
            <view class="value">
              <view>Lv.1:{{ item.rate1 }} %</view>
              <view>Lv.2:{{ item.rate2 }} %</view>
              <view>Lv.3:{{ item.rate3 }} %</view>
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
      levelList: [
        {
          "id": 5,
          "name": "VIP1",
          "balance": "50.00000000",
          "rate1": "5.00",
          "rate2": "3.00",
          "rate3": "2.00",
          "dish_id": 1,
          "language": "en",
          "created_at": "2022-02-22 12:45:29",
          "updated_at": "2023-03-30 09:26:25"
        },
        {
          "id": 6,
          "name": "VIP2",
          "balance": "1000.00000000",
          "rate1": "6.00",
          "rate2": "4.00",
          "rate3": "2.00",
          "dish_id": 1,
          "language": "en",
          "created_at": "2022-02-22 12:45:29",
          "updated_at": "2022-02-23 18:34:57"
        },
        {
          "id": 7,
          "name": "VIP3",
          "balance": "10000.00000000",
          "rate1": "7.00",
          "rate2": "5.00",
          "rate3": "3.00",
          "dish_id": 1,
          "language": "en",
          "created_at": "2022-02-22 12:45:29",
          "updated_at": "2022-02-23 18:35:29"
        },
        {
          "id": 14,
          "name": "VIP4",
          "balance": "50000.00000000",
          "rate1": "8.00",
          "rate2": "6.00",
          "rate3": "3.00",
          "dish_id": 1,
          "language": "en",
          "created_at": "2022-02-23 22:46:04",
          "updated_at": "2022-02-23 22:46:24"
        },
        {
          "id": 15,
          "name": "VIP5",
          "balance": "100000.00000000",
          "rate1": "9.00",
          "rate2": "7.00",
          "rate3": "4.00",
          "dish_id": 1,
          "language": "en",
          "created_at": "2022-02-23 22:46:51",
          "updated_at": "2022-02-23 22:46:51"
        }
      ],
      levelLists: {},
      level1: [],
      level2: [],
      level3: [],
      myLevel: '',
      showModel: false,
    };
  },
  onLoad() {
    // this.getLevels()
    uni.setNavigationBarTitle({title: this.title})
  },
  computed: {
    ...mapGetters([
      'inviteUrl',
      'user',
        'title'
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
  onShow() {
    this.getLevels()
    if (this.$store.getters.user?.user_level > 0) {
      this.myLevel = this.levelList.filter((item, index) => {
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
      console.log("copy", this.inviteUrl)
      uni.setClipboardData({
        data: this.inviteUrl,
        success: function () {
          console.log('success');
        }
      });
    },
    changeLevel(index) {
      this.levelIndex = index
    },
    // get team infomations
    /*async getTeamInfo() {
      const res = await http.post('/api/Referral/getShareTeam')
      const { datas = {} } = res
    },*/
    shareView() {
      this.showModel = true
    },

    async getLevels() {
      const res = await http.post('/api/Referral/getShareTeam')
      console.log('res', res)
      this.levelLists = res.data
      this.level1 = this.levelLists.level1
      this.level2 = this.levelLists.level2
      this.level3 = this.levelLists.level3
      console.log('levelLists', this.levelLists)
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

  .level-list {
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
