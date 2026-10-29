<template>
  <div
    class="stage-rank-buttons-wrap scrollX"
    ref="scrollRef"
    :class="TOOL_countryCode"
  >
    <div class="line-bg" :class="TOOL_countryCode">
      <div
        class="line-bg-inner"
        :style="{ width: `${(currentStage - 1) * 1.76}rem` }"
      ></div>
      <img :src="`${ossUrl}/m-g-p-bg.png`" alt="" class="bg" />
    </div>
    <div class="stage-rank-buttons" :style="{ width: containerWidth }">
      <div
        v-for="(item, index) in stageList"
        :key="index"
        ref="listItemRef"
        class="stage-button-wrapper"
      >
        <div
          class="stage-button"
          :class="[
            getStageClass(index),
            {
              'stage-done': currentStage - 1 >= index,
              'stage-ing': selStage - 1 == index,
            },
          ]"
          @click="handleStageClick(index)"
        >
          <!-- 标题 -->
          <div class="stage-title fc">
            <Outline
              :color="getTitleColor(index)"
              :text="item.title || `Stage ${item.stage}`"
              noColor
            />
          </div>

          <!-- <div v-if="index > 0" class="connector-line" :class="getConnectorClass(index)"></div> -->
          <!-- 徽章容器 -->
          <!-- 徽章背景 -->
          <div class="badge-bg fc">
            <img
              class="badge-img"
              :src="`${ossUrl}/${
                selStage - 1 == index
                  ? 'm-g-stage-act'
                  : currentStage - 1 >= index
                  ? 'm-g-stage'
                  : 'm-g-stage--1'
              }.png`"
              alt=""
            />
          </div>

          <!-- 底部信息 -->
          <div class="stage-info f-column">
            <div class="info-line" :class="getInfoClass(index)">
              {{ item.text1 || "" }}
            </div>
            <div
              class="info-line"
              :class="getInfoClass(index)"
              style="margin-top: 0.04rem"
            >
              {{ removeSpace(item.text2 || "") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="StageRankButtons">
import { ref, computed, nextTick, onMounted, watch, inject } from "vue";
import injectTool from "@publicComponents/injectTool";

const ossUrl = inject("ossUrl");
const { TOOL_TEXT, TOOL_toast, TOOL_countryCode } = injectTool();

interface StageItem {
  stage: number; // 阶段编号
  text1?: string; // 第一行文本
  text2?: string; // 第二行文本
  title?: string; // 可选标题，如果没有则使用 "Stage {stage}"
}

// 使用 defineModel 支持 v-model:selStage
const selStage = defineModel<number>("selStage", { required: true });

const props = withDefaults(
  defineProps<{
    currentStage: number; // 当前激活的阶段编号（从1开始）
    stageList?: StageItem[]; // 阶段列表数据
  }>(),
  {}
);

// 去除字符串的空格
const removeSpace = (str: string) => {
  return str.replace(/\s/g, "");
};

const scrollRef = ref(null);
const listItemRef = ref(null);

// 计算容器宽度：(length - 1) * 1.72 rem
const containerWidth = computed(() => {
  if (!props.stageList || props.stageList.length === 0) {
    return "8.6rem";
  }
  return `${(props.stageList.length - 1) * 1.72}rem`;
});

// 获取阶段状态: 'completed' | 'active' | 'inactive'
const getStageStatus = (index: number): "completed" | "active" | "inactive" => {
  const currentStageIndex = props.currentStage - 1; // 转换为数组索引（0-based）
  if (index < currentStageIndex) {
    return "completed"; // 小于当前等级（已完成）
  } else if (index === currentStageIndex) {
    return "active"; // 当前激活等级
  } else {
    return "inactive"; // 未激活等级
  }
};

// 获取阶段按钮的class
const getStageClass = (index: number): string => {
  const status = getStageStatus(index);
  return `stage-${status}`;
};

// 获取标题颜色
const getTitleColor = (index: number): string => {
  const status = getStageStatus(index);
  if (status === "active" || status === "completed") {
    return "0.05rem #FFA500"; // 激活和已完成状态使用橙色
  }
  return "0.05rem #B8860B"; // 未激活状态使用暗金色
};

// 获取信息文本class
const getInfoClass = (index: number): string => {
  const status = getStageStatus(index);
  if (status === "active" || status === "completed") {
    return "info-active";
  }
  return "info-inactive";
};

// 内部实现的滚动函数
const scrollFn = (
  scrollContainer: HTMLElement,
  listItems: HTMLElement[],
  direction: "x" | "y",
  list: any[],
  targetIndex: number
) => {
  if (!scrollContainer || !listItems || !listItems[targetIndex]) {
    return;
  }

  const targetElement = listItems[targetIndex];
  const containerRect = scrollContainer.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  if (direction === "x") {
    // 水平滚动：计算目标元素相对于容器的位置
    const scrollLeft = scrollContainer.scrollLeft;
    const targetLeft = targetRect.left - containerRect.left + scrollLeft;
    const containerWidth = scrollContainer.clientWidth;
    const targetWidth = targetRect.width;

    // 计算滚动位置，使目标元素居中
    const scrollTo = targetLeft - containerWidth / 2 + targetWidth / 2;

    scrollContainer.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  } else {
    // 垂直滚动
    const scrollTop = scrollContainer.scrollTop;
    const targetTop = targetRect.top - containerRect.top + scrollTop;
    const containerHeight = scrollContainer.clientHeight;
    const targetHeight = targetRect.height;

    const scrollTo = targetTop - containerHeight / 2 + targetHeight / 2;

    scrollContainer.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  }
};

// 滚动到指定阶段
const scrollToStage = (stageIndex: number) => {
  if (!scrollRef.value || !listItemRef.value || !props.stageList) {
    return;
  }

  // stageIndex 是从 1 开始的阶段编号，需要转换为数组索引（0-based）
  const arrayIndex = stageIndex - 1;

  // 确保索引在有效范围内
  const validIndex = Math.max(
    0,
    Math.min(arrayIndex, props.stageList.length - 1)
  );

  scrollFn(
    scrollRef.value,
    listItemRef.value,
    "x",
    (props.stageList || []) as any[],
    validIndex
  );

  // 如果是最后一个阶段，确保滚动到最右边（LTR）或最左边（RTL）
  if (validIndex === props.stageList.length - 1) {
    nextTick(() => {
      if (scrollRef.value) {
        const maxScrollLeft =
          scrollRef.value.scrollWidth - scrollRef.value.clientWidth;
        // EG 国家代码使用 RTL 方向，滚动方向相反
        if (TOOL_countryCode === "EG") {
          // RTL 模式下，scrollLeft 为负值表示向左滚动（向结束位置）
          // 滚动到最后一个元素需要使用负的最大值
          scrollRef.value.scrollLeft = -maxScrollLeft;
        } else {
          // LTR 模式下，scrollLeft = maxScrollLeft 表示滚动到最右边
          scrollRef.value.scrollLeft = maxScrollLeft;
        }
      }
    });
  }
};

// 处理阶段点击
const handleStageClick = (index: number) => {
  // 如果点击的阶段索引小于等于当前阶段，可以选中
  if (index <= props.currentStage - 1) {
    selStage.value = index + 1;
    // 点击后自动滚动到中间
    nextTick(() => {
      scrollToStage(index + 1);
    });
  } else {
    // 大于当前阶段，提示未开始
    TOOL_toast({ text: TOOL_TEXT[608] });
  }
};

// 根据初始值滚动到对应阶段
onMounted(() => {
  nextTick(() => {
    scrollToStage(props.currentStage);
  });
});

// 监听 currentStage 变化，自动滚动到对应阶段
watch(
  () => props.currentStage,
  (newStage) => {
    nextTick(() => {
      scrollToStage(newStage);
    });
  }
);
</script>

<style lang="scss" scoped>
.stage-rank-buttons-wrap {
  width: 7.5rem;
  padding: 0 0.24rem;
  margin-top: 0.36rem;
  margin-bottom: 0.28rem;
  position: relative;
  z-index: 1;
  &.TR {
    width: 5.5rem;
    margin: 0 auto;
    margin-top: 0.36rem;
    margin-bottom: 0.28rem;

    .line-bg {
      width: 4rem;
    }
  }

  &.IN,
  &.PK,
  &.ID {
    width: 7.5rem;

    .line-bg {
      width: 5rem;
    }
  }

  .line-bg {
    width: 7.36rem;
    height: 0.16rem;
    flex-shrink: 0;
    position: absolute;
    top: 1.25rem;
    left: 0.9rem;
    .line-bg-inner {
      height: 0.14rem;
      border-radius: 0.1rem;
      background: linear-gradient(
        180deg,
        #fbf6bb 0%,
        #e6c251 25.48%,
        #e96f00 95.67%
      );

      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      z-index: 1;
    }
    .bg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &.EG {
      left: unset;
      right: 0.9rem;
      // 水平翻转
      transform: scaleX(-1);

      .line-bg-inner {
        right: unset;
        left: 0;
      }
    }
  }
}

.stage-rank-buttons {
  display: flex;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.stage-button-wrapper {
  flex-shrink: 0;
  position: relative;
}

.stage-button {
  width: 1.72rem;
  min-height: 2.4rem;
  position: relative;
  align-items: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &.stage-ing {
    .stage-title {
      span {
        color: #ffcf68;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.32rem; /* 114.286% */
      }
    }

    .stage-info {
      .info-line {
        color: #ffcf68;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 100% */
      }
    }
    .badge-bg {
      width: 1.2rem;
      height: 1.06rem;
      margin-bottom: 0.15rem;
      margin-top: -0.05rem;

      .badge-img {
        width: 1.2rem;
        height: 1.06rem;
        object-fit: contain;
      }
    }
  }

  .stage-title {
    width: 1.7rem;
    height: 0.64rem;
    text-align: center;
    margin-bottom: 0.08rem;

    span {
      color: #c25c45;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.32rem; /* 133.333% */
    }
  }

  .badge-bg {
    width: 1.2rem;
    height: 1.06rem;
    margin-bottom: 0.02rem;

    .badge-img {
      width: 0.96rem;
      height: 0.85rem;
      object-fit: contain;
    }
  }

  .stage-info {
    width: 1.76rem;
    margin: 0 auto;

    .info-line {
      color: #c25c45;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.24rem; /* 100% */
    }
  }
}
</style>
