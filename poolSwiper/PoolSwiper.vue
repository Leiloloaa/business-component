<!--
  组件使用示例：
  <PoolSwiper :list="rewardList" />
  
  Props:
  - list: Array - 奖励列表数据
-->
<template>
  <div v-bg="`p2-pool-avatar`" class="pool-swiper-wrap">
    <div class="title fc" v-bg="`p2-pool-avatar-title`">
      <Outline
        :color="1 ? '0.05rem #3B18FF' : '0.05rem #581604'"
        :text="
          TOOL_TEXT[59]
            ?.replace('%s', groupInfo.curIdx + 1)
            ?.replace('s%', groupInfo.curIdx + 1)
        "
        :noColor="false"
      />
    </div>

    <SwiperFrame
      class="swiper-container"
      :list="groupInfo.poolList"
      :swiper-options="swiperOptions"
      swiper-id="pool-swiper"
      :allow-touch-move="false"
    >
      <template v-slot="{ item, index }">
        <div class="reward-wrap fcc">
          <OptA
            :data="item || {}"
            :option="{
              styles: css`
                width: 1.32rem;
                height: 1.32rem;
                aspect-ratio: 1/1;
              `,
              adorns: [
                {
                  img: 'a',
                  styles: `width: 100%; height:100%;`,
                },
              ],
              avatar: css`
                width: 0.9856rem;
                height: 0.9856rem;
              `,
              live: css`
                width: 0.41rem;
                height: 0.24rem;
                bottom: 0.2rem;
              `,
              liveIcon: `width: 0.18rem;`,
            }"
          />
          <Outline
            class="ov"
            :color="1 ? '0.05rem #581604' : '0.05rem #581604'"
            :text="item.name || '--'"
            noColor
          />
        </div>
      </template>
    </SwiperFrame>
  </div>
</template>

<script lang="ts" setup name="GiftSwiperFrame">
import injectTool from "@publicComponents/injectTool";
import { css } from "@publicComponents/shared";

const { TOOL_countryCode, TOOL_TEXT } = injectTool();
const groupInfo: any = inject("groupInfo");
const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
});

// Swiper 配置
const swiperOptions = computed(() => {
  return {
    loop: false,
    speed: 2000,
    initialSlide: groupInfo.curIdx,
    slidesPerView: 3,
    autoplay: {
      delay: 1800,
      disableOnInteraction: false,
      reverseDirection: TOOL_countryCode == "EG" ? true : false,
    },
  };
});
</script>

<style lang="scss" scoped>
.pool-swiper-wrap {
  width: 6.93rem;
  height: 3.88rem;
  flex-shrink: 0;
  margin-top: -1.2rem;
  margin-bottom: -0.15rem;

  position: relative;

  .title {
    width: 3.2rem;
    height: 0.54rem;

    margin: 0 auto;
    margin-top: 0.55rem;

    span {
      color: #fff;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #3b18ff;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .tip {
    margin: 0 auto;
    margin-top: 0.16rem;
    color: #fff;
    font-family: "SF UI Text";
    font-size: 0.26rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
  }

  .swiper-container {
    width: 5.61rem;
    height: 100%;
    position: relative;
    margin: 0 auto;
    margin-top: 0.13rem;

    :deep(.swiper-slide) {
      width: 1.76rem;
    }

    .reward-wrap {
      width: 1.76rem;

      span {
        color: #fff;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
      }
    }
  }
}
</style>
