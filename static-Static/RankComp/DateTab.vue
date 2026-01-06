<!--
  使用示例：
  <TabDate />  // 使用默认值 [614, 615]
  <TabDate :texts="[614, 615, 616]" />
  <TabDate :texts="['周一', '周二']" />
  <TabDate v-model="dayTotal" />  // 双向绑定当前索引
  
  Props:
  - texts: (number | string)[] - tab 文本数组，默认 [614, 615]
    - 传数字时从 TOOL_TEXT 中获取对应文本
    - 传字符串时直接显示
  - modelValue: number - 当前激活的 tab 索引，支持 v-model
  
  Events:
  - update:modelValue: (index: number) => void - v-model 更新事件
  - change: (index: number) => void - 切换 tab 时触发，返回当前索引
-->

<template>
  <div class="tabs-component-wrap" ref="scrollContainerRef">
    <div
      class="tabs-component"
      :class="{ center: !needsScroll }"
      ref="tabsComponentRef"
      v-bg="`date-tab-bg`"
    >
      <div v-for="(item, index) in processedTabs" :key="index">
        <div
          class="tab fc"
          :class="`${activeIndex === index ? 'act' : ''}`"
          @click="switchTab(index)"
          :ref="(el) => setTabRef(el, index)"
          v-bg="`${activeIndex === index ? 'date-tab-act' : ''}`"
        >
          <Outline
            :color="activeIndex === index ? `0.05rem #FF18A6` : `0.05rem #3B18FF`"
            :text="item"
            noColor
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="TabDate">
import { ref, computed, watch, nextTick, onMounted, inject } from 'vue'
import injectTool from '@publicComponents/injectTool'

const ossUrl = inject<string>('ossUrl')
const { TOOL_TEXT } = injectTool()

const props = withDefaults(
  defineProps<{
    texts?: (number | string)[]
    modelValue?: number
  }>(),
  {
    texts: () => [614, 615],
    modelValue: 0
  }
)

const emit = defineEmits<{
  'update:modelValue': [index: number]
  change: [index: number]
}>()

// 当前激活的 tab 索引（支持 v-model）
const activeIndex = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null)
// tab 组件引用
const tabsComponentRef = ref<HTMLElement | null>(null)
// tab 元素引用
const tabRefs = ref<Map<number, HTMLElement>>(new Map())
// 是否需要滚动
const needsScroll = ref(false)

// 设置 tab ref
const setTabRef = (el: any, index: number) => {
  if (el) {
    tabRefs.value.set(index, el)
  }
}

// 检测是否需要滚动
const checkScrollNeeded = () => {
  if (!scrollContainerRef.value || !tabsComponentRef.value) return

  const containerWidth = scrollContainerRef.value.clientWidth
  const contentWidth = tabsComponentRef.value.scrollWidth
  needsScroll.value = contentWidth > containerWidth
}

// 处理 text 显示：如果是数字，从 TOOL_TEXT 中获取；如果是字符串，直接使用
const getDisplayText = (text: string | number) => {
  if (typeof text === 'number') {
    return TOOL_TEXT[text] || ''
  }
  return text
}

// 处理后的 tab 列表
const processedTabs = computed(() => {
  return props.texts.map((text) => getDisplayText(text))
})

// 滚动到激活的 tab，使其居中
const scrollToActiveTab = () => {
  if (!scrollContainerRef.value) return

  const container = scrollContainerRef.value
  const activeTab = tabRefs.value.get(activeIndex.value)
  if (!activeTab) return

  // 计算需要滚动的距离，使激活的 tab 居中
  const containerWidth = container.clientWidth
  const tabLeft = activeTab.offsetLeft
  const tabWidth = activeTab.offsetWidth
  const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2

  // 平滑滚动
  container.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  })
}

// 切换标签页
const switchTab = (index: number) => {
  if (activeIndex.value === index) return

  emit('update:modelValue', index)
  emit('change', index)
}

// 监听 modelValue 变化，自动滚动到激活的 tab
watch(
  () => props.modelValue,
  () => {
    nextTick(() => {
      checkScrollNeeded()
      if (needsScroll.value) {
        scrollToActiveTab()
      }
    })
  },
  { immediate: true }
)

// 监听 texts 变化
watch(
  () => props.texts,
  () => {
    nextTick(() => {
      checkScrollNeeded()
      if (needsScroll.value) {
        scrollToActiveTab()
      }
    })
  },
  { deep: true }
)

// 组件挂载后也执行一次
onMounted(() => {
  nextTick(() => {
    checkScrollNeeded()
    if (needsScroll.value) {
      scrollToActiveTab()
    }
  })
})

// 暴露方法供父组件调用
defineExpose({
  activeIndex,
  switchTab
})
</script>

<style lang="scss" scoped>
.tabs-component-wrap {
  width: 7.5rem;
  margin: 0 auto;
  margin-top: 0.24rem;
  margin-bottom: 0.32rem;

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
    width: 4.8rem;
    height: 0.72rem;
    position: relative;
    z-index: 1;

    display: flex;

    // 当不需要滚动时，居中显示
    &.center {
      margin: 0 auto;
    }

    // 当需要滚动时，保持左对齐
    &:not(.center) {
      min-width: 100%;
    }

    .tab {
      width: 2.4rem;
      height: 0.72rem; // 与父容器高度一致
      flex-shrink: 0; // 防止被压缩
      position: relative;
      cursor: pointer;

      // 居中文字
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        position: relative;
        z-index: 1;

        color: #80a8ff;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem; /* 107.692% */
      }

      &.act {
        span {
          color: #fcffff;
        }
      }
    }
  }
}
</style>
