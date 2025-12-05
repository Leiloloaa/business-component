<!--
  使用示例：
  <RouterTab
    :tabs="[
      { text: 52, routerName: 'goldSplitPage' },
      { text: 53, routerName: 'annualTreasurePage' },
      { text: 54, routerName: 'rankGamePage' }
    ]"
  />
  
  Props:
  - tabs: TabItem[] - tab 列表
    - text: number | string - tab 文本，默认传数字（从 TOOL_TEXT 中获取对应文本），也可传字符串
    - routerName: string - 路由名称，用于跳转和判断激活状态
-->

<template>
  <div class="tabs-component-wrap" ref="scrollContainerRef">
    <div
      class="tabs-component"
      :class="{ center: !needsScroll }"
      ref="tabsComponentRef"
    >
      <div v-for="(item, index) in processedTabs" :key="index">
        <div
          class="tab fc"
          :class="`${isActive(item.routerName) ? 'act' : ''} tab${index}`"
          @click="switchTab(item.routerName)"
          v-show="!hideTabIndex.includes(index)"
          :ref="(el) => setTabRef(el, index)"
        >
          <img
            class="obg"
            :src="`${ossUrl}/${
              isActive(item.routerName) ? 'sub-tab-act' : 'sub-tab'
            }.png`"
          />
          <Outline
            :color="
              isActive(item.routerName) ? `0.05rem #650000` : `0.05rem #6F330D`
            "
            :text="item.text"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="TabRouter">
import { ref, computed, watch, nextTick, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import injectTool from "@publicComponents/injectTool";

const route = useRoute();
const router = useRouter();
const ossUrl = inject<string>("ossUrl");
const { TOOL_TEXT, TOOL_countryCode, TOOL_BPFunc } = injectTool();

interface TabItem {
  text: string | number;
  routerName: string;
}

const props = defineProps<{
  tabs: TabItem[];
}>();

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null);
// tab 组件引用
const tabsComponentRef = ref<HTMLElement | null>(null);
// tab 元素引用
const tabRefs = ref<Map<number, HTMLElement>>(new Map());
// 是否需要滚动
const needsScroll = ref(false);

// 设置 tab ref
const setTabRef = (el: any, index: number) => {
  if (el) {
    tabRefs.value.set(index, el);
  }
};

// 检测是否需要滚动
const checkScrollNeeded = () => {
  if (!scrollContainerRef.value || !tabsComponentRef.value) return;

  const containerWidth = scrollContainerRef.value.clientWidth;
  const contentWidth = tabsComponentRef.value.scrollWidth;
  needsScroll.value = contentWidth > containerWidth;
};

// 处理 text 显示：如果是数字，从 TOOL_TEXT 中获取；如果是字符串，直接使用
const getDisplayText = (text: string | number) => {
  if (typeof text === "number") {
    return TOOL_TEXT[text] || "";
  }
  return text;
};

// 处理后的 tab 列表
const processedTabs = computed(() => {
  return props.tabs.map((item) => ({
    ...item,
    text: getDisplayText(item.text),
  }));
});

// 判断当前路由是否激活
const isActive = (routerName: string) => {
  return route.name === routerName;
};

// 滚动到激活的 tab，使其居中
const scrollToActiveTab = () => {
  if (!scrollContainerRef.value) return;

  const container = scrollContainerRef.value;
  // 找到激活的 tab 索引（processedTabs 的索引和原始索引一致）
  const activeIndex = processedTabs.value.findIndex(
    (item, index) =>
      isActive(item.routerName) && !hideTabIndex.value.includes(index)
  );

  if (activeIndex === -1) return;

  const activeTab = tabRefs.value.get(activeIndex);
  if (!activeTab) return;

  // 计算需要滚动的距离，使激活的 tab 居中
  const containerWidth = container.clientWidth;
  const tabLeft = activeTab.offsetLeft;
  const tabWidth = activeTab.offsetWidth;
  const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

  // 平滑滚动
  container.scrollTo({
    left: scrollLeft,
    behavior: "smooth",
  });
};

// 切换标签页
const switchTab = (routerName: string) => {
  // 如果点击的是当前路由，不执行跳转
  if (route.name === routerName) {
    return;
  }

  // 使用 replace 跳转到对应路由
  router.replace({ name: routerName }).catch((err) => {
    console.warn(`路由 ${routerName} 跳转失败:`, err);
  });
};

const hideTabIndex: any = computed(() =>
  ["EG"].includes(TOOL_countryCode) ? [] : []
); // 通过index过滤Tab

// 监听路由变化，自动滚动到激活的 tab
watch(
  () => route.name,
  () => {
    nextTick(() => {
      checkScrollNeeded();
      if (needsScroll.value) {
        scrollToActiveTab();
      }
    });
  },
  { immediate: true }
);

// 监听 tab 列表变化，检测是否需要滚动
watch(
  () => [processedTabs.value, hideTabIndex.value],
  () => {
    nextTick(() => {
      checkScrollNeeded();
      if (needsScroll.value) {
        scrollToActiveTab();
      }
    });
  },
  { deep: true }
);

// 组件挂载后也执行一次居中
onMounted(() => {
  nextTick(() => {
    checkScrollNeeded();
    if (needsScroll.value) {
      scrollToActiveTab();
    }
  });
});
</script>

<style lang="scss" scoped>
.tabs-component-wrap {
  width: 7.5rem;
  margin: 0 auto;
  margin-top: 0.16rem;
  margin-bottom: 0.1rem;

  position: relative;
  z-index: 10;

  // 横向滚动
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; // Firefox 隐藏滚动条
  -ms-overflow-style: none; // IE 隐藏滚动条

  // Chrome/Safari 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  .tabs-component {
    width: fit-content;
    display: flex;
    position: relative;
    z-index: 1;
    gap: 0.08rem;

    // 当不需要滚动时，居中显示
    &.center {
      margin: 0 auto;
    }

    // 当需要滚动时，保持左对齐
    &:not(.center) {
      min-width: 100%;
    }

    .tab {
      width: 2.26rem;
      height: 0.8rem;
      flex-shrink: 0;

      display: flex;
      justify-content: center;
      align-items: center;

      position: relative;
      z-index: 1;

      span {
        width: 2rem;

        color: #e88e51;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #6f330d;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.3rem; /* 115.385% */

        position: relative;
        z-index: 1;
      }

      &.act {
        span {
          color: #fff9de;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #650000;
          font-family: "SF UI Text";
          font-size: 0.26rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.3rem; /* 115.385% */
        }
      }
    }
  }
}
</style>
