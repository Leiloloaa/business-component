<!--
  组件使用示例：
  <PoolSwiper :list="rewardList" />
  
  Props:
  - list: Array - 奖励列表数据
-->
<template>
  <div class="pool-swiper-wrap">
    <SwiperFrame
      class="swiper-container"
      :list="list"
      :swiper-options="swiperOptions"
      swiper-id="pool-swiper"
      :allow-touch-move="false"
    >
      <template v-slot="{ item, index }">
        <div class="reward-wrap">
          <div class="rew fc" v-bg="`rew`">
            <div class="desc fc" v-bg="`rew-desc`">
              <span>{{ getRew(item)?.num }}</span>
            </div>
            <cdnImg :info="item"></cdnImg>
          </div>
          <div class="rew-name">
            {{ getRew(item)?.name }}
          </div>
        </div>
      </template>
    </SwiperFrame>
  </div>
</template>

<script lang="ts" setup name="GiftSwiperFrame">
import injectTool from "@publicComponents/injectTool";
import { css } from "@publicComponents/shared";
import { inject } from "vue";

const ossUrl = inject("ossUrl");
const getRew = inject("getRew");
const { TOOL_countryCode, TOOL_TEXT } = injectTool();
const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
});
const appInfo: any = inject("page1Info");
// Swiper 配置
const swiperOptions = computed(() => {
  return {
    loop: false,
    speed: 2000,
    initialSlide: 0,
    slidesPerView: 3.2,
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
  width: 6rem;
  height: 2.02rem;

  position: relative;
  margin: 0 auto;
  margin-top: 0.1rem;

  .swiper-container {
    width: 6rem;
    height: 2.02rem;
    position: relative;
    margin: 0 auto;

    :deep(.swiper-slide) {
      width: 1.6rem;
    }
  }

  .reward-wrap {
    width: 1.6rem;
    height: 1.6rem;
    margin-left: 0.08rem;
    margin-right: 0.08rem;

    position: relative;
    .rew {
      width: 1.6rem;
      height: 1.6rem;
      position: relative;
      .desc {
        width: 0.96rem;
        height: 0.32rem;
        position: absolute;
        top: 0.11rem;
        right: 0;

        span {
          text-align: center;
          font-family: Arial;
          font-size: 0.26667rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.37333rem;
        }
      }

      img {
        width: 80%;
        height: 80%;
        object-fit: contain;
      }
    }
    .rew-name {
      margin-top: 0.08rem;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.34rem; /* 130.769% */
    }
  }
}
</style>
