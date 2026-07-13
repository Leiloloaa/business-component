<!--
  使用示例：
  方式一：通过 props 传入数据
  <Progress
    :curScore="100"
    :reqScore="200"
  />
  
  方式二：通过 inject 的 groupInfo 获取数据（如果未传 props）
  <Progress />
  
  Props:
  - curScore?: number - 当前分数，默认 0（如果未传则从 groupInfo.curScore 获取）
  - reqScore?: number - 所需分数，默认 0（如果未传则从 groupInfo.reqScore 获取）
  
  说明：
  - 显示格式：当前分数/所需分数（如：100/200）
  - 进度条会根据 curScore/reqScore 的比例自动计算宽度
  - 当 curScore >= reqScore 时，显示 reqScore/reqScore
  - 自动监听窗口大小变化，重新计算进度条宽度
-->

<template>
  <div class="progress-wrap">
    <div class="progress" ref="progressRef">
      <div class="progress-inner" ref="progressInnerRef">
        <div
          class="act"
          :style="{
            width: barHeight,
          }"
        ></div>
        <div class="score fc">
          <Outline
            :color="'0.05rem #940E0E'"
            :text="curScore >= reqScore ? reqScore : curScore"
            noColor
          />
          <Outline :color="'0.05rem #940E0E'" :text="'/' + reqScore" noColor />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="progress">
import { inject, ref, computed, onMounted, onUnmounted } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT } = fnGetInjectInfo();

const TOOL_NUM = (num: number | string | undefined) =>
  num?.toLocaleString?.() ?? num ?? "--";
const groupInfo: any = inject("groupInfo", {
  curScore: 0,
  reqScore: 0,
});

const props = defineProps({
  curScore: {
    type: Number,
    default: 0,
  },
  reqScore: {
    type: Number,
    default: 0,
  },
});
const progressRef: any = ref();
const progressInnerRef: any = ref();

// 存储 progress-inner 的宽度（rem）
const progressInnerWidth = ref(5.19); // 默认值，防止初始化时出错

// 获取 progress-inner 的宽度（rem）
const getProgressInnerWidth = () => {
  if (progressInnerRef.value) {
    const widthPx = progressInnerRef.value.offsetWidth;
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const widthRem = widthPx / rootFontSize;
    progressInnerWidth.value = widthRem;
  }
};

const barHeight = computed(() => {
  if (reqScore.value === 0) return "0rem";
  return (curScore.value / reqScore.value) * progressInnerWidth.value + "rem";
});

const curScore = computed(() => props.curScore || groupInfo.curScore);
const reqScore = computed(() => props.reqScore || groupInfo.reqScore);

onMounted(() => {
  getProgressInnerWidth();
  // 监听窗口大小变化，重新计算宽度
  window.addEventListener("resize", getProgressInnerWidth);
});

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener("resize", getProgressInnerWidth);
});
</script>

<style lang="scss" scoped>
@use "../static/mixin.scss" as *;

.progress-wrap {
  width: 5.25rem;
  z-index: 10;

  margin-top: 0.09rem;
  margin-bottom: 0.26rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .progress {
    width: 5.25rem;
    height: 0.28rem;
    @include bg("p3-progress-bg");

    position: relative;
    display: flex;
    align-items: center;

    .progress-inner {
      width: 5.19rem;
      height: 0.22rem;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      border-radius: 0.8rem;

      margin: 0 auto;

      direction: rtl;

      .act {
        height: 0.22rem;
        border-radius: 0.8rem;
        background: linear-gradient(
          90deg,
          #fed96b 0%,
          #e97632 18.31%,
          #b517a9 86.06%
        );
        z-index: 1;
      }
    }

    .score {
      height: 0.34rem;
      position: absolute;
      top: -0.05rem;
      right: 0.12rem;
      z-index: 3;
      direction: ltr;

      span {
        color: #f9ffc8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.34rem; /* 154.545% */
      }
    }
  }
}
</style>
