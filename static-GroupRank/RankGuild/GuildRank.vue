<template>
  <div class="guild-rank" v-if="flag">
    <PoolSwiper :rewardType="11" />
    <div class="info">{{ TOOL_TEXT[73] }}</div>
    <!-- 阶段榜 -->
    <StageRankButtons
      v-model:selStage="selStage"
      :currentStage="currentStage"
      :stageList="stageList"
    />

    <RankTemp
      frameType="rank"
      :rankType="rankType"
      :url="tempConfig.url"
      :params="tempConfig.params"
      :infoText="tempConfig.infoText"
      :dayTotal="dayTotal"
      :selDate="selDate"
      paddingBottom="0.72rem"
    ></RankTemp>
  </div>
</template>

<script lang="ts" setup name="GuildRank">
import injectTool from '@publicComponents/injectTool'
import StageRankButtons from './StageRankButtons.vue'
import PoolSwiper from '../Swiper/PoolSwiper.vue'
import { useRankPage } from '../RankGroup/useRankPage'
import RankTemp from '../RankGroup/RankTemp.vue'

// 使用通用榜单页面逻辑
const { rankType, dayTotal, selDate, tempConfig, activityId } = useRankPage({
  rankType: 'union',
  dayTotal: 1,
  params: computed(() => ({ other: `7,${selStage.value}` }))
})
const selStage = ref(1)

provide('guildRankStage', selStage)
const ossUrl = inject('ossUrl')
const {
  TOOL_BPFunc,
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_loading,
  TOOL_httpClient,
  TOOL_toast,
  TOOL_NUM
} = injectTool()
TOOL_BPFunc({ desc: 'Annual Agency tab', action: 'click' })
TOOL_BPFunc({ desc: 'Annual Agency tab-Reward Exposure', action: 'show' })

// 阶段榜相关
const currentStage = ref(1)
const flag = ref(false)
const getInfo = async () => {
  const url = '/api/activity/AnnualCeremony2025/getUnionStage'
  const res = await TOOL_httpClient({
    url: url,
    method: 'get'
  })
  const { data, errorCode } = res.data
  if (errorCode != 0) throw res
  currentStage.value = data
  selStage.value = data
  if (TOOL_countryCode == 'TR') {
    currentStage.value = currentStage.value > 3 ? 3 : currentStage.value
    selStage.value = selStage.value > 3 ? 3 : selStage.value
  } else if (['IN', 'PK', 'ID'].includes(TOOL_countryCode)) {
    currentStage.value = currentStage.value > 4 ? 4 : currentStage.value
    selStage.value = selStage.value > 4 ? 4 : selStage.value
  }
  flag.value = true
}

getInfo()

const stageList = computed(() => {
  // XM/BD 全赛程
  if (['EG', 'BD'].includes(TOOL_countryCode)) {
    return [
      { title: TOOL_TEXT[74], info: TOOL_TEXT[79], date: TOOL_TEXT[80] },
      { title: TOOL_TEXT[75], info: TOOL_TEXT[81], date: TOOL_TEXT[82] },
      { title: TOOL_TEXT[76], info: TOOL_TEXT[83], date: TOOL_TEXT[84] },
      { title: TOOL_TEXT[77], info: TOOL_TEXT[85], date: TOOL_TEXT[86] },
      { title: TOOL_TEXT[78], info: TOOL_TEXT[87], date: TOOL_TEXT[88] }
    ]
  } else if (TOOL_countryCode == 'TR') {
    return [
      { title: TOOL_TEXT[74], info: TOOL_TEXT[79], date: TOOL_TEXT[80] },
      { title: TOOL_TEXT[77], info: TOOL_TEXT[81], date: TOOL_TEXT[82] },
      { title: TOOL_TEXT[78], info: TOOL_TEXT[83], date: TOOL_TEXT[84] }
    ]
  } else if (['IN', 'PK', 'ID'].includes(TOOL_countryCode)) {
    return [
      { title: TOOL_TEXT[74], info: TOOL_TEXT[79], date: TOOL_TEXT[80] },
      { title: TOOL_TEXT[75], info: TOOL_TEXT[81], date: TOOL_TEXT[82] },
      { title: TOOL_TEXT[77], info: TOOL_TEXT[83], date: TOOL_TEXT[84] },
      { title: TOOL_TEXT[78], info: TOOL_TEXT[85], date: TOOL_TEXT[86] }
    ]
  }
})
</script>

<style lang="scss" scoped>
.guild-rank {
  min-height: 6rem;

  .info {
    width: 6.37rem;
    margin: 0 auto;
    margin-top: 0.36rem;
    color: #d33f00;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.32rem; /* 114.286% */
  }
}
</style>
