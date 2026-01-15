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
import Card from './Card.vue'
import { css } from '@publicComponents/shared'
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
  styles: css`
    width: 1.55375rem;
    height: 1.5675rem;
    flex-shrink: 0;
  `,
  adorns: [
    {
      img: 'a',
      styles: css`
        width: 1.55375rem;
        height: 1.5675rem;
        flex-shrink: 0;
      `
    }
  ],
  avatar: css`
    width: 1.1rem;
    height: 1.1rem;
  `,
  live: css`
    width: 0.41rem;
    height: 0.24rem;
    bottom: 0.2rem;
  `,
  liveIcon: css`
    width: 0.18rem;
  `
}
</script>

<style lang="scss" scoped>
.info {
  width: 7.5rem;
  height: 1.82rem;

  position: fixed;
  left: 0rem;
  bottom: -0.01rem;
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

  .normal-user {
    &::after {
      z-index: -1;
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
    }

    .cards {
      display: flex;
      align-items: center;
      width: 6.5rem;

      margin: 0 auto;

      position: relative;

      .num {
        width: 0.6rem;
        height: 0.74rem;

        span {
          color: #fff;
          text-align: center;
          font-family: Arial;
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .name {
        width: 2.01rem;
        height: 0.4rem;
        color: #fff;
        font-family: Arial;
        font-size: 0.35rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: center;
        margin-left: 0.2rem;
        margin-right: 0.5rem;
      }

      .score {
        width: 1.72rem;
        height: 0.42rem;
        flex-shrink: 0;

        color: #fff;
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 400;

        // 行高要注意和 height 保持，有时还得 padding-top
        line-height: 0.42rem;

        text-align: center;
      }
    }
  }

  // 用户不在榜单上的样式
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
      line-height: 0.32rem;
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
        line-height: 0.24rem;
      }
    }
  }
}
</style>
