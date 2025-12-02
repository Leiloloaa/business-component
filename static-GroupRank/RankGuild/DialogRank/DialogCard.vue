<template>
  <!-- info.idx 从 1 开始 -->
  <OssImg :src="`m-g-d-card`" class="d-card">
    <Space :val="0.24" :h="0" />
    <div class="num">{{ info.idx }}</div>
    <Space :val="0.16" :h="0" />
    <OptA
      :data="info || {}"
      :option="{
        styles: css`
          width: 0.88rem;
          height: 0.8448rem;
        `,
        adorns: [
          {
            img: 'm-a',
            styles: css`
              width: 0.88rem;
              height: 0.8448rem;
            `
          }
        ],
        avatar: css`
          width: 0.7568rem;
          height: 0.7568rem;
          border-radius: 50%;
        `,
        live: `width: 0.41rem; height: 0.24rem; bottom: 0rem`,
        liveIcon: `width: 0.18rem;`
      }"
    />
    <Space :val="0.16" :h="0" />
    <div class="name ov">{{ info.name }}</div>
    <Space :val="0.35" :h="0" />
    <OssImg src="m-score" class="score">{{ TOOL_NUM(info.score) }}</OssImg>
  </OssImg>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css } from '../../tool'
import OptA from '../../OptA.vue'

const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    type?: number // card 类型，不同背景
  }>(),
  { isUser: false }
)

const { TOOL_NUM } = injectTool()
</script>

<style lang="scss" scoped>
.d-card {
  width: 5.9rem;
  height: 1.2rem;
  flex-shrink: 0;

  margin: 0 auto;
  margin-bottom: 0.08rem;
  position: relative;

  display: flex;
  align-items: center;

  .num {
    width: 0.36rem;
    height: 0.36rem;
    color: #fff0cc;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.36rem; /* 128.571% */
  }

  .name {
    width: 1.85rem;
    height: 0.32rem;
    color: #fff0cc;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 133.333% */
  }

  .score {
    width: 1.76rem;
    height: 0.4rem;
    flex-shrink: 0;

    color: #fff0cc;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.4rem; /* 133.333% */
  }
}
</style>
