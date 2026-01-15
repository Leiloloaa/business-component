<template>
  <Lazy>
    <div
      v-bg="isUser ? '' : info.idx <= 3 ? `card1` : 'card'"
      :class="['card', { top: Number(info.idx) <= 3 && !isUser, isUser: isUser }, `top${info.idx}`]"
    >
      <div class="top-info" :style="{ height: info.idx >= 4 && !isUser ? '100%' : '' }">
        <img
          v-if="info?.status == 0 && info?.stamp"
          class="stamp"
          :src="`${ossUrl}/stamp.png`"
          v-EG
        />

        <Space :val="0.47" :h="0" v-if="!isTop3 && !isUser" />

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

        <Space :val="0.16" :h="0" v-if="!isTop3" />

        <div class="left">
          <div class="user-info">
            <OptA :data="info || {}" :option="option" />

            <span class="name ov">
              {{ info.name || '---' }}
            </span>
          </div>

          <!-- 奖励信息 -->
          <div v-bg="`b-cp-info`" class="bottom-info fc" v-if="!isUser && Number(info.idx) <= 3">
            <NoticeBar :w="2" :h="0.8">
              <template v-for="rewardObj in userReward">
                <template v-if="info.idx >= rewardObj?.start && info.idx <= rewardObj?.end">
                  <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
                    <div v-bg="`b-rew`" class="rew fc">
                      <cdnImg :info="gift" />
                    </div>
                    <div class="text-wrap">
                      <Outline
                        :color="1 ? '0.05rem #9A1307' : '0.05rem #581604'"
                        :text="getRew(gift)?.num"
                        :noColor="false"
                        class="text text-name"
                      />
                    </div>
                  </div>
                </template>
              </template>
            </NoticeBar>
          </div>
        </div>

        <div class="middle">
          <div class="cp-type" v-bg="getCpType(info.gender, info.cp?.gender)" tag="png" />
          <div v-bg="`score`" class="score fc">{{ TOOL_NUM(info.score) || '--' }}</div>
        </div>

        <div class="right part" :class="{ isUser }">
          <div class="user-info">
            <OptA :data="info?.cp || {}" :option="option" />
            <span class="name ov"> {{ info?.cp?.name || '---' }} </span>
          </div>

          <!-- 奖励信息 -->
          <div v-bg="`b-cp-info`" class="bottom-info fc" v-if="!isUser && Number(info.idx) <= 3">
            <NoticeBar :w="2" :h="0.8">
              <template v-for="rewardObj in cpReward">
                <template v-if="info.idx >= rewardObj?.start && info.idx <= rewardObj?.end">
                  <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
                    <div v-bg="`b-rew`" class="rew fc">
                      <cdnImg :info="gift" />
                    </div>
                    <div class="text-wrap">
                      <Outline
                        :color="1 ? '0.05rem #9A1307' : '0.05rem #581604'"
                        :text="getRew(gift)?.num"
                        :noColor="false"
                        class="text text-name"
                      />
                    </div>
                  </div>
                </template>
              </template>
            </NoticeBar>
          </div>
        </div>
      </div>
    </div>
  </Lazy>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'

const getRew = inject('getRew')

const isDaily = inject('isDaily', false)
const { TOOL_countryCode, TOOL_TEXT, TOOL_NUM } = injectTool()
const rankLoadInfo = inject('rankLoadInfo')
const ossUrl = inject('ossUrl')

const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    isDaily?: boolean // 日榜/总榜
  }>(),
  { isUser: false }
)

// 获取cp类型 男-男 'mm' 女-女 'ff' 男-女 'mf'
const getCpType = (gender1, gender2) => {
  if (gender1 == gender2 && gender1 == 2) {
    return 'cp-mm'
  } else if (gender1 == gender2 && gender1 == 1) {
    return 'cp-ff'
  } else {
    return 'cp-mf'
  }
}

const userReward = computed(() => {
  let gender = props.info?.gender
  if (gender === 1) {
    return rankLoadInfo.reward.femaleReward ?? []
  } else {
    return rankLoadInfo.reward.maleReward ?? []
  }
})

const cpReward = computed(() => {
  let gender = props.info?.cp?.gender
  if (gender === 1) {
    return rankLoadInfo.reward.femaleReward ?? []
  } else {
    return rankLoadInfo.reward.maleReward ?? []
  }
})

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
          flex-shrink: 0;
        `
      }
    ],
    avatar: css`
      width: 0.98rem;
      height: 0.98rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.1rem;
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
          flex-shrink: 0;
        `
      }
    ],
    avatar: css`
      width: 0.98rem;
      height: 0.98rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.1rem;
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
          flex-shrink: 0;
        `
      }
    ],
    avatar: css`
      width: 0.98rem;
      height: 0.98rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.1rem;
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
          flex-shrink: 0;
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
  }
}

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
::v-deep(.van-notice-bar__wrap) {
  justify-content: center !important;
}

.card {
  width: 7rem;
  height: 1.96rem;
  flex-shrink: 0;

  margin: 0 auto;
  margin-bottom: 0.08rem;

  display: flex;

  position: relative;

  &.top {
    width: 7rem;
    height: 3.27rem;
    margin-bottom: 0.16rem;

    display: flex;
    justify-content: center;

    .num {
      width: 0.44rem;
      height: 0.37rem;

      position: absolute;
      top: 0.1rem;
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

    .top-info {
      margin-top: -0.1rem;
      .left,
      .right {
        margin-top: 0.33rem;

        .name {
          margin-top: -0.08rem;
          margin-bottom: 0.04rem;
          width: 1.80688rem;

          color: #ffedbe;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.32rem; /* 133.333% */
          text-align: center;
        }

        .reward-wrap {
          width: 2.84rem;
          height: 0.8rem;
        }
      }

      .middle {
        width: 1.7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: -0.5rem;
        margin-left: -0.5rem;
        margin-right: -0.5rem;

        .top-rank {
          width: 0.64rem;
          height: 0.55rem;
          flex-shrink: 0;
        }

        .cp-level {
          color: #ff471d;
          font-size: 0.28rem;
          font-weight: 700;
          line-height: 0.28rem; /* 100% */
        }

        .cp-type {
          width: 0.7rem;
          height: 0.73rem;
          flex-shrink: 0;
        }

        .score {
          width: 1.74rem;
          height: 0.4rem;

          margin-top: -0.18rem;

          position: relative;
          z-index: 2;

          color: #ffeccf;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.4rem; /* 133.333% */
        }
      }
    }

    .bottom-bg {
      width: 6.64rem;
      height: 0.8rem;
      position: absolute;
      left: 50%;
      bottom: 0.16rem;
      transform: translateX(-50%);
      z-index: -1;
    }
  }

  &.isUser {
    display: flex;
    justify-content: center;

    .top-info {
    }

    .middle {
    }
  }

  .stamp {
    width: 2rem;
    height: 1.2rem;
    position: absolute;
    top: -0.5rem;
    left: 0rem;
    z-index: 98;
  }

  .top-info {
    display: flex;
    align-items: center;
    margin-top: -0.05rem;

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

    .left,
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .name {
        width: 1.52rem;
        height: 0.32rem;

        margin-top: -0.1rem;

        color: #ffcc6c;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
        text-align: center;
      }

      .bottom-info {
        width: 2.84rem;
        height: 0.8rem;

        display: flex;
        justify-content: center;
        align-items: center;

        .b-icon {
          width: 0.64rem;
          height: 0.64rem;
        }

        .rew-wrap {
          width: 0.64rem;
          height: 0.64rem;
          position: relative;
          margin-left: 0.12rem;
          margin-right: 0.12rem;

          .rew {
            width: 0.64rem;
            height: 0.64rem;
            flex-shrink: 0;

            position: relative;

            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 0.56rem;
              height: 0.56rem;
              flex-shrink: 0;
              object-fit: contain;
            }
          }

          .text-wrap {
            position: absolute;
            top: 0.1rem;
            right: 0rem;

            display: flex;
            justify-content: center;
            align-items: center;

            .text {
              color: #fff7e1;
              -webkit-text-stroke-width: 2px;
              -webkit-text-stroke-color: #9a1307;
              font-family: 'SF UI Text';
              font-size: 0.16rem;
              font-style: normal;
              font-weight: 700;
              line-height: 0.16rem; /* 100% */
            }
          }
        }
      }
    }

    .middle {
      width: 1.7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: -0.2rem;
      // margin-left: -0.5rem;
      // margin-right: -0.5rem;

      .top-rank {
        width: 0.64rem;
        height: 0.55rem;
        flex-shrink: 0;
      }

      .cp-level {
        color: #ff471d;
        font-size: 0.28rem;
        font-weight: 700;
        line-height: 0.28rem; /* 100% */
      }

      .cp-type {
        width: 0.7rem;
        height: 0.73rem;
        flex-shrink: 0;
      }

      .score {
        width: 1.74rem;
        height: 0.4rem;

        margin-top: -0.18rem;

        position: relative;
        z-index: 2;

        color: #ffeccf;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.4rem; /* 133.333% */
      }
    }
  }
}
</style>
