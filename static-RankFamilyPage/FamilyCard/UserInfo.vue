<template>
  <div class="info fc" :class="{ 'card-user': isCardStyle, 'normal-user': !isCardStyle }">
    <Card :info="{ ...info, idx: info.rank }" isUser v-if="isCardStyle" />
    <div class="cards" v-else>
      <Space :val="0.24" />
      <div class="num fc">
        <span>{{ info.rank }}</span>
      </div>
      <Space :val="0.24" />
      <OptA :data="info || {}" :option="option" />
      <Space :val="0.24" />

      <!-- 没有荣誉勋章的情况 -->
      <div class="name ov">{{ info.name || '---' }}</div>
      <div class="score">
        {{ TOOL_NUM(info.score) || '---' }}
      </div>

      <!-- 有荣誉勋章的情况 -->
      <!-- <div :style="{ marginTop: info.selDate != 999 && Number(info.idx) <= 3 ? '0.42rem' : '0.24rem' }">
      <div class="fc">
        <div class="name ov">{{ info.name || '---' }}</div>
        <div class="score">
          {{ TOOL_NUM(info.score) || '---' }}
        </div>
      </div>

      <div class="honor-bg fc">
        <Honor :data="info" />
      </div>
      </div> -->

      <!-- 层叠头像组件 -->
      <!-- <div class="superpose-avatar">
      <SuperposeAvatar :overlap="0.16">
        <div class="avatar-wrap" v-for="tp in 3">
          <cdnImg class="avatar" :fid="info?.top3[tp - 1] || ''"></cdnImg>
        </div>
      </SuperposeAvatar>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup name="userInfo">
import injectTool from '@publicComponents/injectTool'
import Card from './Card.vue'
import { css } from "@publicComponents/shared";

const { TOOL_countryCode, TOOL_NUM } = injectTool()
const imgUrl = inject('imgUrl')

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
    width: 0.88rem;
    height: 0.88rem;
  `,
  adorns: [
    {
      img: 'a',
      styles: css`
        width: 100%;
        height: 100%;
        z-index: -1;
      `
    }
  ],
  avatar: css`
    width: 0.84rem;
    height: 0.84rem;
  `,
  live: css`
    bottom: 0;
    width: 0.8rem;
    height: 0.28rem;
  `,
  liveIcon: css`
    width: 0.29rem;
  `
}
</script>

<style lang="scss" scoped>
.info {
  width: 7.5rem;
  height: 1.82rem;

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
}
</style>
