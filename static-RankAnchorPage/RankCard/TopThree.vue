<template>
  <!-- 前三名 -->
  <div class="top-three" :class="TOOL_countryCode">
    <img :src="`${ossUrl}/top3-bg${TOOL_countryCode == 'EG' ? '' : ''}.png`" class="top3-bg" />
    <template v-for="item in [1, 0, 2]" :key="'top' + info.idx">
      <div :class="['top-item', `top${item + 1}`]">
        <img
          :src="`${ossUrl}/stamp.png`"
          v-if="info.status == 0 && info.list[item] && info.list[item].stamp"
          class="stamp"
        />
        <OptA :data="info.list?.[item] || {}" :option="optionList[item]" />

        <Outline
          class="name ov"
          :color="'0.05rem #ff3907'"
          :text="(info.list[item] && info.list[item].name) || '--'"
        />

        <!-- 荣誉组件 -->
        <!-- <div class="honor-wrap fc">
          <Honor :data="info.list[item] || {}" top3 />
        </div> -->

        <div v-bg="'score'" class="score">
          {{ (info.list[item] && TOOL_NUM(info.list[item].score)) || '---' }}
        </div>
      </div>

      <!-- 第一名和二三名的间距 -->
      <Space :val="-0.16" v-if="item !== 2" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'

const props = withDefaults(defineProps<{ info: any }>(), {})
const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()

const top1Styles = css`
  width: 2.58125rem;
  height: 2.58125rem;
`
const top1Avatar = css`
  width: 1.8375rem;
  height: 1.8375rem;
`
const top23Styles = css`
  width: 2.13875rem;
  height: 2.13875rem;
`
const top23Avatar = css`
  width: 1.5225rem;
  height: 1.5225rem;
`
const sharedLive = {
  live: css`
    width: 0.41rem;
    height: 0.24rem;
    bottom: 0.2rem;
  `,
  liveIcon: css`
    width: 0.18rem;
  `
}

const optionList = {
  0: {
    styles: top1Styles,
    adorns: [{ img: 'a1', styles: top1Styles }],
    avatar: top1Avatar,
    ...sharedLive
  },
  1: {
    styles: top23Styles,
    adorns: [{ img: 'a2', styles: top23Styles }],
    avatar: top23Avatar,
    ...sharedLive
  },
  2: {
    styles: top23Styles,
    adorns: [{ img: 'a3', styles: top23Styles }],
    avatar: top23Avatar,
    ...sharedLive
  }
}
</script>

<style lang="scss" scoped>
.top-three {
  width: 7.5rem;
  height: 5rem;
  display: flex;
  justify-content: center;

  position: relative;

  .top3-bg {
    width: 6.82rem;
    height: 6.96rem;

    position: absolute;
    top: -1.6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .top-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    .desc {
      position: absolute;
      top: -0.25rem;
      left: 50%;
      transform: translateX(-50%);

      width: 0.8rem;
      height: 0.8rem;
      flex-shrink: 0;
      z-index: 9;
    }

    .stamp {
      width: 1.78rem;
      height: 1.02rem;
      flex-shrink: 0;

      object-fit: contain;

      position: absolute;
      top: 0.11rem;
      right: -0.5rem;
      z-index: 4;

      &.EG {
        left: -0.5rem;
        right: auto;
      }
    }

    .name {
      width: 2.08rem;
      height: 0.34rem;
      flex-shrink: 0;

      color: #fffeec;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #ff3907;
      font-family: 'SF UI Text';
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;

      text-align: center;

      position: relative;
      z-index: 5;
    }

    .score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;

      margin-top: 0.1rem;

      color: #ffeccf;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */

      text-align: center;
      line-height: 0.48rem !important;
    }

  
    .honor-wrap {
      width: 2rem;
      min-height: 0.86rem;
      flex-shrink: 0;
    }
  }

  .top1 {
    z-index: 3;

    .desc {
      right: 0.16rem;
    }

    .stamp {
      // top: 0.28rem;
    }
  }

  .top2,
  .top3 {
    margin-top: 1.5rem;

    .stamp {
      right: -0.07rem;
    }
  }
}
</style>
