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
            :color="`0.05rem #830000`"
            :text="info?.idx || info?.rank || '99+'"
            class="top3"
          />
          <Outline
            v-else
            :color="`0.05rem #DA00B9`"
            :text="info?.idx || info?.rank || '99+'"
            noColor
          />
        </div>

        <Space :val="isTop3 ? 0 : 0.16" />
        <OptA :data="info || {}" :option="option" />
        <Space :val="0.26" />

        <!-- 层叠头像组件 -->
        <!-- <div class="superpose-avatar">
      <SuperposeAvatar :overlap="0.16">
        <div class="avatar-wrap" v-for="tp in 3">
          <cdnImg class="avatar" :fid="info?.top3?.[tp - 1] || ''"></cdnImg>
        </div>
      </SuperposeAvatar>
    </div> -->

        <!-- 没有荣誉勋章 -->
        <template v-if="!config.showHonor || isUser">
          <div>
            <Space
              :val="0.37"
              h
              v-if="(info.isNewUser || info.isReturnUser) && !isUser && config.showNewOrBack"
            />
            <Outline
              class="name ov"
              :color="'0.05rem #7D2759'"
              :text="info?.name || '--'"
              noColor
            />
            <!-- 新人或回流标识 -->
            <div
              class="new-or-back fc"
              :class="TOOL_countryCode"
              v-if="
                (info.isNewUser || info.isReturnUser) &&
                !isUser &&
                config.showNewOrBack &&
                router.currentRoute.value.name != 'rankneworreturn'
              "
            >
              <img :src="`${ossUrl}/${info.isNewUser ? 'n1' : 'n1'}.png`" />
              <NoticeBar :w="1.3" :h="0.32">
                <span style="min-width: 1.3rem">{{ TOOL_TEXT[info?.isNewUser ? 107 : 107] }}</span>
              </NoticeBar>
            </div>
          </div>
          <Space :val="0.26" />
          <div v-bg="`score`" class="score">{{ TOOL_NUM(info?.score) || '--' }}</div>
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
const router = useRouter()
const OSS_DOMAIN = inject('OSS_DOMAIN')
const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    isDaily?: boolean // 日榜/总榜
  }>(),
  { isUser: false }
)

// 1. 配置
const config = {
  showBottomInfo: true, // 是否显示奖励信息？
  showNewOrBack: false, // 是否显示新人或回流标识？
  showHonor: false, // 是否显示荣誉勋章？
  showTop3NumIcon: 1, // 是否显示前三名次图标？
  bInfoNum: 3 // 前几名奖励信息？
}

// 2. 使用对象形式存储样式配置
// 可以直接粘贴 CSS 代码，使用 css`...` 模板字符串自动转换
const optionList = {
  1: {
    styles: css`
      width: 1.80688rem;
      height: 1.80688rem;
      aspect-ratio: 180.69/180.69;
    `,
    adorns: [
      {
        img: 'a1',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.99531rem;
      height: 1.07188rem;
      top: 0.05rem;
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
      width: 1.80688rem;
      height: 1.80688rem;
      aspect-ratio: 180.69/180.69;
    `,
    adorns: [
      {
        img: 'a2',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.99531rem;
      height: 1.07188rem;
      top: 0.05rem;
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
      width: 1.80688rem;
      height: 1.80688rem;
      aspect-ratio: 180.69/180.69;
    `,
    adorns: [
      {
        img: 'a3',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.99531rem;
      height: 1.07188rem;
      top: 0.05rem;
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
      top: 0.06rem;
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
}

const getRew = inject('getRew')
const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()

const isTop3 = computed(() => Number(props?.info?.idx) <= 3 && !props?.isUser) // info.idx从1开始

const option = computed(() => {
  if (isTop3.value && !props.isUser) {
    return optionList[props?.info?.idx]
  } else {
    return optionList['0']
  }
})
</script>

<style lang="scss" scoped>
.card {
  width: 7rem;
  height: 1.76rem;

  margin: 0 auto;
  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  &.top {
    width: 7rem;
    height: 3.04rem;
    margin-bottom: 0.08rem;
    position: relative;

    .top-info {
      margin-top: 0.25rem;
      .name {
        color: #ffedbe;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
      }

      .num {
        width: 0.44rem;
        height: 0.37rem;

        position: absolute;
        top: 0.2rem;
        left: 50%;
        transform: translateX(-60%);

        span {
          color: #f2ff3f;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #830000;
          font-family: 'SF UI Text';
          font-size: 0.36rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.16rem; /* 44.444% */
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
        color: #ffeb7a;
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

      color: #ffcc6c;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
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

    .new-or-back {
      width: 1.32rem;
      height: 0.32rem;
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
        text-align: center;
        font-family: 'SF UI  Text';
        font-size: 0.14rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.14rem; /* 100% */

        background: linear-gradient(90deg, #ffe590 0.41%, #fffde6 50.09%, #ffe590 99.77%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .honor-bg {
      width: 4.12rem;
      height: 0.4rem;
      flex-shrink: 0;

      margin-top: 0.16rem;
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
