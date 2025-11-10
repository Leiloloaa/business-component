<template>
  <div class="mico-reward-wrap">
    <div id="svgaImage"></div>

    <div class="title fc">
      <img :src="`//image.yoko.media/activity/202412_carnivalParty/mico-title.png`" alt="" />
      <span>{{ TOOL_TEXT[629] }}</span>
    </div>

    <div class="reward-wrap" :class="{ 'reward-wrap-more': rewardList?.length > 1 }">
      <Space :val="1.4" h />
      <div class="reward-content" v-if="rewardList?.length">
        <!-- <div class="reward-item" v-for="(item, index) in rewardList">
          <img :src="item.src" alt="" />
          <div class="count-wrap" v-bg="'corner'">
            <span>*{{ item.count }}</span>
          </div>
        </div> -->

        <div class="reward-item" v-for="item in rewardList">
          <Rew
            :reward="item?.rewardModel?.packageSpecificRewards?.[0] || {}"
            :options="{
              size: 'rew-mico', // 尺寸
              bgObj: {
                rew: 'rew',
                corner: 'corner'
                // coin: 'g-coin'
              },
              corner: true, // 角标
              name: false, // 奖励名称 麦圈
              coin: false, // 金币
              num: false, // 天数、数量
              effectFid: false, // 动图
              playIcon: false, // 展示播放按钮
              nameW: 1.22, // 奖励名称宽度
              nameH: 0.32, // 奖励名称高度
              useOutline: false, // 外边框
              outline: `0.05rem #022474`
            }"
          />
          <div class="rew-name fc">
            <img :src="`${ossUrl}/rew-name.png`" alt="" />
            <div class="rew-name-text fc">
              <span>{{ getRew(item?.rewardModel?.packageSpecificRewards?.[0])?.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <Space :val="0.8" h />
    </div>
    <!-- <div class="btn-wrap">
      <div class="btn" v-bg="'big-btn-act'" @click="confirm">{{ TOOL_TEXT[66] }}</div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import SVGA from 'svgaplayerweb'

const ossUrl = inject('ossUrl')
const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT } = injectTool()
const emit = defineEmits(['hide', 'confirm', 'toSpeed'])
const getRew = inject('getRew')
const props = defineProps({
  rewardList: {
    type: Object,
    default: () => ({})
  }
})

const toSpeed = () => {
  emit('toSpeed')
}

const confirm = () => {
  TOOL_BPFunc({ desc: 'Come again_button_click', action: 'click' })
  emit('confirm')
}

const initMachineSVGA = () => {
  let parser = new SVGA.Parser()
  let player = new SVGA.Player('#svgaImage')
  parser.load(
    'https://image.yoko.media/activity/202208_greedyCat/obtain-star.svga',
    function (videoItem) {
      player.loops = 0
      player.setVideoItem(videoItem)
      player.startAnimation()
    }
  )
}

onMounted(async () => {
  await nextTick()
  initMachineSVGA()
})
</script>

<style lang="scss" scoped>
.mico-reward-wrap {
  height: 7rem;

  .title {
    width: 7.5rem;
    height: 1.6rem;
    margin: 0 auto;

    position: absolute;
    top: 0rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 21;

    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 3.06rem;

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

      position: relative;
      z-index: 22;
    }

    img {
      width: 7.5rem;
      height: 1.6rem;

      position: absolute;
      top: 0rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 21;
    }
  }

  .reward-wrap {
    width: 7.5rem;
    height: 5rem;
    overflow-y: auto;
    margin-top: 2rem;

    position: relative;
    z-index: 20;

    display: flex;
    align-items: center;
    flex-direction: column;

    .reward-content {
      width: 6.5rem;

      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .reward-item {
        width: 1.6rem;
        height: 2.5rem;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        margin-left: 0.12rem;
        margin-right: 0.12rem;

        .rew-name {
          width: 1.6rem;
          height: 0.7rem;
          position: relative;

          img {
            width: 1.6rem;
            height: 0.7rem;

            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
          }

          .rew-name-text {
            width: 1.48rem;
            height: 0.52rem;
            margin-top: 0.14rem;

            span {
              color: #a72601;
              text-align: center;
              font-family: 'SF UI Text';
              font-size: 0.24rem;
              font-style: normal;
              font-weight: 300;
              line-height: 0.26rem; /* 108.333% */
            }
          }
        }
      }
    }
  }

  .btn-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    .btn {
      width: 3.72rem;
      height: 1.12rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9c0d0d;
      font-family: 'SF UI Text';
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 100% */
    }
  }

  .reward-wrap-more {
    height: 6rem;
    margin-top: 1.5rem;
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

    &::before {
      content: '';
      width: 5.13rem;
      height: 1.11rem;
      flex-shrink: 0;
      background-image: url('//image.hoko.media/activity/202412_carnivalParty/svga-star.png');

      position: absolute;
      top: 3rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
    }
  }
}
</style>
