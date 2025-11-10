<template>
  <!--  奖池奖励预览   -->
  <OssImg src="g-pool-bg" class="pool-swiper-wrap">
    <CommonSwiper
      class="swiper-container"
      :list="list"
      :swiper-options="swiperOptions"
      :arrow-config="{
        'name-start': 'lv-',
        'arr-width': 0.54,
        'arr-height': 0.54,
        'arr-top': 0.44,
        'arr-margin': 0
      }"
      swiper-id="pool-swiper"
      :allow-touch-move="false"
    >
      <template v-slot="{ item, index }">
        <div class="reward-wrap">
          <Rew
            :reward="item?.rewardModel?.packageSpecificRewards?.[0] || {}"
            :options="{
              size: 'rew-pool', // 尺寸
              bgObj: {
                rew: 'rew',
                corner: 'corner'
              },
              num: false,
              name: false,
              corner: true,
              coin: false,
              effectFid: false, // 动图
              playIcon: false, // 展示播放按钮
              nameW: 1.5, // 奖励名称宽度
              nameH: 0.32, // 奖励名称高度
              useOutline: false, // 外边框
              outline: `0.05rem #090F07`,
              nameNoScroll: false
            }"
          />
        </div>
      </template>
    </CommonSwiper>
  </OssImg>
</template>

<script lang="ts" setup name="GiftSwiperFrame">
import injectTool from '@publicComponents/injectTool'
import CommonSwiper from './Components/CommonSwiper.vue'

const { TOOL_countryCode, TOOL_TEXT, TOOL_httpClient, TOOL_loading, TOOL_BPFunc } = injectTool()

const ossUrl = inject('ossUrl')
const groupInfo: any = inject('groupInfo')

const props = defineProps({
  list: {
    type: Array,
    default: []
  }
})

// Swiper 配置
const swiperOptions = computed(() => {
  return {
    loop: false,
    speed: 2000,
    initialSlide: groupInfo.curIdx,
    slidesPerView: 3.5,
    // centeredSlides: itemCount === 2, // 当只有两个元素时启用居中
    autoplay: {
      delay: 1800,
      disableOnInteraction: false,
      reverseDirection: TOOL_countryCode == 'EG' ? true : false
    }
    // navigation: {
    //   nextEl: '.next',
    //   prevEl: '.prev'
    // }
  }
})

const list = computed(() => {
  return props?.list || [{}, {}, {}]
})
</script>

<style lang="scss" scoped>
.pool-swiper-wrap {
  width: 6.4rem;
  height: 2.87rem;
  flex-shrink: 0;
  margin-top: 0.65rem;

  position: relative;

  .pool-before {
    width: 6.4rem;
    height: 3.6rem;
    flex-shrink: 0;

    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .title {
    width: 4.42rem;
    height: 0.46rem;
    flex-shrink: 0;

    margin: 0 auto;
    margin-bottom: 0.33rem;

    background: linear-gradient(
      270deg,
      rgba(237, 138, 45, 0) 6.69%,
      #ff951c 49.89%,
      rgba(237, 138, 45, 0) 92.85%
    );

    color: #fff;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.26rem; /* 108.333% */
  }

  .swiper-container {
    width: 6.4rem;
    height: 1.6rem;
    position: relative;
    .reward-wrap {
      width: 1.6rem;
      height: 1.6rem;
      // display: flex;
      // flex-direction: column;
      // align-items: center;
      // justify-content: center;
    }
  }
}
</style>
