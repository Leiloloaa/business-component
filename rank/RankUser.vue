<template>
  <div class="rank-view-wrap">
    <FixedTop>
      <TabsDate v-model="dayTotal" />
      <SlotDateAvatar
        v-if="dayTotal == 0"
        :api="tempConfig.top1Url"
        :apiParams="{ activityId }"
        v-model="selDate"
      />
    </FixedTop>

    <RankTemplate
      frameType="rank"
      :rankType="rankType"
      :url="tempConfig.url"
      :params="tempConfig.params"
      :infoText="tempConfig.infoText"
      :dayTotal="dayTotal"
      :selDate="selDate"
      paddingBottom="0.72rem"
    ></RankTemplate>
  </div>
</template>

<script lang="ts" setup name="RankNew">
import { useRankPage } from '../groupFunc/useRankPage'

// 使用通用榜单页面逻辑
const { rankType, dayTotal, selDate, tempConfig, activityId } = useRankPage({
  rankType: 'an',
  dayTotal: 0,
  params: {}
})
</script>

<style lang="scss" scoped>
.rank-view-wrap {
  min-height: 6rem; // 不需要可以移除，主要目的是防止切换路由时高度变化
}
</style>
