<template>
  <div class="card" :class="{ top: isTop3, isUser: isUser, honor: honor, bInfo: bottomInfo }">
    <div
      class="top-info"
      :class="[
        { 'top-info23': route.path.includes('/fmilynewrank') && (info.idx == 2 || info.idx == 3) },
        TOOL_countryCode
      ]"
    >
      <img class="stamp" :src="`${imgUrl}/stamp.png`" v-if="info.status == 0 && info.stamp" />

      <Space :val="isTop3 ? 0.38 : 0.28" />
      <div class="num fc">
        <Outline :color="`0.05rem #9220ff`" :text="info.idx || info.rank || '99+'" noColor />
      </div>
      <Space :val="-0.15" v-if="isTop3" />
      <div v-jump.fmily="info?.other">
        <OptA
          :data="{ ...info, avatar: info.other?.cover } || {}"
          :option="option"
          style="pointer-events: none"
        />
      </div>
      <Space :val="0.12" v-if="!isTop3" />
      <!-- 没有荣誉勋章 -->
      <div>
        <Outline
          class="name ov"
          :color="'0.05rem #7D2759'"
          :text="info.other?.name || '--'"
          noColor
          :style="{
            paddingRight: TOOL_countryCode == 'EG' ? '0.06rem' : '',
            paddingLeft: TOOL_countryCode != 'EG' ? '0.06rem' : ''
          }"
        />
        <div class="score">{{ TOOL_NUM(info.score) || '--' }}</div>
        <div class="box-score">
          <Space :val="0.17" />
          <img :src="`${imgUrl}/fa-score-icon.png${webp}`" class="score-icon" />
          <Space :val="0.08" />
          <span>{{ TOOL_NUM(info.other1) || '--' }}</span>
        </div>
      </div>
      <Space :val="isTop3 ? 0.19 : 0.24" />

      <!-- 层叠头像组件-->
      <div class="superpose-avatar-wrap">
        <SuperposeAvatar :overlap="0.4" @click="showToast(info)">
          <div class="avatar-wrap" v-for="tp in 3">
            <OptA
              :data="info.extraInfos?.[tp - 1] || {}"
              :option="optionList.optionSmall"
              style="pointer-events: none"
            />
          </div>
        </SuperposeAvatar>
        <Space :val="-0.2" />

        <img :src="`${imgUrl}/f-card-arrow.png${webp}`" class="f-card-arrow" v-EG.self />
      </div>
    </div>
    <div
      class="bottom-info"
      v-if="
        isDailyRank &&
        !isUser &&
        Number(info.idx) <= bInfoNum &&
        !route.path.includes('/fmilynewrank')
      "
    >
      <Space :val="0.8" />
      <div class="gift-icon shake"></div>
      <div class="reward-tip">{{ homeInfo.lang(83) }}</div>
      <NoticeBar :w="6.32" :h="0.81647">
        <div style="display: flex; align-items: center">
          <template v-for="rewardObj in info.reward">
            <template v-if="info.idx >= rewardObj.start && info.idx <= rewardObj.end">
              <div class="gift-wrap" v-for="gift in rewardObj.rewards">
                <Space :val="0.05" />
                <div class="gift-box">
                  <cdnImg class="gift" :info="gift"></cdnImg>
                </div>
                <Space :val="0.12" />
                <div class="msg-wrap">
                  <div class="text">{{ getRew(gift).name }}</div>
                  <div class="text">{{ getRew(gift).num }}</div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </NoticeBar>
    </div>

    <div
      class="bottom-info"
      v-if="isDailyRank && !isUser && Number(info.idx) == 1 && route.path.includes('/fmilynewrank')"
    >
      <Space :val="0.8" />
      <div class="gift-icon shake"></div>
      <div class="reward-tip">{{ homeInfo.lang(83) }}</div>
      <NoticeBar :w="6.32" :h="0.81647">
        <div style="display: flex; align-items: center">
          <template v-for="rewardObj in info.reward">
            <template v-if="info.idx >= rewardObj.start && info.idx <= rewardObj.end">
              <div class="gift-wrap" v-for="gift in rewardObj.rewards">
                <Space :val="0.05" />
                <div class="gift-box">
                  <cdnImg class="gift" :info="gift"></cdnImg>
                </div>
                <Space :val="0.12" />
                <div class="msg-wrap">
                  <div class="text">{{ getRew(gift).name }}</div>
                  <div class="text">{{ getRew(gift).num }}</div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </NoticeBar>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css } from "@publicComponents/shared";

const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    type?: number | string // card 类型，不同背景
    isDailyRank?: boolean // 日榜/总榜
  }>(),
  { isUser: false, isDailyRank: true }
)

const getRew = inject('getRew')
const homeInfo = inject('homeInfo')
const imgUrl = inject('imgUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT, TOOL_BPFunc } = injectTool()
const route = useRoute()
const isTop3 = computed(() => {
  if (route.path.includes('/fmilynewrank')) {
    return Number(props.info.idx) <= 1 && !props.isUser
  } else {
    return Number(props.info.idx) <= 3 && !props.isUser
  }
}) // info.idx从1开始

const rankStatus = inject('rankStatus')
const showToast = (info) => {
  if (!info.name) return
  TOOL_BPFunc({
    desc: `${route.path.includes('/fmilynewrank') ? 'NEW' : ' '}fmily ${
      rankStatus.selData != 999 ? 'Daily' : 'Total'
    } Contribution List_page`,
    action: 'show'
  })

  rankStatus.isDailyRank = props.isDailyRank
  rankStatus.showDialog = true
  rankStatus.curInfo = info
}
const top3NumIcon = 0 // 是否显示前三名次图标？
const top3Avatar = 1 // 前三的头像框是否不同？
const honor = 1 // 是否显示荣誉勋章？
const showStamp = 1 // 是否显示盖戳？
const bottomInfo = 1 // 是否显示奖励信息？
const bInfoNum = 3 // 前几名奖励信息？

const numIcon = computed(() => top3NumIcon && isTop3.value)
const option = computed(() => {
  if (props.info.idx <= 3 && !props.isUser) {
    return optionList['option' + props.info.idx]
  } else {
    return optionList.option
  }
})

const optionList = {
  option1: {
    styles: css`
      width: 1.74rem;
      height: 1.74rem;
    `,
    adorns: [
      {
        img: 'f-a1',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.1rem;
      height: 1.1rem;
      top: 0.4rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  option2: {
    styles: css`
      width: 1.74rem;
      height: 1.74rem;
    `,
    adorns: [
      {
        img: 'f-a2',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.1rem;
      height: 1.1rem;
      top: 0.4rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  option3: {
    styles: css`
      width: 1.74rem;
      height: 1.74rem;
    `,
    adorns: [
      {
        img: 'f-a3',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.1rem;
      height: 1.1rem;
      top: 0.4rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  option: {
    styles: css`
      width: 1.48rem;
      height: 1.48rem;
    `,
    adorns: [
      {
        img: 'f-a',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  optionSmall: {
    styles: css`
      width: 0.98rem;
      height: 0.98rem;
    `,
    adorns: [
      {
        img: 'f-small-a',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.72rem;
      height: 0.72rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 7.4rem;
  height: 1.86rem;
  margin: 0 auto;
  margin-bottom: 0.18rem;

  display: flex;
  position: relative;

  &.bInfo {
    flex-direction: column;
  }

  .top-info {
    display: flex;
    align-items: center;

    margin-bottom: 0.22rem;
    margin-top: 0.24rem;

    .stamp {
      width: 1.78rem;
      height: 1.02rem;

      object-fit: contain;

      position: absolute;
      top: -0.41rem;
      right: 0.09rem;
      z-index: 98;
    }

    &.EG {
      .stamp {
        right: unset;
        left: 0.09rem;
      }
    }

    .num {
      width: 0.6rem;
      height: 0.6rem;

      img {
        width: 0.54rem;
        height: 0.54rem;
        flex-shrink: 0;
        flex-shrink: 0;
      }

      span {
        color: #fff0cc;
        text-align: center;

        /* 一级标题 */
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.6rem;
      }
    }

    .name {
      width: 1.81rem;
      height: 0.26rem;
      margin-bottom: -0.02rem;
      margin-top: 0.13rem;

      color: #fff0cc;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */
    }

    .score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;
      margin-bottom: 0.04rem;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;

      text-align: center;
      line-height: 0.48rem;
    }

    .box-score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;

      img {
        width: 0.42rem;
        height: 0.25246rem;
      }

      span {
        color: #fff0cc;

        /* 内文 */
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;

        text-align: center;
        line-height: 0.48rem;
      }
    }

    .superpose-avatar-wrap {
      display: flex;
      align-items: center;
      :deep(.superpose-avatar) {
        position: relative;
        z-index: 1;
      }
    }

    .f-card-arrow {
      width: 0.4rem;
      height: 0.4rem;
      position: relative;
      z-index: 2;
    }
    .honor-bg {
      width: 4.12rem;
      height: 0.4rem;
      flex-shrink: 0;
      //       margin-top: 0.16rem;
    }
  }

  .bottom-info {
    width: 6.8rem;
    height: 0.8rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    margin-top: -0.25rem;

    .gift-icon {
      width: 0.69818rem;
      height: 0.71255rem;
      flex-shrink: 0;
      object-fit: contain;
    }

    .reward-tip {
      color: #fff;
      font-family: 'Geeza Pro';
      font-size: 0.22rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.28rem; /* 127.273% */
    }

    .gift-wrap {
      display: flex;
      align-items: center;
      justify-content: center;

      .gift-box {
        width: 0.64rem;
        height: 0.64rem;
        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        .gift {
          width: 0.56rem;
          height: 0.56rem;
          flex-shrink: 0;
          object-fit: contain;
        }

        .super {
          width: 0.56rem;
          height: 0.56rem;
          flex-shrink: 0;
          object-fit: contain;
        }
      }

      .msg-wrap {
        min-width: 0.56rem;

        display: flex;
        justify-content: center;
        flex-direction: column;

        .text {
          color: #fffce1;
          font-family: Arial;
          font-size: 0.22rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.28rem; /* 127.273% */
        }
      }
    }
  }
  .top-info23 {
    margin-top: 0.15rem;
  }
  &.top {
    width: 7.4rem;
    height: 2.79639rem;
    flex-shrink: 0;

    margin-bottom: 0.24rem;

    .top-info {
      margin-top: 0.15rem;
      .stamp {
        top: -0.11rem;
      }
    }

    .num {
      width: 0.6rem;
      height: 0.6rem;

      img {
        width: 0.54rem;
        height: 0.54rem;
        flex-shrink: 0;
        flex-shrink: 0;
      }

      span {
        color: #911d00;
        text-align: center;

        /* 一级标题 */
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.6rem;
      }
    }

    .name {
      width: 1.81rem;
      height: 0.26rem;
      margin-bottom: -0.02rem;
      margin-top: 0.28rem;

      color: #911d00;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */
    }

    .score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;
      margin-bottom: 0.04rem;

      color: #fff0cc;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;

      text-align: center;
      line-height: 0.48rem;
    }
  }

  &.isUser {
    .top-info {
      margin-top: 0.22rem;
      margin-bottom: 0rem;
    }

    .num {
      span {
        width: 0.6rem;
        height: 0.6rem;

        color: #653c00;
        text-align: center;

        /* 一级标题 */
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.6rem;
      }
    }

    .name {
      margin-top: 0.07rem;
      margin-bottom: -0.02rem;
      color: #653c00;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */
    }
    .box-score {
      span {
        color: #fff0cc;
        text-align: center;

        /* 内文 */
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.48rem; /* 108.333% */
      }
    }

    .score {
      color: #fff0cc;
      text-align: center;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.48rem; /* 108.333% */
    }

    .honor-bg {
      width: 3.68rem;
      height: 0.4rem;
      flex-shrink: 0;

      // background: linear-gradient(
      //   270deg,
      //   rgba(113, 177, 255, 0) 6.69%,
      //   #71b1ff 49.89%,
      //   rgba(113, 177, 255, 0) 92.85%
      // );
    }
  }
}
</style>
