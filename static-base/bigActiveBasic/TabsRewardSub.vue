<template>
  <div class="sub-tabs-wrap">
    <div class="sub-tabs">
      <img class="sub-tabs-bg" :src="`${ossUrl}/m-reward3-bg.png`" alt="" />
      <img
        class="sub-tabs-act"
        :class="{ right: actTab === 1 }"
        :src="`${ossUrl}/m-reward3-act.png`"
        alt=""
      />
      <div
        v-for="(item, index) in text"
        :key="index"
        class="sub-tab"
        :class="{ act: actTab === index }"
        @click="switchTab(index)"
      >
        <Outline
          :color="actTab === index ? '0.04rem #C40789' : '0.04rem #8C0023'"
          :text="TOOL_TEXT[item]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="TabsRewardSub">
import { ref, watch, inject } from 'vue'
import injectTool from '@publicComponents/injectTool'

const ossUrl = inject('ossUrl')
const { TOOL_TEXT, TOOL_BPFunc } = injectTool()

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  text: {
    type: Array<number>,
    default: () => [6, 147]
  }
})
const emit = defineEmits(['update:modelValue'])

const actTab = ref(props.modelValue)
const switchTab = (index: number) => {
  TOOL_BPFunc({ desc: `reward_sub_tab${index + 1}_click`, action: 'click' })
  actTab.value = index
  emit('update:modelValue', index)
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal != actTab.value) actTab.value = newVal
  }
)
</script>

<style lang="scss" scoped>
.sub-tabs-wrap {
  width: 7.5rem;
  margin-top: 0.16rem;
  margin-bottom: 0.16rem;
  display: flex;
  justify-content: center;

  position: relative;
  z-index: 10;
}

.sub-tabs {
  width: 5rem;
  height: 0.72rem;
  position: relative;
  display: flex;
  align-items: center;
  direction: ltr;

  .sub-tabs-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 0;
  }

  .sub-tabs-act {
    position: absolute;
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    transition: left 0.3s ease;

    &.right {
      left: 50%;
    }
  }

  .sub-tab {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
    cursor: pointer;

    span {
      color: #ff7375;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #8c0023;
      font-family: 'SF UI Text';
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.28rem; /* 107.692% */
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
</style>
