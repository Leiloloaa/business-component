<template>
  <div class="rank-view-wrap">
    <FixedTop>
      <DateTab v-if="!tempConfig.onlyTotal" v-model="dayTotal" />
      <DateAvatar
        v-if="dayTotal == 0"
        :api="tempConfig.top1Url"
        :apiParams="{ activityId, type: 1, other: 1 }"
        v-model="selDate"
        @ready="dateReady = true"
      />
    </FixedTop>

    <RankTemp
      v-if="tempConfig.showRank"
      frameType="rank"
      :rankType="tempConfig.rankType"
      :url="tempConfig.url"
      :params="tempConfig.params"
      :infoText="tempConfig.infoText"
      :dayTotal="dayTotal"
      :selDate="selDate"
      paddingBottom="0.72rem"
    ></RankTemp>
  </div>
</template>

<script lang="ts" setup name="RankCpPage">
import { computed } from "vue";
import { useRankPage } from "../Static/useRankPage";
import RankTemp from "../Static/RankTemp.vue";
import DateTab from "../Static/DateTab.vue";
import DateAvatar from "../Static/DateAvatarCp.vue";

// 使用通用榜单页面逻辑
const { dayTotal, selDate, tempConfig, activityId, dateReady } = useRankPage({
  rankType: "cp", // 榜单类型: user/anchor/cp/family/default 用来区分接口以及对应的 card
  pageBpDesc: "", // 页面挂载时的埋点描述
  onlyTotal: false, // 如果只有总榜没有日榜，设置为 true
  use0TimeZone: false, // 是否使用 0 时区时间，默认是 false，游戏、家族、公会等需要注意
  infoTextList: [73, 74],
  params: computed(() => ({
    other: 1, // 1-用户日榜，2-用户总榜 ... 具体看 apiFox
  })),
});
</script>

<style lang="scss" scoped>
.rank-view-wrap {
  min-height: 6rem; // 不需要可以移除，主要目的是防止切换路由时高度变化
}
</style>
