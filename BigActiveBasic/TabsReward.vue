<template>
  <div class="tabs-component-wrap scrollX" ref="scrollRef">
    <div class="tabs-component">
      <div
        v-for="(item, index) in tabList"
        :key="'reward-tab' + item.id"
        ref="listItemRef"
        class="tab fc"
        :class="`${actTab == index ? 'act' : ''} tab${index}`"
        @click="switchTab(index)"
        v-bg="`${actTab == index ? 'm-reward-act' : 'm-reward'}`"
        v-show="!hideTabIndex.includes(index)"
      >
        <Outline
          :color="actTab == index ? `0.05rem #C40789` : `0.05rem #8c0023`"
          :text="item.text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="tabsRank">
import injectTool from '@publicComponents/injectTool'
import { scrollFn, normalToWithText } from '../../tools/tools.js'
import { useRoute, useRouter } from 'vue-router'
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const ossUrl = inject('ossUrl')
const activityId = inject('activityId')
const { TOOL_TEXT, TOOL_BPFunc } = injectTool()

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  text: {
    type: Array,
    default: [6, 11, 7, 10, 9]
  },
  hideIndex: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

const tabList = computed(() => normalToWithText(TOOL_TEXT, props.text))

const scrollRef = ref(null)
const listItemRef = ref(null)
const scrollFnIndex = (index, type = '') => {
  scrollFn(scrollRef.value, listItemRef.value, `x${type}`, tabList.value, index)
}

const actTab = ref(props.modelValue)
const switchTab = (index) => {
  TOOL_BPFunc({ desc: `reward_page_tab${index + 1}_click`, action: 'click' }) //固定不变，勿删
  actTab.value = index
  emit('update:modelValue', index)
  scrollFnIndex(index)
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal != actTab.value) {
      actTab.value = newVal
      nextTick(() => {
        const tabListLength = tabList.value.length
        scrollFnIndex(newVal, newVal == 0 || newVal == tabListLength - 1 ? 'half' : 'whole')
      })
    }
  }
)

const hideTabIndex: any = computed(() => props.hideIndex) // 通过 index 过滤 Tab，由父级按配置传入

onMounted(() => {
  const tabIndex = tabList.value.findIndex((item, index) => actTab.value == index)
  const tabListLength = tabList.value.length
  scrollFnIndex(tabIndex == 0 ? 1 : tabIndex == tabListLength - 1 ? tabListLength - 2 : tabIndex)
})
</script>

<style lang="scss" scoped>
.tabs-component-wrap {
  width: 7.5rem;
  margin-top: 0.2rem;

  position: relative;
  z-index: 10;

  .tabs-component {
    width: fit-content;
    margin: 0 auto;

    display: flex;
    position: relative;
    z-index: 1;

    gap: 0.12rem;

    .tab {
      width: 2.2rem;
      height: 0.88rem;

      display: flex;
      justify-content: center;
      align-items: center;

      position: relative;
      z-index: 1;

      span {
        width: 80%;

        color: #ff7375;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #8c0023;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.24rem; /* 107.692% */

        position: absolute;
        z-index: 1;
      }

      &.act {
        span {
          color: #ffeefe;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #c40789;
          font-family: 'SF UI Text';
          font-size: 0.26rem;
          font-style: normal;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
