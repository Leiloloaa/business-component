<template>
  <div class="rank-page">
    <!-- 日榜/总榜切换 -->
    <TabsDate @ready="onDateReady" @change="onDateChange" />

    <!-- 等待 TabsDate 初始化完成后才挂载 -->
    <RankContent
      v-if="isReady"
      :key="`rank-${selDate}`"
      :api="api"
      :params="rankParams"
      :selDate="selDate"
      :rankType="rankConfig.rankType"
      :infoList="rankConfig.infoList"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import TabsDate from "../../components/Tabs/TabsDate.vue";
import RankContent from "../../components/RankContent.vue";

const { TOOL_BPFunc } = fnGetInjectInfo();
const activityId = inject("activityId");

const rankConfig = {
  rankType: "user",
  infoList: ["15", "16"],
};

// 是否初始化完成
const isReady = ref(false);

// 选中的日期 (API格式: YYYYMMDD)
const selDate = ref("");

// TabsDate 初始化完成
const onDateReady = (dateForApi: string) => {
  selDate.value = dateForApi;
  isReady.value = true;
};

// 日期变化
const onDateChange = (dateForApi: string) => {
  selDate.value = dateForApi;
  TOOL_BPFunc({
    desc: selDate.value == "999" ? "View_giving_page" : "View_daily_ranking",
    action: "click",
  });
};
TOOL_BPFunc({
  desc: "View_daily_ranking",
  action: "click",
});
// API 地址 - 送礼榜
const api = computed(() =>
  selDate.value == "999"
    ? "/api/activity/commonBusiness/userTotalRank"
    : "/api/activity/commonBusiness/userDailyRank"
);

// 榜单请求参数
const rankParams = computed(() =>
  selDate.value == "999"
    ? { activityId }
    : {
        activityId,
        date: selDate.value,
      }
);
</script>

<style lang="scss" scoped>
.rank-page {
  width: 100%;
  padding-top: 0.91rem;
}
</style>
