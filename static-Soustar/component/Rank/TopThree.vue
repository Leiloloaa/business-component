<template>
  <!-- 前三名 -->
  <div class="top-three" :class="TOOL_countryCode">
    <uiImg
      :n="`top3-bg${TOOL_countryCode == 'EG' ? '' : ''}`"
      class="top3-bg"
    />
    <template v-for="item in [1, 0, 2]" :key="'top' + info.idx">
      <div :class="['top-item', `top${item + 1}`]">
        <uiImg
          :n="TOOL_countryCode == 'EG' ? 'stamp-EG' : 'stamp-TR'"
          class="stamp"
          v-if="info.status == 0 && info.list[item] && info.list[item].stamp"
        />

        <!-- 头像 -->
        <Avatar :info="{ ...info.list?.[item], idx: item + 1 }" isTop3 />

        <Outline
          class="name"
          v-marquee="{ center: true, speed: 50 }"
          :color="'0.05rem #af2300'"
          :text="(info.list[item] && info.list[item].name) || '--'"
          noColor
        />

        <div class="score">
          {{ (info.list[item] && info.list[item].score) || "---" }}
        </div>
      </div>

      <!-- 第一名和二三名的间距 -->
      <Space :val="-0.36" v-if="item !== 2" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { fnGetInjectInfo } from "@components/developTool_TS";
import Avatar from "./Avatar.vue";

const { TOOL_countryCode, TOOL_TEXT } = fnGetInjectInfo();

const props = withDefaults(defineProps<{ info: any }>(), {});
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;
.top-three {
  width: 6.52448rem;
  height: 4.13218rem;
  display: flex;
  justify-content: center;

  margin: 0 auto;
  margin-top: 0.2rem;

  position: relative;

  .top3-bg {
    width: 6.52rem;
    height: 8.95rem;

    position: absolute;
    top: -2.9rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .top-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    .desc {
      position: absolute;
      top: -0.25rem;
      left: 50%;
      transform: translateX(-50%);

      width: 0.8rem;
      height: 0.8rem;
      flex-shrink: 0;
      z-index: 9;
    }

    .stamp {
      width: 1.46rem;
      height: 1.05rem;

      object-fit: contain;

      position: absolute;
      top: -0.1rem;
      right: -0.4rem;
      z-index: 4;

      &.EG {
        left: -0.4rem;
        right: auto;
      }
    }

    .name {
      width: 1.79rem;
      height: 0.34rem;
      flex-shrink: 0;

      margin-top: -0.1rem;

      color: #fdffe6;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */

      text-align: center;

      position: relative;
      z-index: 5;
    }

    .score {
      width: 1.68rem;
      height: 0.48rem;
      @include bg("score");

      margin-top: 0.08rem;

      color: #f1ca86;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.28rem; /* 116.667% */

      text-align: center;
      line-height: 0.48rem !important;
    }
  }

  .top1 {
    z-index: 3;

    .desc {
      right: 0.16rem;
    }

    .stamp {
      // top: 0.28rem;
    }
  }

  .top2,
  .top3 {
    margin-top: 0.64rem;

    .stamp {
      right: -0.07rem;
    }
  }
}
</style>
