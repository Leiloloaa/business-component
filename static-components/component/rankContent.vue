<!--
  榜单内容组件
  使用示例：
  <RankContent 
    :api="api" 
    :params="rankParams" 
    :selDate="selDate"
    :rankType="'user'"
    :infoList="['15', '16']"
  />
  
  Props:
  - api: string - 榜单 API 地址
  - params: object - 榜单请求参数
  - selDate: string - 选中的日期 (用于刷新榜单的 key)
  - rankType: string - 榜单类型 (user/guild)
  - infoList: string[] - 文案索引列表 [奖励标题, 奖励提示]
  - rewardTitle: number - 奖励标题文案索引，默认 15
  - rewardTip: number - 奖励提示文案索引，默认 16
-->

<template>
  <div class="rank-content">
    <RankLoad :api="api" :params="params" :key="`rank-${selDate}`">
      <template #info="{ info }">
        <Timer
          :time-left="info.timeLeft"
          :style="{
            marginTop: selDate == '999' ? '1.8rem' : '0.16rem',
            marginBottom: '0.16rem',
          }"
        />
        <div class="info">
          {{ TOOL_TEXT[selDate == "999" ? infoList[1] : infoList[0]] }}
        </div>
      </template>
      <template #top3="{ info }">
        <RewardSwiper
          v-if="info.reward"
          :key="api"
          :reward="handleReward(info.reward) || []"
          :title="selDate == '999' ? 44 : 41"
          :tip="42"
          :ruleType="0"
          @showAll="onShowAllRewards"
        />

        <component
          :is="TopThreeComponent"
          :info="{ ...info, selDate }"
          v-if="selDate == '999' && rankType != 'guild'"
        />
      </template>
      <template #card="{ info }">
        <component
          :is="CardComponent"
          :info="{ ...info, selDate }"
          @viewMore="onViewMore"
          v-if="rankType === 'guild' || selDate !== '999' || info.idx > 3"
        />
      </template>
      <template #userInfo="{ info }">
        <component
          :is="UserInfoComponent"
          :info="{ ...info, selDate }"
          :selDate="selDate"
          @viewMore="onViewMore"
          v-if="rankType === 'guild' ? info?.isOnTheRank : true"
        />
      </template>
    </RankLoad>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import UserCard from "./Rank/Card.vue";
import UserTopThree from "./Rank/TopThree.vue";
import UserUserInfo from "./Rank/UserInfo.vue";
import GuildCard from "./RankGuild/Card.vue";
import GuildUserInfo from "./RankGuild/UserInfo.vue";
import RewardSwiper from "./RewardSwiper.vue";
import { useScrollProgress } from "../HappyEdiRamadan/hooks/useScrollProgress";
import { fnGetInjectInfo } from "@components/developTool_TS";

const { TOOL_TEXT, TOOL_countryCode } = fnGetInjectInfo();

const props = withDefaults(
  defineProps<{
    api: string;
    params: Record<string, any>;
    selDate: string;
    rankType?: string;
    infoList?: string[];
    rewardTitle?: number;
    rewardTip?: number;
  }>(),
  {
    rankType: "user",
    infoList: () => ["15", "16"],
    rewardTitle: 15,
    rewardTip: 16,
  }
);

const emit = defineEmits<{
  (e: "showAllRewards"): void;
  (e: "viewMore", info: Record<string, any>): void;
}>();

// 滚动超过可滚动区域的 20% 才显示 UserInfo
const { isOverThreshold: showUserInfo } = useScrollProgress(0.1);

// 固定奖励项配置
const REWARD_ITEMS = {
  c1: {
    fid: "https://static.dopalive.com/op/8ee03ec5e21c4a05.png",
    days: 0,
    count: 0,
    goodsType: "c1",
  },
  c2: {
    fid: "https://static.dopalive.com/op/66331b9e75a34b12.png",
    days: 0,
    count: 0,
    goodsType: "c2",
  },
  c3: {
    fid: "https://static.dopalive.com/op/3b79ad43f83d4f17.png",
    days: 0,
    count: 0,
    goodsType: "c3",
  },
  // gold: { fid: "https://static.dopalive.com/op/c5dac8ca8e7c48ae.png", days: 0, count: 0, goodsType: "gold" },
};

// 根据 countryCode 和 rankType 配置前置奖励
const PREPEND_CONFIG: Record<
  string,
  Record<string, (keyof typeof REWARD_ITEMS)[]>
> = {
  TR: {
    user: [],
    anchor: [],
  },
  DEFAULT: {
    user: ["c1", "c2"],
    anchor: ["c1", "c2"],
    guild: ["c1", "c2", "c3"],
  },
};

// 处理 reward 数据，将所有 giftBagInfo 合并成一个数组
const handleReward = (reward: any[]) => {
  if (!reward || !Array.isArray(reward)) return [];
  const _reward = [...reward];

  // 仅总榜时插入固定奖励
  if (props.selDate === "999") {
    const countryConfig =
      PREPEND_CONFIG[TOOL_countryCode] || PREPEND_CONFIG.DEFAULT;
    const keys = countryConfig[props.rankType] || [];
    const items = keys.map((key) => ({ ...REWARD_ITEMS[key] }));
    _reward.unshift(...items);
  }

  return _reward;
};

// 查看更多（公会成员）
const onViewMore = (info: Record<string, any>) => {
  emit("viewMore", info);
};

// 根据 rankType 动态选择组件
const TopThreeComponent = computed(() => {
  return UserTopThree;
});

const CardComponent = computed(() => {
  return props.rankType === "guild" ? GuildCard : UserCard;
});

const UserInfoComponent = computed(() => {
  return props.rankType === "guild" ? GuildUserInfo : UserUserInfo;
});

// 显示全部奖励
const onShowAllRewards = () => {
  emit("showAllRewards");
};
</script>

<style lang="scss" scoped>
@use "../static/mixin.scss" as *;

.rank-content {
  min-height: 4rem;
  position: relative;
  &::before {
    content: "";
    width: 6.78rem;
    height: 6.75rem;
    @include bg("rank-content-bg");
    position: absolute;
    top: -1.9rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .info {
    width: 6.07rem;

    margin: 0 auto;

    color: #eedfff;
    text-align: center;
    font-family: Arial;
    font-size: 0.26rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.32rem; /* 123.077% */
  }
}
</style>
