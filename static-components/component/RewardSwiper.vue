<!--
  榜单奖励展示组件
  使用示例：
  <RewardSwiper :reward="reward" :title="15" :tip="16" />
  
  Props:
  - reward: array - 奖励数据，一维数组
  - title: number - 标题文案索引 (TOOL_TEXT)
  - tip: number - 底部提示文案索引 (TOOL_TEXT)
-->

<template>
  <div
    class="reward-display"
    v-if="reward && reward.length > 0"
    :class="{ collapsed: !isExpanded }"
  >
    <!-- 标题栏（可展开/收起） -->
    <div class="title-bar fc" @click="toggleExpand">
      <div class="title-wrap">{{ TOOL_TEXT[props.title] }}</div>
      <Space :val="0.08" :h="0" />
      <uiImg n="arrow-down" class="arrow" :class="{ up: isExpanded }" />
    </div>
    <!-- 奖励内容（展开时显示） -->
    <div class="reward-content" :class="{ collapsed: !isExpanded }">
      <!-- 奖励列表 -->
      <Swiper
        class="reward-list"
        :list="reward"
        :threshold="4"
        :slidesPerView="4"
        swiperWidth="6.06rem"
      >
        <template #item="{ item }">
          <div class="item">
            <div class="rew fc">
              <cdnImg
                class="reward-img"
                :fid="item.fid"
                m="none"
                :w="''"
                :h="''"
              />
            </div>
            <div class="count fc">
              <div class="name-wrap">
                <NoticeBar :duration="3000">
                  <span class="name">{{ getGoodsName(item) }}</span>
                </NoticeBar>
              </div>
              <!-- <span class="days">*{{ item.days }} days</span> -->
            </div>
          </div>
        </template>
      </Swiper>

      <!-- 底部提示 -->
      <div class="tip fc" @click="showAllRewards">
        <span>{{ TOOL_TEXT[tip] }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fnGetInjectInfo } from "@components/developTool_TS";
import { useRewardName } from "../HappyEdiRamadan/hooks/useReward";
import NoticeBar from "@activity-business/h5-package-noticeBar";

interface RewardItem {
  goodsType: string;
  goodsId: number;
  count: number;
  empty: boolean;
  days: number;
  fid: string;
}

interface Props {
  reward: RewardItem[];
  title: number;
  tip: number;
  ruleType: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "showAll"): void;
}>();

const { TOOL_TEXT, TOOL_BPFunc } = fnGetInjectInfo();
const route = useRoute();
const router = useRouter();
const prevRouteBeforeRule = inject<Ref<string>>(
  "prevRouteBeforeRule",
  ref("/home")
);

// 路由名到榜单类型的映射
const routeToRankType: Record<string, string> = {
  rankSend: "send",
  rankReceive: "receive",
  rankGuild: "guild",
};

// 是否展开
const isExpanded = ref(true);

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 获取物品名称
const getGoodsName = (reward: RewardItem) => {
  return useRewardName(reward);
};

// 显示全部奖励 - 跳转到 rule 页面
const showAllRewards = () => {
  const currentRouteName = route.name as string;
  const rankType = routeToRankType[currentRouteName] || "send";
  prevRouteBeforeRule.value = route.fullPath;
  router.push({ name: "rule", query: { tab: "1", rankType } });
  emit("showAll");
};
</script>

<style lang="scss" scoped>
@use "../static/mixin.scss" as *;

.reward-display {
  width: 6.25rem;
  height: 3.26rem;
  @include bg("p3-card");
  margin: 0 auto;
  margin-top: 0.16rem;
  margin-bottom: 0.32rem;
  transition: height 0.3s ease, background-image 0.3s ease;
  overflow: hidden;

  position: relative;

  &.collapsed {
    height: auto;
    background-image: none;
    position: relative;

    &::after {
      content: "";
      width: 6.25rem;
      height: 0.85rem;
      @include bg("p2-reward-list-small");
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: -1;
    }
  }

  .title-bar {
    width: 5.4rem;
    height: 0.56rem;
    // @include bg("reward-title");
    margin: 0 auto;
    margin-top: 0.26rem;
    margin-bottom: 0.14rem;
    position: relative;

    .title-wrap {
      height: 0.32rem;
      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 114.286% */
    }

    .arrow {
      width: 0.24rem;
      height: 0.12rem;
      object-fit: contain;
      transition: transform 0.3s ease;

      &.up {
        transform: rotate(180deg);
      }
    }
  }

  .reward-content {
    width: 6.06rem;
    height: 2.16rem;
    margin: 0 auto;
    overflow: hidden;
    opacity: 1;
    transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;

    &.collapsed {
      max-height: 0;
      opacity: 0;
      padding-top: 0;
    }

    .reward-list {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 0.09rem;

      .item {
        .rew {
          width: 1.32rem;
          height: 1.32rem;
          aspect-ratio: 1/1;
          margin: 0 auto;
          @include bg("rew");

          .reward-img {
            width: 1.06rem;
            height: 1.05rem;
            object-fit: contain;
          }
        }

        .count {
          width: 1.28rem;
          height: 0.28rem;
          margin: 0 auto;
          margin-top: 0.04rem;
          flex-direction: column;
          gap: 0.02rem;

          .name-wrap {
            width: 1.28rem;
            height: 0.28rem;
            overflow: hidden;

            .name {
              color: #f9ffc8;
              text-align: center;
              font-family: "SF UI Text";
              font-size: 0.24rem;
              font-style: normal;
              font-weight: 500;
              line-height: 0.28rem; /* 100% */
            }
          }

          .days {
            margin-top: -0.1rem;
            color: #fff;
            text-align: center;
            font-family: "SF UI Text";
            font-size: 0.27159rem;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: -0.0097rem;
          }
        }
      }
    }

    .tip {
      margin-top: 0.24rem;

      span {
        color: #f9ffc8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.32rem; /* 133.333% */
        text-transform: capitalize;
      }

      .arrow-text {
        color: #f9ffc8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.32rem; /* 133.333% */
        text-transform: capitalize;
      }
    }
  }
}

// JavaScript 钩子控制动画，无需 CSS 类
</style>
