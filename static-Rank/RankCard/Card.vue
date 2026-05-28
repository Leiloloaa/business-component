<template>
  <Lazy :lazy="!isUser">
    <div
      v-bg="isUser ? '' : info.idx <= 3 ? `card1` : 'card'"
      :class="[
        'card',
        { top: isTop3, isUser: isUser, bInfo: config.showBottomInfo },
        `top${info.idx}`
      ]"
    >
      <div class="top-info" :style="{ height: info.idx >= 4 && !isUser ? '100%' : '' }">
        <img
          v-if="info?.status == 0 && info?.stamp"
          class="stamp"
          :src="`${ossUrl}/stamp.png`"
          v-EG
        />

        <Space :val="isTop3 ? 0.54 : 0.27" />

        <div class="num fc">
          <Outline
            v-if="isTop3"
            :color="`0.05rem #ff4524`"
            :text="info?.rank || info?.idx"
            class="top3"
          />
          <Outline v-else :color="`0.05rem #DA00B9`" :text="info?.rank || info?.idx" noColor />
        </div>

        <Space :val="isTop3 ? 0 : 0.16" />
        <OptA :data="info || {}" :option="option" />
        <Space :val="0.26" />

        <template v-if="!isUser">
          <Outline class="name ov" :color="'0.05rem #7D2759'" :text="info?.name || '--'" noColor />
          <Space :val="0.26" />
          <div v-bg="`score`" class="score">
            {{ TOOL_NUM(info?.score) || '--' }}
          </div>
        </template>

        <template v-else>
          <div>
            <Outline
              class="name ov"
              :color="'0.05rem #7D2759'"
              :text="info?.name || '--'"
              noColor
            />
            <Space :val="0.06" h />
            <div v-bg="`score`" class="score">
              {{ TOOL_NUM(info?.score) || '--' }}
            </div>
          </div>
          <Space :val="0.1" />
          <div v-bg="`go-game-center`" class="game-center fc" @click="handleGoGameCenter">
            <Outline
              :color="'0.05rem #FFE434'"
              :text="TOOL_TEXT[61] || 'Go Game'"
              :noColor="false"
            />
          </div>
        </template>
      </div>
    </div>
  </Lazy>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css, toAppUrl } from '@publicComponents/shared'

const getRew = inject('getRew')
const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT, TOOL_BPFunc } = injectTool()
const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    isDaily?: boolean // 日榜/总榜
  }>(),
  { isUser: false }
)

const isTop3 = computed(() => Number(props?.info?.idx) <= 3 && !props?.isUser) // info.idx从1开始

// 1. 配置
const config = {
  showBottomInfo: true, // 是否显示奖励信息？
  showHonor: false, // 是否显示荣誉勋章？
  bInfoNum: 3, // 前几名奖励信息？
  top3AvatarIsSameSize: true // 前三名头像是否大小一致？
}

// 2. 使用对象形式存储样式配置
// 可以直接粘贴 CSS 代码，使用 css`...` 模板字符串自动转换
const top1FrameStyles = css`
  width: 1.80688rem;
  height: 1.80688rem;
`
const top2FrameStyles = css`
  width: 1.80688rem;
  height: 1.80688rem;
`
const top3FrameStyles = css`
  width: 1.80688rem;
  height: 1.80688rem;
`
const frameStyles = css`
  width: 1.52rem;
  height: 1.52rem;
`
const avatarInnerStyles = css`
  width: 80%;
  height: 80%;
  top: 0.01rem;
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
const optionMap = Object.fromEntries(
  (
    [
      [0, 'a', frameStyles],
      [1, 'a1', top1FrameStyles],
      [2, 'a2', top2FrameStyles],
      [3, 'a3', top3FrameStyles]
    ] as const
  ).map(([key, img, frame]) => [
    key,
    {
      styles: frame,
      adorns: [{ img, styles: frame }],
      avatar: avatarInnerStyles,
      ...sharedLive
    }
  ])
)
const option = computed(() => {
  if (isTop3.value && !props.isUser) {
    return optionMap[config.top3AvatarIsSameSize ? 1 : props?.info?.idx]
  }
  return optionMap[0]
})

const handleGoGameCenter = async () => {
  await TOOL_BPFunc({ desc: 'Play games_button_click', action: 'click' })
  window.location.href =
    (ENV == 'build' ? window?.hostConfig?.m : window?.hostConfig?.mTest) +
    '/202502/gameCenter/index.html?webViewStyle=1'
}
</script>

<style lang="scss" scoped>
.card {
  width: 7rem;
  height: 1.72rem;

  margin: 0 auto;
  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  &.top {
    width: 6.81rem;
    height: 2.02531rem;
    margin-bottom: 0.08rem;
    position: relative;

    .top-info {
      margin-top: 0.49rem;
      .name {
      }

      .num {
        width: 0.6rem;
        height: 0.6rem;

        position: absolute;
        top: 0.1rem;
        left: 50%;
        transform: translateX(-50%);

        span {
          color: #fffcb9;
          text-align: center;
          -webkit-text-stroke-width: 1px;
          -webkit-text-stroke-color: #ff4524;
          font-family: 'SF UI Text';
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.32rem; /* 100% */
          letter-spacing: -0.00805rem;
        }
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
      width: 2rem;
      height: 1.2rem;

      object-fit: contain;

      position: absolute;
      top: -0.4rem;
      right: -0.2rem;
      z-index: 48;
    }

    .num {
      width: 0.6rem;
      height: 0.6rem;

      span {
        color: #fff70f;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.28rem;
        font-style: italic;
        font-weight: 700;
        line-height: 0.34rem; /* 121.429% */
      }
    }

    .name {
      width: 1.85rem;
      height: 0.32rem;

      color: #fff;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }

    .score {
      width: 1.74rem;
      height: 0.4rem;

      color: #fff;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */

      text-align: center;
      line-height: 0.4rem !important;
    }

    .game-center {
      width: 2.08rem;
      height: 0.7rem;
      span {
        color: #bc1f00;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #ffe434;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 108.333% */
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
        }
      }

      .name {
      }

      .score {
      }
    }
  }

  &.bInfo {
    flex-direction: column;
  }
}
</style>
