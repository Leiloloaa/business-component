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
          :color="'0.05rem #ff2ced'"
          :text="(info.list[item] && info.list[item].name) || '--'"
        />

        <!-- 荣誉组件 -->
        <!-- <div class="honor-wrap fc">
          <Honor :data="info.list[item] || {}" top3 />
        </div> -->

        <OssImg :src="'score'" class="score ov">
          {{ (info.list[item] && TOOL_NUM(info.list[item].score)) || '---' }}
        </OssImg>

        <!-- 新人或回流标识 -->
        <div
          class="new-or-back fc"
          v-if="
            (info.list[item] &&
              (info.list[item].isNewUser || info.list[item].isReturnUser) &&
              showNewOrBack) ||
            ENV == 'develop'
          "
        >
          <img :src="`${ossUrl}/${info.list?.[item]?.isNewUser ? 'n1' : 'n1'}.png`" />
          <NoticeBar :w="1.3" :h="0.32">
            <span style="min-width: 1.3rem">{{
              TOOL_TEXT[info?.list?.[item]?.isNewUser ? 107 : 107]
            }}</span>
          </NoticeBar>
        </div>

        <!-- 层叠头像组件 -->
        <!-- <div class="superpose-avatar">
          <SuperposeAvatar :overlap="0.16">
            <div class="avatar-wrap" v-for="tp in 3">
              <cdnImg class="avatar" :fid="info?.list?.[item].top3?.[tp - 1] || ''"></cdnImg>
            </div>
          </SuperposeAvatar>
        </div> -->
      </div>

      <!-- 第一名和二三名的间距 -->
      <Space :val="0.24" v-if="item !== 2" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import { cssFormat } from "@publicComponents/shared";

const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()

const props = withDefaults(defineProps<{ info: any }>(), {})

const showNewOrBack = 0 // 是否显示新人或回流标识？

const optionList = {
  0: {
    styles: cssFormat`
      width: 2.26rem;
      height: 2.28rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: 'a1',
        styles: cssFormat`
          width: 2.26rem;
          height: 2.28rem;
          flex-shrink: 0;
        `
      }
    ],
    avatar: cssFormat`
      width: 1.6rem;
      height: 1.6rem;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `
  },
  1: {
    styles: cssFormat`
      width: 1.9775rem;
      height: 1.995rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: 'a2',
        styles: cssFormat`
          width: 1.9775rem;
          height: 1.995rem;
          flex-shrink: 0;
        `
      }
    ],
    avatar: cssFormat`
      width: 1.4rem;
      height: 1.4rem;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `
  },
  2: {
    styles: cssFormat`
      width: 1.9775rem;
      height: 1.995rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: 'a3',
        styles: cssFormat`
          width: 1.9775rem;
          height: 1.995rem;
          flex-shrink: 0;
        `
      }
    ],
    avatar: cssFormat`
      width: 1.4rem;
      height: 1.4rem;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `
  }
}
</script>

<style lang="scss" scoped>
// top3 的起始位置由 top1 头像的位置决定
.top-three {
  width: 7.5rem;
  margin: 0 auto;
  margin-top: 1.96rem;
  margin-bottom: 0.38rem;

  display: flex;
  justify-content: center;
  position: relative;

  .top3-bg {
    width: 7.5rem;
    height: 8.77rem;
    flex-shrink: 0;

    position: absolute;
    top: -2.6rem;
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

      color: #fff;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */

      text-align: center;

      position: relative;
      z-index: 5;
    }

    .score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;

      margin-top: 0.1rem;

      color: #fff0cc;
      text-align: center;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */

      text-align: center;
      line-height: 0.48rem !important;
    }

    .new-or-back {
      width: 1.3rem;
      height: 0.32rem;
      flex-shrink: 0;
      position: relative;
      margin-top: 0.08rem;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      span {
        position: relative;
        z-index: 2;
        color: #ffe89a;
        text-align: center;
        font-family: Arial;
        font-size: 0.18rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem; /* 155.556% */
      }
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
    margin-top: 2rem;

    .stamp {
      right: -0.07rem;
    }
  }
}
</style>
