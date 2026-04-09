<template>
  <Lazy>
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

        <!-- 没有荣誉勋章 -->
        <template v-if="!config.showHonor || isUser">
          <Outline class="name ov" :color="'0.05rem #7D2759'" :text="info?.name || '--'" noColor />
          <Space :val="0.26" />
          <div v-if="isUser && info.url == 'page1'">
            <div v-bg="`score`" class="score" v-if="info.rank == 1">
              {{ TOOL_NUM(info?.score) || '--' }}
            </div>
            <template v-else>
              <div class="distance">
                {{ TOOL_TEXT[54]?.replace('%s', '')?.replace('s%', '') }}
              </div>
              <div v-bg="`score`" class="score">{{ TOOL_NUM(info?.diffPreviousScore) }}</div>
            </template>
          </div>

          <div v-bg="`score`" class="score" v-else>
            {{ TOOL_NUM(info?.score) || '--' }}
          </div>
        </template>

        <!-- 有荣誉勋章 -->
        <template v-else>
          <div>
            <div class="fc">
              <div class="name ov">{{ info?.name || '---' }}</div>
              <Space :val="0.06" />
              <div v-bg="`score`" class="score">{{ TOOL_NUM(info?.score) || '---' }}</div>
            </div>

            <div class="honor-bg fc" v-if="info?.name">
              <Honor :data="info" />
            </div>
          </div>
        </template>
      </div>

      <!-- 奖励信息 -->
      <div
        v-bg="`b-info`"
        class="bottom-info fc"
        v-if="isDaily && !isUser && Number(info?.idx) <= config.bInfoNum"
      >
        <Space :val="0.3" />
        <img :src="`${ossUrl}/b-icon.png`" class="b-icon shake" />
        <Space :val="0.09" />
        <NoticeBar :w="6" :h="0.8">
          <template v-for="rewardObj in info?.reward">
            <template v-if="info?.idx >= rewardObj?.start && info?.idx <= rewardObj?.end">
              <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
                <Space :val="0.05" />
                <div v-bg="`b-rew`" class="rew fc">
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
  </Lazy>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'

const getRew = inject('getRew')
const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()
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
    { styles: frame, adorns: [{ img, styles: frame }], avatar: avatarInnerStyles, ...sharedLive }
  ])
)
const option = computed(() => {
  if (isTop3.value && !props.isUser) {
    return optionMap[config.top3AvatarIsSameSize ? 1 : props?.info?.idx]
  }
  return optionMap[0]
})
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
    width: 7rem;
    height: 3.38rem;
    margin-bottom: 0.08rem;
    position: relative;

    .top-info {
      margin-top: 0.49rem;
      .name {
        color: #ffedbe;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
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
        color: #ffedbe;
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

      color: #ffedbe;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }

    .distance {
      width: 1.74rem;

      color: #ffeccf;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */

      margin-bottom: 0.05rem;
    }

    .score {
      width: 1.74rem;
      height: 0.4rem;

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
  }

  .bottom-info {
    width: 6.4rem;
    height: 0.8rem;
    display: flex;
    align-items: center;

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
          color: #ffd599;
          font-family: 'SF UI Text';
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
