<template>
  <div class="rank-view-wrap">
    <FixedTop>
      <DateAvatar
        :api="pageInfo.top1Url"
        :apiParams="{ activityId, rankType: 3 }"
        v-model="pageInfo.selDate"
        @ready="pageInfo.dateReady = true"
      />
    </FixedTop>

    <RankLoad
      v-if="pageInfo.dateReady"
      ref="loadRef"
      :api="pageInfo.url"
      :apiParams="apiParams"
      :rankIndex="page2RankIndex"
    >
      <template #outFrame="{ info }">
        <!-- <img
          v-if="!isDaily"
          class="reward-icon shake"
          :src="`${ossUrl}/reward-icon.png`"
          @click="toRewardPage"
        /> -->
      </template>

      <template #info="{ info }">
        <div class="timer-wrap">
          <Timer :timeLeft="info?.timeLeft" :status="info?.status" />
        </div>

        <div class="rank-info fc" v-if="pageInfo.infoText">
          <span> {{ TOOL_TEXT[pageInfo.infoText] }} </span>
        </div>
      </template>

      <template #top3="{ info }">
        <TopThree :info="info" :key="route?.path" />
      </template>

      <!-- <template #card="{ info }">
        <Card :info="info" :isDaily="true" :key="route?.path" v-show="Number(info?.idx) > 3" />
      </template> -->

      <template #userInfo="{ info }">
        <teleport to="body">
          <UserInfo
            v-show="showUserInfo && info.isOnTheRank"
            :info="info"
            :isDaily="true"
            :key="route?.path"
            isCardStyle
          />
        </teleport>
      </template>
    </RankLoad>
  </div>
</template>

<script lang="ts" setup name="RankPage">
import injectTool from '@publicComponents/injectTool'
import useUserInfo from '@hooks/useUserInfo'
import RankLoad from '../Rank/Static/RankLoad.vue'
import DateAvatar from '../Rank/Static/DateAvatar.vue'
import Card from './RankCard/Card.vue'
import UserInfo from './RankCard/UserInfo.vue'
import TopThree from './RankCard/TopThree.vue'

const route = useRoute()
const router = useRouter()
const activityId = inject('activityId')
const ossUrl = inject('ossUrl')
const page2RankIndex = inject('page2RankIndex', ref(0))
const { TOOL_TEXT, TOOL_BPFunc } = injectTool()

const { showUserInfo } = useUserInfo(700)

// 满格金喜专属榜单页的统一状态（静态配置 + 本地交互状态全部收口在 pageInfo 里）
const pageInfo = reactive({
  url: '/api/activity/gamerLuckyDrop/bigWinMeterLuckyDailyRank',
  top1Url: '/api/activity/gamerLuckyDrop/historyTop1',
  infoText: 38,
  selDate: '', // DateAvatar 选中日期
  dateReady: false // DateAvatar 数据就绪
})

const apiParams = computed(() => {
  return { activityId, date: pageInfo.selDate, version: 1 }
})

const toRewardPage = () => {
  TOOL_BPFunc({ desc: 'rewards_icon_click', action: 'click' })
  // 满格金喜榜单固定为用户榜（rule type=2）
  router.replace('/home/rule?type=2')
}
</script>

<style lang="scss" scoped>
.rank-view-wrap {
  min-height: 6rem; // 不需要可以移除，主要目的是防止切换路由时高度变化
  .timer-wrap {
    margin-top: 0.83rem;
  }
  .rank-info {
    width: 5.82rem;
    margin: 0 auto;
    margin-top: 0.33rem;
    span {
      color: #a7fbff;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.34rem; /* 121.429% */
    }
  }
}
</style>
