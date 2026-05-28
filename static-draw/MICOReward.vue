<template>
  <div
    class="mico-reward-component-wrap mico-reward-component-wrap-normal"
    :class="{ 'mico-reward-component-wrap-one': rewardArray?.length == 1 }"
    @click="close"
  >
    <div class="video-bg-wrap">
      <AlphaVideo ref="micoRewardVideoRef" :start-src="startVideoSrc" :loop-src="loopVideoSrc" />
    </div>

    <!-- 标题 -->
    <div class="title fc">
      <img
        class="obg"
        :src="`//image.waka.media/activity/202412_carnivalParty/mico-title.png`"
        alt=""
      />
      <span>{{ TOOL_TEXT[629] }}</span>
    </div>

    <!-- 提示 -->
    <div v-if="hasTips" class="tips">
      <span class="text">{{ TOOL_TEXT[20] }}</span>
    </div>

    <div
      class="reward-wrap reward-wrap-normal"
      :class="{ 'reward-wrap-has-tips': hasTips, 'reward-wrap-one': rewardArray?.length == 1 }"
    >
      <div class="reward-content" v-if="rewardArray?.length">
        <!-- 奖励组件 -->
        <div class="picture-component" v-for="item in rewardArray" :key="item.id">
          <div class="picture-component-bg">
            <img class="obg" :src="`${ossUrl}/${prefix}rew.png`" alt="" />
          </div>

          <div class="picture-container">
            <cdnImg class="picture" :info="item"></cdnImg>
          </div>

          <div class="desc">
            <img class="obg" :src="`${ossUrl}/${prefix}rew-desc.png`" alt="" />
            <Outline :color="`0.05rem #e004bf`" :text="getRew(item)?.num" noColor />
          </div>

          <!-- <div class="bottom">
            <img class="obg" :src="`${ossUrl}/${prefix}mico-bottom.png`" alt="" />
            <Outline :color="`0.05rem #e004bf`" :text="getRew(item)?.num" noColor />
          </div> -->
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn">
      <img :src="`https://image.hoko.media/static/close.png`" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, nextTick, ref } from 'vue'
import injectTool from '@publicComponents/injectTool'
import AlphaVideo from '@components/AlphaVideo.vue'
import startVideoSrc from '@components/assets/reward-effects-start.mp4'
import loopVideoSrc from '@components/assets/reward-effects-loop.mp4'

const prefix = ''
const ossUrl = inject('ossUrl')
const close = inject('close')
const getRew: any = inject('getRew')
const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT } = injectTool()

const props = defineProps({
  rewardArray: {
    type: Object,
    default: () => []
  }
})

const hasTips = 0

console.log('props.rewardArray', props.rewardArray)

// 视频背景
const micoRewardVideoRef = ref<any>(null)
const playVideo = () => {
  micoRewardVideoRef.value?.play()
}

onMounted(async () => {
  await nextTick()
  playVideo()
})
</script>

<style lang="scss" scoped>
.mico-reward-component-wrap {
  min-height: 3.36rem;
  padding-bottom: 0.38rem; // 增加关闭按钮的高度

  &.mico-reward-component-wrap-one {
  }

  // AlphaVideo 作为背景：绝对定位、铺满、不拦截点击
  .video-bg-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    width: 7.5rem;
    height: 1.6rem;

    margin: 0 auto;
    margin-top: 0.02rem;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;

    span {
      width: 5.06rem;

      background: linear-gradient(180deg, #faf6a1 26.68%, #f7c959 85.27%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      text-align: center;
      font-family: Arial;
      font-size: 0.42rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.52rem;
    }
  }

  .tips {
    width: 7.5rem;
    min-height: 0.32rem;

    margin: 0 auto;
    margin-top: -0.2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    span {
      color: #fff;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */
    }
  }

  .reward-wrap {
    width: 6.5rem;
    min-height: 2.4rem;
    height: 70vh;

    overflow-x: hidden;
    overflow-y: auto;

    margin: 0 auto;
    margin-top: 0rem;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    position: relative;
    z-index: 20;

    .reward-content {
      width: 6rem;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;

      .picture-component {
        margin: 0 0.12rem;
        margin-bottom: 0.26rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;

        .picture-component-bg {
          width: 1.68rem;
          height: 1.68rem;
          position: relative;
        }

        .picture-container {
          width: 1.1rem;
          height: 1.1rem;
          flex-shrink: 0;

          display: flex;
          justify-content: center;
          align-items: center;

          position: absolute;
          top: 0.32rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;

          .picture {
            width: 80%;
            height: 80%;
            flex-shrink: 0;
            object-fit: contain;
          }
        }

        .desc {
          width: 1.04rem;
          height: 0.32rem;
          flex-shrink: 0;

          display: flex;
          justify-content: center;
          align-items: center;

          position: absolute;
          top: 0rem;
          right: 0rem;
          z-index: 3;

          span {
            color: #c74200;
            text-align: center;
            font-family: 'SF UI Text';
            font-size: 0.2rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
        }

        .bottom {
          width: 1.6rem;
          height: 0.7rem;
          flex-shrink: 0;

          margin-top: 0.04rem;

          display: flex;
          justify-content: center;
          align-items: center;

          position: relative;

          span {
            margin-top: 0.12rem;

            color: #fff;
            text-align: center;
            font-family: Arial;
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.26rem; /* 108.333% */
          }
        }
      }
    }
  }

  .reward-wrap-one {
    .reward-content {
      .picture-component {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;

        .picture-component-bg {
          width: 3.36rem;
          height: 3.36rem;
          position: relative;
        }

        .picture-container {
          width: 2.688rem;
          height: 2.688rem;
          flex-shrink: 0;

          display: flex;
          justify-content: center;
          align-items: center;

          position: absolute;
          top: 0.34rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;

          .picture {
            width: 80%;
            height: 80%;
            flex-shrink: 0;
            object-fit: contain;
          }
        }

        .desc {
          width: 2.184rem;
          height: 0.672rem;
          flex-shrink: 0;

          display: flex;
          justify-content: center;
          align-items: center;

          position: absolute;
          top: 0rem;
          right: 0rem;
          z-index: 3;

          span {
            color: #c62800;
            font-family: Roboto;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 500;
            line-height: 0.32rem; /* 100% */
          }
        }

        .bottom {
          width: 2.88rem;
          height: 1.28rem;
          flex-shrink: 0;

          margin-top: 0.18rem;

          display: flex;
          justify-content: center;
          align-items: center;

          position: relative;

          span {
            margin-top: 0.12rem;

            color: #fff;
            text-align: center;
            font-family: 'SF UI Text';
            font-size: 0.4rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.4rem; /* 100% */
          }
        }
      }
    }
  }

  .reward-wrap-has-tips {
    margin-top: 0.33rem;
  }

  .btn {
    width: 0.72rem;
    height: 0.72rem;
    flex-shrink: 0;

    margin: 0 auto;
    margin-top: 0.32rem;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;

    img {
      width: 0.72rem;
      height: 0.72rem;
      flex-shrink: 0;
      object-fit: contain;
    }
  }

  #svgaImage {
    position: absolute;
    width: 7.5rem;
    height: 14rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    direction: ltr;

    .svgaImage-bg {
      width: 5.13rem;
      height: 1.11rem;
      flex-shrink: 0;

      position: absolute;
      top: 3rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
    }
  }
}
</style>
