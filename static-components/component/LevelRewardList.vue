<!--
  阶层奖励列表组件（支持轮播）
  使用示例：
  <LevelRewardList :rewards="level.rewards?.[0]?.giftBagInfo" :finished="level.finished" />:class="{ unfinished: !finished }"
-->

<template>
  <div class="level-reward-list">
    <Swiper
      :list="rewards || []"
      :threshold="4"
      :slidesPerView="4"
      swiperWidth="4.8rem"
    >
      <template #item="{ item }">
        <div class="reward-item">
          <!-- 天数标签 -->
          <div class="day-tag fc" v-if="item.days">
            <span>{{ getRewardNum(item) }}</span>
          </div>
          <!-- 奖励图片 -->
          <div class="reward-img">
            <cdnImg v-if="item.fid" :fid="item.fid" class="img" />
          </div>
          <div class="name fc">
            <span v-marquee="{ center: true, speed: 50 }">{{
              useRewardName(item)
            }}</span>
          </div>
        </div>
      </template>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
import {
  useRewardNum,
  useRewardName,
} from "./useReward";

interface Props {
  rewards: any[];
  finished?: boolean;
}

withDefaults(defineProps<Props>(), {
  rewards: () => [],
  finished: false,
});

const getRewardNum = (item: any) => {
  return useRewardNum(item, { showSymbol: false });
};
</script>

<style lang="scss" scoped>
@use "../static/mixin.scss" as *;

.level-reward-list {
  width: 100%;

  :deep(.reward-list) {
    justify-content: center;
    gap: 0.08rem;
  }
}

.reward-item {
  position: relative;
  width: 1.32rem;
  height: 1.32rem;
  @include bg("rew");

  .task-finish-icon {
    width: 0.3rem;
    height: 0.3rem;

    position: absolute;
    bottom: 0.11rem;
    right: 0.03rem;
  }

  .day-tag {
    width: 0.9rem;
    height: 0.3rem;
    @include bg("rew-desc");
    position: absolute;
    top: -0.12rem;
    right: -0.08rem;
    z-index: 3;

    span {
      color: #4a2214;
      text-align: center;
      font-family: Arial;
      font-size: 0.2rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .reward-img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1.06rem;
    height: 1.05rem;
    z-index: 0;

    .img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .name {
    width: 1.28rem;
    height: 0.28rem;

    position: absolute;
    bottom: -0.32rem;
    left: 50%;
    transform: translateX(-50%);

    span {
      width: 1.28rem;

      color: #f9ffc8;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.24rem; /* 100% */
    }
  }

  &.unfinished {
    filter: grayscale(100%);
  }
}
</style>
