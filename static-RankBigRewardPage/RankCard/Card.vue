<template>
  <div
    v-bg="cardBg"
    :class="[
      'card',
      'bInfo',
      { top: hasReward && !isUser, isUser: isUser, EG: TOOL_countryCode == 'EG' },
      `top${rankIdx}`
    ]"
  >
    <div class="top-info" :style="{ height: !hasReward && !isUser ? '100%' : '' }">
      <img
        v-if="info?.status == 0 && info?.stamp"
        class="stamp"
        :src="`${ossUrl}/stamp.png`"
        v-EG
      />

      <Space :val="0.24" />

      <div class="num fc">
        <img v-if="isTop3 && !isUser" :src="`${ossUrl}/num${rankIdx}.png`" alt="" />
        <Outline v-else :color="`0.05rem #DA00B9`" :text="info?.rank || rankIdx" noColor />
      </div>

      <Space :val="0.13" />
      <OptA :data="info || {}" :option="option" />
      <Space :val="0.21" />

      <div v-if="!isUser && hasReward">
        <Outline
          class="name ov"
          :color="'0.05rem #34C200'"
          :text="info?.name || '--'"
          :noColor="!isTop3"
        />
        <div v-bg="`score`" class="score">
          {{ TOOL_NUM(info?.score) || '--' }}
        </div>
      </div>

      <template v-else>
        <Outline
          class="name ov"
          :color="'0.05rem #34C200'"
          :text="info?.name || '--'"
          :noColor="!hasReward"
        />
        <div v-bg="`score`" class="score">
          {{ TOOL_NUM(info?.score) || '--' }}
        </div>
      </template>
    </div>

    <!-- 大奖 -->
    <div class="big-rew" v-bg="`big-rew`" v-if="showBottomReward"></div>

    <!-- 奖励信息 -->
    <div class="bottom-info fc" v-if="showBottomReward">
      <SwiperFrame
        class="rew-swiper"
        :list="rewardList"
        :swiper-id="`rank-rew-${rankIdx}`"
        :swiper-options="rewardSwiperOptions"
      >
        <template #default="{ item: gift }">
          <div class="rew-wrap">
            <div v-bg="`rew`" class="rew fc">
              <cdnImg :info="gift" />
            </div>
            <div class="text-wrap">
              <NoticeBar :w="1.24" :h="0.34" center>
                <span class="text text-name">{{ getRew(gift)?.name }}</span>
              </NoticeBar>
            </div>
          </div>
        </template>
      </SwiperFrame>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'

const getRew = inject('getRew')
const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM } = injectTool()
const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    isDaily?: boolean // 日榜/总榜
  }>(),
  { isUser: false }
)

const rankIdx = computed(() => Number(props?.info?.idx) || 0)
const isTop3 = computed(() => rankIdx.value >= 1 && rankIdx.value <= 3)

// 命中当前名次区间的奖励，拍平为一维列表供 Swiper 渲染
const rewardList = computed(() => {
  const list: any[] = []
  props.info?.reward?.forEach((rewardObj: any) => {
    if (rankIdx.value >= rewardObj?.start && rankIdx.value <= rewardObj?.end) {
      rewardObj?.rewards?.forEach((gift: any) => list.push(gift))
    }
  })
  return list
})

// 当前名次是否命中某个奖励区间项：决定大卡样式与头像装饰
const hasReward = computed(() =>
  (props.info?.reward || []).some((r: any) => rankIdx.value >= r?.start && rankIdx.value <= r?.end)
)

// 命中区间且有具体奖品时，展示底部奖品轮播与大奖图
const showBottomReward = computed(() => !props.isUser && rewardList.value.length > 0)

const cardBg = computed(() => {
  if (props.isUser) return ''
  if (isTop3.value) return 'card1'
  if (hasReward.value) return 'card4'
  return 'card'
})

// 2. 使用对象形式存储样式配置
// 可以直接粘贴 CSS 代码，使用 css`...` 模板字符串自动转换
const top1FrameStyles = css`
  width: 1.54875rem;
  height: 1.54875rem;
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
  width: 1.54875rem;
  height: 1.54875rem;
`
const customFrameStyles = css`
  width: 1.3632rem;
  height: 1.3632rem;
`
const sharedLive = {
  live: css`
    width: 0.41rem;
    height: 0.24rem;
    bottom: 0rem;
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
      [3, 'a3', top3FrameStyles],
      [4, 'a', customFrameStyles]
    ] as const
  ).map(([key, img, frame]) => [key, { styles: frame, img, ...sharedLive }])
)
const option = computed(() => {
  if (props.isUser || !hasReward.value) {
    return optionMap[4]
  }
  // 前三名头像统一尺寸（复用第一名尺寸），仅装饰图按名次替换
  if (isTop3.value) {
    return { ...optionMap[1], img: optionMap[rankIdx.value]?.img || 'a1' }
  }
  return optionMap[0]
})

const rewardSwiperOptions = computed(() => ({
  loop: rewardList.value.length > 3,
  speed: 1000,
  initialSlide: 0,
  slidesPerView: 3,
  spaceBetween: 12,
  autoplay: rewardList.value.length > 3 ? { delay: 2000, disableOnInteraction: false } : false
}))
</script>

<style lang="scss" scoped>
.card {
  width: 6.6rem;
  height: 1.68rem;

  margin: 0 auto;
  margin-bottom: 0.16rem;

  display: flex;
  align-items: center;

  position: relative;

  &.top {
    width: 6.61rem;
    height: 3.95rem;
    margin-bottom: 0.08rem;
    position: relative;

    .top-info {
      margin-top: 0.22rem;
      .name {
        color: #fffeec;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .num {
        img {
          width: 0.64rem;
          height: 0.53733rem;
        }
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
      width: 0.64rem;
      height: 0.53733rem;

      span {
        color: #fff;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    .name {
      width: 1.85rem;
      height: 0.32rem;

      color: #fff;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .score {
      width: 1.74rem;
      height: 0.4rem;

      color: #feffbe;
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

  .big-rew {
    width: 1.8rem;
    height: 2.12rem;

    position: absolute;
    top: 1.42rem;
    right: 0.33rem;
  }

  .bottom-info {
    width: 3.96rem;
    height: 1.57rem;
    display: flex;
    align-items: center;

    position: absolute;
    top: 2.16rem;
    left: 0.33rem;

    .b-icon {
      width: 0.48rem;
      height: 0.48rem;
      flex-shrink: 0;
    }

    .rew-swiper {
      width: 4.08rem;
      overflow: hidden;
    }

    .rew-wrap {
      .rew {
        width: 1.24rem;
        height: 1.24rem;

        img {
          width: 0.88571rem;
          height: 0.88571rem;
          flex-shrink: 0;
          object-fit: contain;
        }
      }

      .text-wrap {
        width: 1.24rem;

        display: flex;
        justify-content: center;
        flex-direction: column;
        .text {
          color: #08810b;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }

  &.bInfo {
    flex-direction: column;
  }

  &.EG {
    .big-rew {
      right: unset;
      left: 0.33rem;
    }

    .bottom-info {
      left: unset;
      right: 0.33rem;
    }
  }
}
</style>
