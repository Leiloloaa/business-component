<template>
  <div class="rank-view-wrap">
    <FixedTop>
      <DateTab v-model="dayTotal" />
      <DateAvatar
        v-show="dayTotal == 0"
        :api="tempConfig.top1Url"
        :apiParams="{ activityId }"
        v-model="selDate"
        @ready="dateReady = true"
      />
    </FixedTop>

    <RankTemp
      v-if="dateReady"
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

<script lang="ts" setup name="RankNew">
import { ref } from "vue";
import { useRankPage } from "../Static/RankComp/useRankPage";
import RankTemp from "../Static/RankComp/RankTemp.vue";
import DateTab from "../Static/RankComp/DateTab.vue";
import DateAvatar from "../Static/RankComp/DateAvatar.vue";

// DateAvatar 初始化完成标记
const dateReady = ref(false);

// 使用通用榜单页面逻辑
const { rankType, dayTotal, selDate, tempConfig, activityId } = useRankPage({
  rankType: "family", // 榜单类型: user/anchor/cp/family/default 用来区分接口以及对应的 card
  dayTotal: 0, // 0-日榜，1-总榜
  use0TimeZone: false, // 是否使用 0 时区时间，默认是 false，游戏、家族、公会等需要注意
  params: () => ({
    // other: 1, // 1-用户日榜，2-用户总榜 ... 具体看 apiFox
  }),
});
</script>

<style lang="scss" scoped>
.rank-view-wrap {
  min-height: 6rem; // 不需要可以移除，主要目的是防止切换路由时高度变化
}
</style>
