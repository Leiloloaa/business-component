<template>
  <div class="tabs-component-wrap scrollX" ref="scrollRef">
    <div class="tabs-component fc">
      <div
        v-for="(item, index) in [602, 603]"
        :key="'tab' + item"
        class="tab fc"
        :class="`${actTab == index ? 'act' : ''} tab${index}`"
        @click="switchTab(index)"
        v-bg="`${actTab == index ? 'm-rule-act' : 'm-rule'}`"
      >
        <Outline
          :color="actTab == index ? '0.05rem #C40789' : '0.05rem #8C0023'"
          :text="TOOL_TEXT[item]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="tabsRank">
import injectTool from '@publicComponents/injectTool'
import { scrollFn, normalToWithText } from '../../tools/tools.js'
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const ossUrl = inject('ossUrl')
const activityId = inject('activityId')
const { TOOL_TEXT, TOOL_countryCode, TOOL_BPFunc } = injectTool()

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  text: {
    type: Array,
    default: [602, 603]
  }
})
const emit = defineEmits(['update:modelValue'])

const tabList = computed(() => normalToWithText(TOOL_TEXT, props.text))

const scrollRef = ref(null)
const listItemRef = ref(null)
const scrollFnIndex = (index) => {
  scrollFn(scrollRef.value, listItemRef.value, 'x', tabList.value, index)
}

const actTab = ref(props.modelValue)
const switchTab = (index) => {
  TOOL_BPFunc({
    desc: `${index == 0 ? 'rule' : 'reward'}_tab_click`,
    action: 'click'
  }) //固定不变，勿删
  actTab.value = index
  emit('update:modelValue', index)
  scrollFnIndex(index)
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal != actTab.value) actTab.value = newVal
  }
)

const hideTabIndex: any = computed(() => (['EG'].includes(TOOL_countryCode) ? [] : [])) // 通过index过滤Tab

onMounted(() => {
  const tabIndex = tabList.value.findIndex((item, index) => actTab.value == index)
  const tabListLength = tabList.value.length
  scrollFnIndex(tabIndex == 0 ? 1 : tabIndex == tabListLength - 1 ? tabListLength - 2 : tabIndex)
})
</script>

<style lang="scss" scoped>
.tabs-component-wrap {
  width: 7.5rem;

  position: relative;
  z-index: 10;

  .tabs-component {
    width: fit-content;
    margin: 0 auto;

    display: flex;
    position: relative;
    z-index: 1;
    gap: 0.4rem;

    .tab {
      width: 2.4rem;
      height: 1.2rem;
      // margin: 0 0.04rem;

      display: flex;
      justify-content: center;
      align-items: center;

      position: relative;
      z-index: 1;

      span {
        width: 2.3rem;

        color: #ff7375;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #8c0023;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.28rem; /* 107.692% */

        position: relative;
        z-index: 2;
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
          line-height: 0.28rem; /* 107.692% */
        }
      }
    }
  }
}
</style>
