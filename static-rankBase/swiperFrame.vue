<template>
  <div class="common-swiper-wrap">
    <Swiper
      :id="swiperId"
      class="swiper-container"
      :loop="swiperOptions.loop"
      :speed="swiperOptions.speed"
      :autoplay="swiperOptions.autoplay"
      :navigation="swiperOptions.navigation"
      :initialSlide="swiperOptions.initialSlide"
      :slidesPerView="swiperOptions.slidesPerView"
      :spaceBetween="swiperOptions.spaceBetween"
      @slideChange="handleSlideChange"
      :allowTouchMove="allowTouchMove"
    >
      <SwiperSlide
        class="swiper-slide-self"
        v-for="(item, index) in list"
        :key="index"
        v-bind="{}"
      >
        <slot :item="item" :index="index" />
      </SwiperSlide>
    </Swiper>

    <template v-if="swiperOptions.navigation?.prevEl">
      <!-- 导航按钮 -->
      <div
        v-show="canShowPrev"
        v-bg="arrowConfig['name-start'] + 'l'"
        class="swiper-btn prev"
        :style="{
          display: 'block',
          width: arrowConfig['arr-width'] + 'rem',
          height: arrowConfig['arr-height'] + 'rem',
          top: arrowConfig['arr-top'] + 'rem',
          left: arrowConfig['arr-margin'] + 'rem',
          objectFit: 'contain',
        }" />
      <div
        v-show="canShowNext"
        v-bg="arrowConfig['name-start'] + 'r'"
        class="swiper-btn next"
        :style="{
          display: 'block',
          width: arrowConfig['arr-width'] + 'rem',
          height: arrowConfig['arr-height'] + 'rem',
          top: arrowConfig['arr-top'] + 'rem',
          right: arrowConfig['arr-margin'] + 'rem',
          objectFit: 'contain',
        }"
    /></template>
  </div>
</template>

<script lang="ts" setup name="SwiperFrame">
import injectTool from "@publicComponents/injectTool";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
SwiperCore.use([Navigation, Pagination, Autoplay]);

const { TOOL_countryCode } = injectTool();

// Props
const props = defineProps({
  // 数据列表
  list: {
    type: Array,
    default: () => [],
  },
  // Swiper 配置选项
  swiperOptions: {
    type: Object,
    default: () => ({
      loop: false,
      speed: 1000,
      initialSlide: 0,
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: false,
      navigation: {
        nextEl: ".next",
        prevEl: ".prev",
      },
    }),
  },
  // Swiper 实例 ID
  swiperId: {
    type: String,
    default: "common-swiper",
  },
  // 当前索引（用于控制导航按钮显示）
  currentIndex: {
    type: Number,
    default: 0,
  },
  // 箭头配置
  arrowConfig: {
    type: Object,
    default: () => {
      return {
        "name-start": "g-arr-",
        "arr-width": 0.54,
        "arr-height": 0.54,
        "arr-top": 50,
        "arr-margin": 0.08,
      };
    },
  },
  allowTouchMove: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["slideChange"]);

// 计算属性
const canShowPrev = computed(() => {
  console.log("props.currentIndex", props.currentIndex);
  return props.currentIndex != 0;
});

const canShowNext = computed(() => {
  return props.currentIndex < props.list.length - 1;
});

// 方法
const handleSlideChange = (swiper: any) => {
  emit("slideChange", {
    realIndex: swiper.realIndex,
    activeIndex: swiper.activeIndex,
    swiper,
  });
};
</script>

<style lang="scss" scoped>
.common-swiper-wrap {
  width: 100%;
  height: 100%;
  position: relative;

  .swiper-container {
    width: 100%;
    height: 100%;
    position: relative;

    .swiper-slide-self {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .swiper-btn {
    position: absolute;
    z-index: 3;
  }
}
</style>
