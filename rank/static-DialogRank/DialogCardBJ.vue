<template>
  <!-- info.idx 从 1 开始 -->
  <OssImg src="d-card" class="d-card">
    <!-- <Space :val="0.32" />
    <div class="left">
      <div class="timer">
        {{ dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </div>
      <div class="num">
        <cdnImg :fid="info.packageSpecificRewards?.[0]?.fid"></cdnImg>
        <Space :val="0.24" />
        {{ getRew(info.packageSpecificRewards?.[0])?.num }}
      </div>
    </div>
    <Space :val="0.25" />
    <img :src="`${ossUrl}/box-${info.type}.png`" alt="" class="box" />
    <Space :val="0.62" /> -->

    <div class="up">
      {{ dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss') }}
    </div>
    <div class="down">
      <cdnImg :fid="info.packageSpecificRewards?.[0]?.fid"></cdnImg>
      <Space :val="0.08" />
      <span>{{ getRew(info.packageSpecificRewards?.[0])?.num }}</span>
    </div>
  </OssImg>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import dayjs from 'dayjs'

const props = withDefaults(
  defineProps<{
    info: any
    isUser?: boolean
    type?: number // card 类型，不同背景
  }>(),
  { isUser: false }
)

const { TOOL_countryCode } = injectTool()
const ossUrl = inject('ossUrl')
const getRew = inject('getRew')

const isTop3 = computed(() => {
  return Number(props.info.idx) <= 3
})

const isDailyRank = computed(() => {
  return props.info.selDate != 999
})

const option = {
  w: 0.88,
  h: 0.88,
  adorns: [
    {
      img: 'avatar',
      w: '100%',
      h: '100%',
      'z-index': '-1'
    }
  ],
  avatar: {
    w: 0.84,
    h: 0.84
  },
  live: {
    bottom: 0,
    w: 0.8,
    h: 0.28
  },
  liveIcon: {
    w: 0.29
  }
}
</script>

<style lang="scss" scoped>
.d-card {
  width: 5.36rem;
  height: 1.52rem;

  margin: 0 auto;
  margin-bottom: 0.08rem;
  // background-color: #fbf9ff;
  border-radius: 0.08rem;
  position: relative;
  padding-top: 0.42rem;
  padding-left: 0.32rem;

  .up {
    width: 3.96rem;

    color: #fff0cc;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.24rem; /* 100% */
  }

  .down {
    margin-top: 0.16rem;

    display: flex;
    img {
      width: 0.48rem;
      height: 0.48rem;
      flex-shrink: 0;
      object-fit: contain;
    }

    span {
      color: #fff0cc;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 300;
      line-height: 0.4rem; /* 166.667% */
    }
  }

  .left {
    width: 3.96rem;
  }

  .box {
    width: 0.83719rem;
    height: 0.92932rem;
  }

  .timer {
    color: #371c50;

    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.4rem;
    /* 166.667% */
  }

  .num {
    display: flex;
    align-items: center;

    color: #371c50;

    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.4rem;
    /* 166.667% */

    img {
      width: 0.6rem;
      height: 0.6rem;
      object-fit: contain;
    }
  }
}
</style>
