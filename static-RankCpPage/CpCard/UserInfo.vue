<template>
  <div v-bg="`info`" class="info fc">
    <Card :info="{ ...info, idx: info.rank }" isUser v-if="info.isOnTheRank" />
    <div class="custom-user fc" v-else>
      <OptA
        :data="info"
        :option="{
          styles: css`
            width: 1.52rem;
            height: 1.52rem;
            aspect-ratio: 1/1;
          `,
          adorns: [
            {
              img: 'a',
              styles: css`
                width: 100%;
                height: 100%;
              `
            }
          ],
          avatar: css`
            width: 1.13493rem;
            height: 1.13493rem;
          `,
          live: css`
            width: 0.41rem;
            height: 0.24rem;
            bottom: 0.2rem;
          `,
          liveIcon: css`
            width: 0.18rem;
          `
        }"
      />
      <Space :val="0.08" :h="0" />
      <div class="tip">{{ TOOL_TEXT[70] }}</div>
      <Space :val="0.2" :h="0" />
      <div class="btn fc" v-bg="`user-btn`" @click="toGiftPanel()">
        <span>{{ TOOL_TEXT[69] }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="userInfo">
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'
import Card from './Card.vue'
import useGiftPanel from '../../../../hooks/useGiftPanel'

const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()

const { toGiftPanel } = useGiftPanel()

defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  isCardStyle: {
    type: Boolean,
    default: false
  }
})

const option = {
  w: 0.88,
  h: 0.88,
  adorns: [
    {
      img: 'a',
      w: '100%',
      h: '100%',
      'z-index': '-1'
    }
  ],
  avatar: {
    w: 0.84,
    h: 0.84
  },
  live: {
    bottom: 0,
    w: 0.8,
    h: 0.28
  },
  liveIcon: {
    w: 0.29
  }
}
</script>

<style lang="scss" scoped>
.info {
  width: 7.5rem;
  height: 1.68rem;

  position: fixed;
  left: 0rem;
  bottom: 0rem;
  z-index: 49;

  :deep(.card) {
    background: none !important;
    margin-bottom: 0rem !important;
    .top-info {
      height: 100%;

      .stamp {
        display: none !important;
      }
    }
  }

  .custom-user {
    width: 100%;
    height: 100%;
    .tip {
      width: 2.82rem;

      color: #ffcc6c;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }

    .btn {
      width: 1.64333rem;
      height: 0.504rem;
      span {
        width: 90%;
        color: #fff9de;
        text-align: center;
        text-shadow: 0 0 10px #ff6200;
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.24rem; /* 100% */
      }
    }
  }
}
</style>
