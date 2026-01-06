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
    <div class="progress" ref="progressRef" v-bg="`g-progress-bg`">
      <div class="progress-inner" ref="progressInnerRef">
        <div
          class="act"
          v-EG.self
          :style="{
            width: barHeight,
          }"
        ></div>
        <div class="score fc">
          <div style="direction: ltr">
            <Outline
              style="color: #e5ff1d"
              :color="'0.05rem #940E0E'"
              :text="TOOL_NUM(curScore >= reqScore ? reqScore : curScore)"
            />
            <Outline
              :color="'0.05rem #940E0E'"
              :text="'/' + TOOL_NUM(reqScore)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="progress">
import { inject, ref, computed, onMounted, onUnmounted } from "vue";
import injectTool from "@publicComponents/injectTool";

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_NUM } = injectTool();
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
const ossUrl = inject("ossUrl");
const progressRef: any = ref();
const progressInnerRef: any = ref();

// 存储 progress-inner 的宽度（rem）
const progressInnerWidth = ref(2); // 默认值，防止初始化时出错

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
.progress-wrap {
  width: 1.92rem;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  .progress {
    width: 1.92rem;
    height: 0.2rem;

    margin-top: 0.15rem;

    position: relative;
    display: flex;
    align-items: center;

    .progress-inner {
      width: 1.9rem;
      height: 0.18rem;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      border-radius: 1rem;

      margin: 0 auto;

      .act {
        height: 0.18rem;
        border-radius: 0.4rem;
        background: linear-gradient(
          180deg,
          #ffb83e 0%,
          #a22613 52.4%,
          #ff472a 100%
        );
        z-index: 1;
      }
    }

    .score {
      width: 100%;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -56%);
      z-index: 3;
      direction: ltr;

      span {
        color: #e5ff1d;
        font-family: "SF UI Text";
        font-size: 0.18rem;
        font-style: normal;
        font-weight: 600;
      }
    }
  }
}
</style>
