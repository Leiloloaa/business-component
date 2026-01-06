<template>
  <div
    v-bg="isUser ? '' : info.idx <= isTopIndex ? `g-v-card1` : 'g-v-card'"
    :class="[
      'card',
      { top: isTop, isUser: isUser, bInfo: config.showBottomInfo },
      `top${info.idx}`
    ]"
  >
    <div class="top-info" :style="{ height: info.idx >= isTopIndex + 1 && !isUser ? '100%' : '' }">
      <img
        v-if="info?.status == 0 && info?.stamp"
        class="stamp"
        :src="`${ossUrl}/game-stamp.png`"
        v-EG
      />

      <Space :val="0.35" />

      <div class="num fc">
        <img
          v-if="config.showTop3NumIcon && info.idx <= 3"
          :src="`${ossUrl}/g-v-num${info?.idx}.png`"
          alt=""
        />
        <Outline
          v-else
          :color="`0.05rem #DA00B9`"
          :text="info?.idx || info?.rank || '99+'"
          noColor
        />
      </div>

      <Space :val="info.idx <= isTopIndex ? 0.05 : 0.2" />
      <OptA :data="info || {}" :option="option" />
      <Space :val="info.idx <= isTopIndex ? 0.13 : 0.28" />

      <template v-if="info.other">
        <div>
          <Outline class="name ov" :color="'0.05rem #7D2759'" :text="info?.name || '--'" noColor />
          <div v-bg="`g-v-score`" class="score">{{ TOOL_NUM(info?.score) || '--' }}</div>
        </div>
        <Space :val="0.2" />
        <GameTop3 class="honor-game-top3" :gameList="info.other" />
      </template>

      <!-- 有荣誉勋章 -->
      <template v-else>
        <div class="name ov">{{ info?.name || '---' }}</div>
        <Space :val="0.3" />
        <div v-bg="`g-v-score`" class="score">{{ TOOL_NUM(info?.score) || '---' }}</div>
      </template>
    </div>

    <!-- 奖励信息 -->
    <div
      v-bg="`g-v-b-info`"
      class="bottom-info fc"
      v-if="isDaily && !isUser && Number(info?.idx) <= config.bInfoNum"
    >
      <Space :val="0.3" />
      <img :src="`${ossUrl}/g-v-b-icon.png`" class="b-icon shake" />
      <Space :val="0.09" />
      <NoticeBar :w="6" :h="0.8">
        <template v-for="rewardObj in info?.reward">
          <template v-if="info?.idx >= rewardObj?.start && info?.idx <= rewardObj?.end">
            <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
              <Space :val="0.05" />
              <div v-bg="`g-v-b-rew`" class="rew fc">
                <cdnImg :info="gift" />
              </div>
              <Space :val="0.12" />
              <div class="text-wrap">
                <div class="text text-name">{{ getRew(gift)?.name }}</div>
                <div class="text text-days">{{ getRew(gift)?.num }}</div>
              </div>
            </div>
          </template>
        </template>
      </NoticeBar>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css } from "@publicComponents/shared";
import GameTop3 from '../GameTop3.vue'

const router = useRouter()
const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    type?: number | string // card 类型，不同背景
    isDaily?: boolean // 日榜/总榜
  }>(),
  { isUser: false, isDaily: true }
)

const showHonorWrap = computed(() => {
  return (
    props.info?.badgeImg?.length > 0 ||
    props.info?.vipLevel ||
    props.info?.wealthLevel ||
    props.info?.glamourLevel
  )
})

// 1. 配置
const config = {
  showBottomInfo: true, // 是否显示奖励信息？
  showTop3NumIcon: 1, // 是否显示前三名次图标？
  showHonor: false, // 是否显示荣誉勋章？
  bInfoNum: 5, // 前几名奖励信息？
  showNewOrBack: 1 // 是否显示新人或回流标识？
}

// 2. 使用对象形式存储样式配置
// 可以直接粘贴 CSS 代码，使用 css`...` 模板字符串自动转换
const optionList = {
  1: {
    styles: css`
      width: 1.68rem;
      height: 1.39125rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: 'g-v-a1',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.80063rem;
      height: 0.80063rem;
      flex-shrink: 0;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  2: {
    styles: css`
      width: 1.68rem;
      height: 1.39125rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: 'g-v-a2',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.80063rem;
      height: 0.80063rem;
      flex-shrink: 0;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  3: {
    styles: css`
      width: 1.68rem;
      height: 1.39125rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: 'g-v-a3',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.80063rem;
      height: 0.80063rem;
      flex-shrink: 0;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  0: {
    styles: css`
      width: 1.37rem;
      height: 1.35rem;
      flex-shrink: 0;
      aspect-ratio: 137/135;
    `,
    adorns: [
      {
        img: 'm-a',
        styles: css`
          width: 1.37rem;
          height: 1.35rem;
          flex-shrink: 0;
          aspect-ratio: 137/135;
        `
      }
    ],
    avatar: css`
      width: 1.12rem;
      height: 1.12rem;
      flex-shrink: 0;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.1rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  }
}

const getRew = inject('getRew')
const ossUrl = inject('ossUrl')
const yohoUi = inject('yohoUi')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()

const isTop = computed(() => {
  return props.isDaily
    ? Number(props?.info?.idx) <= 5 && !props?.isUser
    : Number(props?.info?.idx) <= 3 && !props?.isUser
}) // info.idx从1开始

const isTopIndex = computed(() => {
  return props.isDaily ? 5 : 3
})

const option = computed(() => {
  if (props?.info?.idx <= 3 && !props.isUser) {
    return optionList[props?.info?.idx]
  } else {
    return optionList['0']
  }
})
</script>

<style lang="scss" scoped>
.card {
  width: 7rem;
  height: 1.7rem;
  flex-shrink: 0;

  margin: 0 auto;
  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  &.top {
    width: 7rem;
    height: 2.54rem;
    flex-shrink: 0;

    .top-info {
      margin-top: 0.19rem;

      .name {
      }

      .score {
      }
    }

    .bottom-info {
      margin-top: 0rem;
    }
  }

  .top-info {
    width: 100%;

    display: flex;
    align-items: center;

    .stamp {
      width: 2.28rem;
      height: 1.86rem;

      object-fit: contain;

      position: absolute;
      top: -0.8rem;
      right: -0.2rem;
      z-index: 48;
    }

    .num {
      width: 0.44rem;
      height: 0.37rem;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
      }

      span {
        color: #ffeccf;
        text-align: center;

        /* 一级标题 */
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    .name {
      width: 1.85rem;
      height: 0.32rem;

      color: #ffeccf;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }

    .new-or-back {
      width: 1.3rem;
      height: 0.32rem;
      flex-shrink: 0;
      position: relative;
      margin-left: 0.05rem;

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

    .score {
      width: 1.74rem;
      height: 0.4rem;
      flex-shrink: 0;

      color: #ffeccf;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */

      text-align: center;
      line-height: 0.4rem !important;
    }

    .honor-bg {
      width: 4.12rem;
      height: 0.4rem;
      flex-shrink: 0;

      background: linear-gradient(
        90deg,
        rgba(255, 55, 55, 0) 0%,
        rgba(255, 55, 55, 0.4) 50%,
        rgba(255, 55, 55, 0) 100%
      );
      margin-top: 0.08rem;
    }
  }

  .bottom-info {
    width: 6.4rem;
    height: 0.8rem;
    display: flex;
    align-items: center;

    margin-top: 0.01rem;

    .b-icon {
      width: 0.48rem;
      height: 0.48rem;
      flex-shrink: 0;
    }

    .rew-wrap {
      .rew {
        width: 0.64rem;
        height: 0.64rem;
        flex-shrink: 0;

        img {
          width: 0.56rem;
          height: 0.56rem;
          flex-shrink: 0;
          object-fit: contain;
        }
      }

      .text-wrap {
        min-width: 0.56rem;

        display: flex;
        justify-content: center;
        flex-direction: column;
        .text {
          color: #ffde91;
          font-family: 'Geeza Pro';
          font-size: 0.22rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.28rem; /* 127.273% */
        }
      }
    }
  }

  &.top1 {
    .top-info {
      .num {
        span {
        }
      }

      .name {
      }

      .score {
      }
    }
  }

  &.top2 {
    .top-info {
      .num {
        span {
        }
      }

      .name {
      }

      .score {
      }
    }
  }

  &.top3 {
    .top-info {
      .num {
        span {
        }
      }

      .name {
      }

      .score {
      }
    }
  }

  &.isUser {
    .top-info {
      .num {
        span {
          color: #ffeccf;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.32rem; /* 133.333% */
        }
      }

      .name {
      }

      .score {
      }

      .honor-bg {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    }
  }

  &.bInfo {
    flex-direction: column;
  }
}
</style>
