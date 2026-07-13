<!--
  公会成员卡片组件
  用于公会成员榜单弹框中的成员列表
-->

<template>
  <div class="member-card" :class="cardClass">
    <!-- 排名 -->
    <div class="rank fc">
      <uiImg :n="`num${info.idx}`" v-if="info.idx <= 3" class="rank-img" />
      <span v-else class="rank-num">{{ info.idx }}</span>
    </div>

    <!-- 头像 -->
    <Avatar :info="info" />

    <Space :val="0.02" :h="0" />

    <!-- 用户名 -->
    <div class="name" v-marquee="{ center: true, speed: 50 }">
      {{ info.name || "--" }}
    </div>

    <Space :val="0.14" :h="0" />

    <!-- 分数 -->
    <div class="score fc">{{ formatScore(info.score) }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Avatar from "../Avatar.vue";

interface Props {
  info: Record<string, any>;
}

const props = defineProps<Props>();

// 根据排名返回不同的 class
const cardClass = computed(() => {
  const rank = props.info.idx;
  if (rank == 1) return "rank-1";
  if (rank == 2) return "rank-2";
  if (rank == 3) return "rank-3";
  return "rank-other";
});

// 格式化分数
const formatScore = (score: number | string) => {
  const num = Number(score);
  if (isNaN(num)) return score || "--";
  return num.toLocaleString();
};
</script>

<style lang="scss" scoped>
@use "../../../static/mixin.scss" as *;

.member-card {
  width: 5.82rem;
  height: 1.52rem;
  margin: 0 auto;
  margin-bottom: 0.08rem;
  @include bg("d-card");
  display: flex;
  align-items: center;

  &.rank-1,
  &.rank-2,
  &.rank-3 {
  }

  .rank {
    width: 0.6rem;
    height: 0.6rem;
    flex-shrink: 0;

    .rank-img {
      width: 0.6rem;
      height: 0.6rem;
      object-fit: contain;
    }

    .rank-num {
      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .name {
    width: 1.6rem;
    height: 0.32rem;

    color: #ffe89a;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 133.333% */
  }

  .score {
    width: 1.68rem;
    height: 0.48rem;
    @include bg("d-score");

    color: #f1ca86;
    text-align: center;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.48rem; /* 116.667% */
  }
}
</style>
