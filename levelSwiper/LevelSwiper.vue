<template>
  <div class="lv-swiper-wrap">
    <!-- 等级背景 -->
    <!-- <div v-bg="`g-lv${groupInfo.curIdx}-bg`" class="g-lv-bg" tag="img" /> -->

    <CommonSwiper
      class="swiper-container-wrap"
      :list="groupInfo?.list || ['', '', '', '']"
      :swiper-options="swiperOptions"
      :current-index="groupInfo.curIdx"
      :arrow-config="{
        'name-start': 'lv-',
        'arr-width': 0.64,
        'arr-height': 0.64,
        'arr-top': 2.48,
        'arr-margin': 0,
      }"
      swiper-id="level-swiper"
      :allow-touch-move="true"
      @slide-change="handleSlideChange"
    >
      <template #default="{ item, index }">
        <!-- 等级说明 -->
        <div class="g-inner-tip">
          <!-- <span>{{ TOOL_TEXT[54] }}</span> -->
        </div>

        <!-- 等级图 -->
        <!-- <div
          v-bg="`g-lv${
            false
              ? groupInfo.status == -1
                ? '--1'
                : groupInfo.curLevel >= item
                ? '-1'
                : '-0'
              : index + 1
          }`"
          class="g-lv"
          tag="img"
        ></div> -->

        <!-- 按钮和文字 -->
        <!-- <div
            v-bg="`g-btn`"
            class="tip-lock fc"
            v-if="groupInfo.status == -1 || item > groupInfo.curLevel"
          >
            <span class="tip" v-if="groupInfo.status == -1">{{ TOOL_TEXT[608] }}</span>
            <div v-bg="`g-lock`" class="lock" tag="img" v-else />
          </div> -->

        <!-- 纯图 lock -->
        <!-- <div
          v-bg="`g-lock`"
          class="g-lock"
          tag="img"
          v-if="groupInfo.status == -1 || item > groupInfo.curLevel"
        /> -->

        <!-- 其它 -->
        <!-- <div class="g-desc">
          <div class="tip fc">
            <Outline :color="1 ? '0.05rem #022751' : '0.05rem #581604'" :text="TOOL_TEXT[57]" />
          </div>
        </div> -->

        <Progress />
      </template>
    </CommonSwiper>

    <div
      v-bg="`to-send`"
      class="to-send fc breath"
      @click="toGiftPanel({ giftId: page1.jumpGift })"
    >
      <span>{{ TOOL_TEXT[56] }}</span>
    </div>

    <!-- <Dialog v-model="showRecord" :frame="false">
      <DialogRank />
    </Dialog> -->
  </div>
</template>

<script lang="ts" setup name="GiftSwiperFrame">
import injectTool from "@publicComponents/injectTool";
import CommonSwiper from "./Public/CommonSwiper.vue";
import Progress from "./Progress.vue";
import DialogRank from "./Draw/DialogRank.vue";
import PoolSwiper from "./PoolSwiper.vue";
import useGiftPanel from "./hooks/useGiftPanel";

const { toGiftPanel } = useGiftPanel();

const {
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_BPFunc,
  TOOL_toast,
  TOOL_NUM,
  TOOL_loading,
} = injectTool();

const groupInfo: any = inject("groupInfo");

const showRecord = ref(false);
const showRecordDialog = () => {
  showRecord.value = true;
};

// Swiper 配置
const swiperOptions = reactive({
  loop: false,
  speed: 1000,
  initialSlide: 0,
  slidesPerView: 1,
  navigation: {
    nextEl: ".next",
    prevEl: ".prev",
  },
});

const flag = ref(false);
watch(
  () => groupInfo.curIdx,
  async (newVal) => {
    if (flag.value) return;
    await nextTick();
    const mySwiper: any = document?.querySelector(`#level-swiper`)?.swiper;
    setTimeout(() => {
      if (mySwiper) {
        mySwiper?.slideTo(groupInfo.curIdx, 300);
        groupInfo.curIdx = groupInfo.curIdx;
      }
    }, 600);
  },
  { immediate: true }
);

const handleSlideChange = (data: any) => {
  groupInfo.curIdx = data.realIndex;
  console.log("data.realIndex", data.realIndex);
};
</script>

<style lang="scss" scoped>
.lv-swiper-wrap {
  width: 7.5rem;
  height: 9.35rem;

  position: relative;

  .to-send {
    width: 3.1rem;
    height: 0.9rem;
    flex-shrink: 0;
    margin: 0 auto;
    margin-top: -1.2rem;

    position: relative;
    z-index: 20;

    span {
      color: #fff;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem; /* 115.385% */
    }
  }

  .g-inner-tip {
    width: 6.2rem;

    position: absolute;
    top: 0.54rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;

    span {
      color: #3a0400;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem; /* 125% */
    }
  }

  .g-lv-bg {
    width: 7.5rem;
    height: 7.34rem;
    flex-shrink: 0;
    position: absolute;
    top: 1.79rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .swiper-container-wrap {
    width: 100%;
    height: 100%;

    position: relative;
    z-index: 10;

    // ::v-deep(.swiper-container) {
    //   overflow: unset !important;
    // }

    .g-lv {
      width: 4.4rem;
      height: 4.4rem;
      flex-shrink: 0;

      margin-top: 1.19rem;
      position: relative;
      z-index: 2;
    }

    .g-lock {
      width: 6.63rem;
      height: 5rem;
      flex-shrink: 0;

      position: absolute;
      top: 0em;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    .g-desc {
      width: 7.5rem;
      height: 2.58rem;
      flex-shrink: 0;

      position: absolute;
      top: 6.47rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;

      border-radius: 0.2rem;
      background: linear-gradient(
        90deg,
        rgba(3, 54, 104, 0.3) 0%,
        rgba(23, 3, 103, 0.3) 50.96%,
        rgba(3, 54, 104, 0.3) 100%
      );

      .tip {
        padding-top: 0.16rem;

        span {
          color: #fffeb2;
          text-align: center;
          -webkit-text-stroke-width: 1px;
          -webkit-text-stroke-color: #022751;
          font-family: "SF UI Text";
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 500;
          line-height: 0.32rem; /* 114.286% */
          letter-spacing: -0.001rem;
        }
      }
    }

    .tip-lock {
      width: 3.2rem;
      height: 1.2rem;
      flex-shrink: 0;

      position: absolute;
      top: 4.68rem;
      left: 50%;
      transform: translateX(-50%);

      .lock {
        width: 0.56rem;
        height: 0.64rem;
      }

      .tip {
        span {
          color: #fffeb2;
          text-align: center;
          -webkit-text-stroke-width: 1px;
          -webkit-text-stroke-color: #022751;
          font-family: "SF UI Text";
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 500;
          line-height: 0.32rem; /* 114.286% */
          letter-spacing: -0.001rem;
        }
      }
    }
  }
}
</style>
