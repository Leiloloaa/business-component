<template>
  <div class="rank-card" :class="cardClass">
    <uiImg
      :n="TOOL_countryCode == 'EG' ? 'stamp-EG' : 'stamp-TR'"
      v-if="info.stamp && info.status == 0"
      class="stamp"
      :class="TOOL_countryCode"
    />

    <Space :val="0.26" :h="0" />

    <!-- 排名徽章 -->
    <div class="num fc">
      <uiImg :n="`num${info.idx}`" v-if="info.idx <= 3 && !isUser" />
      <span v-else>{{ info.idx }}</span>
    </div>

    <!-- 头像 -->
    <Avatar :info="info" :isUser="isUser" />

    <Space :val="0.12" :h="0" />

    <div class="info-wrap" v-if="isUser && info.rank != 1">
      <!-- 用户名 -->
      <div class="name" v-marquee="{ center: true, speed: 50 }">
        {{ info.name || "--" }}
      </div>

      <Space :val="0.32" :h="0" />

      <!-- 分数 -->
      <div class="score">{{ info.score || "--" }}</div>
    </div>

    <template v-else>
      <!-- 用户名 -->
      <div class="name" v-marquee="{ center: true, speed: 50 }">
        {{ info.name || "--" }}
      </div>

      <Space :val="0.1" :h="0" />

      <!-- 分数 -->
      <div class="score">{{ info.score || "--" }}</div>
    </template>

    <!-- isUser 时显示距离信息 -->
    <div class="distance-info" v-if="isUser && showDistance">
      <div class="distance-label" v-marquee="{ center: true, speed: 50 }">
        {{ distanceLabel }}
      </div>
      <div class="distance-value">{{ info.diffPreviousScore }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import Avatar from "./Avatar.vue";

interface Props {
  info: Record<string, any>;
  isUser?: boolean;
}

const { TOOL_countryCode, TOOL_TEXT } = fnGetInjectInfo();

const props = defineProps<Props>();
// 是否为总榜
const isTotal = computed(() => props.info?.selDate === "999");

// 根据排名返回不同的 class
const cardClass = computed(() => {
  if (props.isUser) return "rank-user";
  const rank = props.info.idx;
  if (rank == 1) return "rank-top";
  if (rank == 2) return "rank-top";
  if (rank == 3) return "rank-top";
  return "rank-other";
});

// 解析排名数字（处理 "99+" "300+" 等格式）
const parseRank = (rank: string | number) => {
  const str = String(rank).replace("+", "");
  return Number(str) || 0;
};

// 是否显示距离信息
const showDistance = computed(() => {
  if (!props.isUser) return false;
  const rank = parseRank(props.info.rank);
  // top1 不展示
  if (rank === 1) return false;
  return true;
});

// 距离标签
const distanceLabel = computed(() => {
  const rank = parseRank(props.info.rank);
  const template = TOOL_TEXT[30] || "Distance Top%a%";

  // 300名以外
  if (rank > 300) {
    return template.replace("%a%", "300");
  }

  // 总榜
  if (isTotal.value) {
    if (rank > 10) {
      return template.replace("%a%", "10");
    }
    return template.replace("%a%", String(rank - 1));
  }

  // 日榜
  if (rank > 3) {
    return template.replace("%a%", "3");
  }
  return template.replace("%a%", String(rank - 1));
});
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.rank-card {
  width: 6.6rem;
  height: 1.9rem;
  @include bg("card");

  position: relative;

  margin: 0 auto;
  margin-bottom: 0.04rem;

  padding-top: 0.3rem;

  display: flex;
  align-items: center;

  &.rank-top {
    width: 6.6rem;
    height: 1.9rem;
    @include bg("card1");
  }

  .stamp {
    width: 1.46rem;
    height: 1.05rem;
    object-fit: contain;

    position: absolute;
    top: 0.1rem;
    right: -0.1rem;
    z-index: 20;

    &.EG {
      right: unset;
      left: -0.1rem;
    }
  }

  .num {
    width: 0.6rem;
    height: 0.6rem;

    img {
      width: 0.6rem;
      height: 0.6rem;
    }

    span {
      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .info-wrap {
    width: 1.84rem;
    display: flex;
    flex-direction: column;

    .score {
      margin-top: 0.1rem;
    }
  }

  // isUser 模式下的距离信息
  .distance-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-left: auto;
    margin-right: 0.2rem;

    .distance-label {
      width: 1.97rem;
      height: 0.3rem;

      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem; /* 125% */
    }

    .distance-value {
      width: 1.97rem;
      height: 0.3rem;

      text-align: center;
      color: #fb0;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.3rem;
    }
  }

  .name {
    width: 1.81rem;
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
    @include bg("score");
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
