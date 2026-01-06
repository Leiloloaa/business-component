<template>
  <div class="guild-rank" v-if="flag">
    <div class="info">{{ TOOL_TEXT[73] }}</div>

    <!-- 阶段榜 -->
    <StageRankButtons
      :current-stage="2"
      :stage-list="stageList"
      v-model:sel-stage="selectedStage"
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
import injectTool from "@publicComponents/injectTool";
import StageRankButtons from "./StageRankButtons.vue";
import { useRankPage } from "../Static/RankComp/useRankPage";
import RankTemp from "../Static/RankComp/RankTemp.vue";

// 使用通用榜单页面逻辑
const { rankType, dayTotal, selDate, tempConfig, activityId } = useRankPage({
  rankType: "union",
  dayTotal: 1,
  params: computed(() => ({ other: `7,${selStage.value}` })),
});
const selStage = ref(1);

provide("guildRankStage", selStage);
const ossUrl = inject("ossUrl");
const {
  TOOL_BPFunc,
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_loading,
  TOOL_httpClient,
  TOOL_toast,
  TOOL_NUM,
} = injectTool();
TOOL_BPFunc({ desc: "Annual Agency tab", action: "click" });
TOOL_BPFunc({ desc: "Annual Agency tab-Reward Exposure", action: "show" });

// 阶段榜相关
const currentStage = ref(1);
const flag = ref(false);
const getInfo = async () => {
  const url = "/api/activity/AnnualCeremony2025/getUnionStage";
  const res = await TOOL_httpClient({
    url: url,
    method: "get",
  });
  const { data, errorCode } = res.data;
  if (errorCode != 0) throw res;
  currentStage.value = data;
  selStage.value = data;
  flag.value = true;
};

getInfo();

const stageList = computed(() => {
  return [
    { stage: 1, text1: "第一阶段", text2: "2024-01-01", title: "阶段一" },
    { stage: 2, text1: "第二阶段", text2: "2024-01-15", title: "阶段二" },
    { stage: 3, text1: "第三阶段", text2: "2024-02-01", title: "总决赛" },
  ];
});
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
    font-family: "SF UI Text";
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.32rem; /* 114.286% */
  }
}
</style>
