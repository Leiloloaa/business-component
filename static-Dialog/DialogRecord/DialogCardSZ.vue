<template>
  <!-- info.idx 从 1 开始 -->
  <div class="cards" v-bg="`d-card`">
    <Space :val="0.26" />
    <div class="timer fc">
      <span>{{ dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
    </div>
    <Space :val="0.45" />
    <img :src="`${ossUrl}/p2-lv${info.type + 1}-act.png`" alt="" class="box" />
    <Space :val="0.66" :h="0" />
    <div class="rew fc">
      <cdnImg :info="info?.packageSpecificRewards?.[0]"></cdnImg>
      <Space :val="0.08" :h="0" />
      <span>{{ getRew(info?.packageSpecificRewards?.[0])?.num }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import dayjs from 'dayjs'
import { css } from '@publicComponents/shared'

const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    type?: number // card 类型，不同背景
  }>(),
  {}
)

const { TOOL_countryCode, TOOL_NUM } = injectTool()
const ossUrl = inject('ossUrl')
const getRew = inject('getRew')
</script>

<style lang="scss" scoped>
.cards {
  width: 5.36rem;
  height: 1.2rem;

  display: flex;
  align-items: center;

  margin: 0 auto;
  margin-bottom: 0.08rem;
  position: relative;
  .timer {
    span {
      width: 1.5rem;
      color: #fff0cc;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 300;
      line-height: 0.26rem; /* 108.333% */
    }
  }
  .box {
    width: 0.88rem;
    height: 0.88rem;
    object-fit: contain;
  }
  .rew {
    img {
      width: 0.48rem;
      height: 0.48rem;
      object-fit: contain;
    }
    span {
      color: #fff0cc;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 300;
      line-height: 0.4rem; /* 166.667% */
    }
  }
}
</style>
