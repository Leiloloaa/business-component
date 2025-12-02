<template>
  <div class="rank-template">
    <RankLoad
      ref="loadRef"
      :api="props?.url"
      :apiParams="apiParams"
      :rankIndex="rankIndex"
      :frame="frame"
      :frameType="frameType"
      :paddingBottom="paddingBottom"
    >
      <template #outFrame="{ info }">
        <img
          v-if="!isDaily"
          class="reward-icon shake"
          :src="`${ossUrl}/reward-icon.png`"
          @click="toRewardPage"
        />
      </template>

      <template #info="{ info }">
        <div class="timer-wrap">
          <Timer :timeLeft="info?.timeLeft" :status="info?.status" />
        </div>

        <div class="rank-info fc" v-if="infoText">
          <span> {{ TOOL_TEXT[infoText] }} </span>
        </div>
      </template>

      <template #top3="{ info }">
        <component
          :is="componentMap.topThree"
          :info="info"
          :key="route?.path"
          v-if="isShowComp(info, 'top3')"
        />
      </template>

      <template #card="{ info }">
        <component
          :is="componentMap.card"
          :info="info"
          :isDaily="isDaily"
          :key="route?.path"
          v-show="isShowComp(info, 'card')"
        />
        <div
          v-if="isShowRewardNum && (isDaily ? info?.idx == 3 : info?.idx == 10)"
          class="safetyLine"
          :key="route?.path"
        >
          {{ TOOL_TEXT[616] || "The above can be rewarded" }}
        </div>
      </template>

      <template #userInfo="{ info }">
        <teleport to="body">
          <component
            v-show="showUserInfo && info.isOnTheRank"
            :is="componentMap.userInfo"
            :info="info"
            :isDaily="isDaily"
            :key="route?.path"
            isCardStyle
          />
        </teleport>
      </template>
    </RankLoad>
  </div>
</template>

<script lang="ts" setup name="Rank">
import injectTool from "@publicComponents/injectTool";
import useUserInfo from "@hooks/useUserInfo";
import RankLoad from "./RankLoad.vue";
// 榜单
import TopThree from "../Rank/RankCard/TopThree.vue";
import Card from "../Rank/RankCard/Card.vue";
import UserInfo from "../Rank/RankCard/UserInfo.vue";

const route = useRoute();
const router = useRouter();
const activityId = inject("activityId");
const ossUrl = inject("ossUrl");
const { TOOL_TEXT, TOOL_BPFunc } = injectTool();

const { showUserInfo } = useUserInfo(700);

const props = defineProps({
  rankType: { type: String, default: "" }, // 榜单类型: user/anchor/cp/family/default 用来区分接口以及对应的 card
  frameType: { type: String, default: "rank" }, // 榜单类型: rank/xxx
  frame: { type: Boolean, default: true }, // 是否显示榜单外框
  url: { type: String, default: "" },
  params: { type: Object, default: () => ({}) },
  dayTotal: { type: Number, default: 0 },
  selDate: { type: String, default: "" },
  infoText: { type: Number, default: 1 },
  paddingBottom: { type: String, default: "" },
});

const rankIndex = ref(0); // 手动触发榜单更新
const isDaily = computed(() => {
  return props.url.includes("Day") || props.url.includes("Daily");
});

const isShowRewardNum = false; // 是否显示前 x 可获得奖励，The above can be rewarded
const isOnShowCard = ["cp"].includes(props.rankType); // 是否只显示card，不显示top3的榜单类型
const isShowComp = (info, comp) => {
  if (isOnShowCard) {
    return comp != "top3"; // 只显示card，不显示top3
  } else {
    if (comp === "top3") {
      return !isDaily.value; // 日榜，不显示top3
    } else if (comp === "card") {
      return !isDaily.value && Number(info?.idx) > 3; // 总榜且不是前三，显示card
    }
  }
};

const apiParams = computed(() => {
  // 通用榜单接口，传 version = 1，表示走必传 date 逻辑
  const dateObj = isDaily.value ? { date: props.selDate, version: 1 } : {};
  return { activityId, ...dateObj, ...props.params };
});

const componentMap = computed(() => {
  const map = {
    // 根据榜单类型 引入对应的 card、userInfo、topThree
    // xx: {
    //   card: XXCard,
    //   userInfo: XXUserInfo,
    //   topThree: XXTopThree
    // },
    default: {
      card: Card,
      userInfo: UserInfo,
      topThree: TopThree,
    },
  };
  return map[props.rankType] || map.default;
});

const toRewardPage = () => {
  TOOL_BPFunc({ desc: "rewards_icon_click", action: "click" });
  const map = { user: 2, anchor: 3, ranknew: 4 };
  router.replace(`/home/rule?type=${map[props.rankType]}`);
};
</script>

<style lang="scss" scoped>
.rank-template {
  margin-bottom: 1.5rem;
  position: relative;

  .reward-icon {
    width: 1.26rem;
    height: 1.24rem;
    flex-shrink: 0;

    position: absolute;
    top: -0.1rem;
    right: 0.2rem;
    z-index: 20;
  }

  .timer-wrap {
    margin-top: 1.25rem;
  }

  .rank-info {
    width: 6.4rem;

    margin: 0 auto;
    margin-top: 0.24rem;
    margin-bottom: 0.44rem;

    span {
      width: 5.9rem;
      color: #e7ceff;
      text-align: center;
      text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.34rem; /* 130.769% */
    }
  }
}
</style>
