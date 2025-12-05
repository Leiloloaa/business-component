<template>
  <div class="header-image">
    <div class="quality-static" v-show="quality == 'low' || quality == 'high'">
      <img
        v-show="quality == 'low'"
        class="head head-static head-static-low"
        :src="_pic('low')"
        alt=""
      />
      <img
        v-show="quality == 'high'"
        class="head head-static head-static-high"
        :src="_pic('high')"
        alt=""
      />
    </div>

    <div class="quality-dynamic" v-if="props.useVideo">
      <video
        ref="videoElement"
        id="myVideo"
        :src="_pic('mp4')"
        class="head-dynamic head-dynamic-video"
        :class="{ 'video-visible': quality == 'dynamic' }"
        autoplay
        loop
        muted
        preload="true"
        x5-video-player-type="h5"
        x5-playsinline
        playsinline
        webkit-playsinline
        x5-video-player-fullscreen="false"
        @canplay="onVideoCanPlay"
        @error="onVideoError"
      ></video>
    </div>
  </div>
</template>

<script lang="ts" setup name="Head">
import injectTool from '@publicComponents/injectTool'

const props = defineProps({
  useVideo: {
    // 是否使用视频头图
    type: Boolean,
    default: true
  }
})

const ossUrl = inject('ossUrl')
const { TOOL_countryCode } = injectTool()
const quality = ref('low')
const enList = ['PK', 'BD', 'ID', 'MY']
const titleLang = enList?.includes(TOOL_countryCode) ? 'EN' : TOOL_countryCode
const useHiyoo = false // yoho 和 hiyoo 活动共用，头图区分

const _pic = (quality: string) => {
  const headName = `head-mainvenue-${titleLang}`
  const PJName = PROJECT == 2 ? (useHiyoo ? '-hiyoo' : '') : ''
  const notWebp = '?x-oss-process=image/format,png/resize,m_lfit,w_27,h_67'
  switch (quality) {
    case 'low':
      return `${ossUrl}/${headName}${PJName}.png${notWebp}` //  低质量静态图
    case 'high':
      return `${ossUrl}/${headName}${PJName}.png` //  高质量静态图
    case 'mp4':
      return `${ossUrl}/${headName}${PJName}.mp4` //  mp4
  }
}

let timer1, timer2

// 缓存键
const videoCacheKey = `2025-mainvenue-VideoDone-${titleLang}`
const highImageCacheKey = `2025-mainvenue-HighImageDone-${titleLang}`

// 检查缓存
const isVideoCached = computed(() => localStorage.getItem(videoCacheKey) == 'true')
const isHighImageCached = computed(() => localStorage.getItem(highImageCacheKey) == 'true')

// 视频加载状态
const videoLoaded = ref(false)
const highImageLoaded = ref(false)

// 视频加载完成
const onVideoCanPlay = () => {
  if (videoLoaded.value || !props.useVideo) return
  console.log('Video 加载完成.')
  videoLoaded.value = true

  // 延迟 1.5s 后显示视频
  timer1 = setTimeout(() => {
    console.log('显示视频')
    quality.value = 'dynamic'
    localStorage.setItem(videoCacheKey, 'true')
  }, 1500)
}

const onVideoError = () => {
  if (videoLoaded.value) return
  console.log('video加载失败.')
}

// 开始播放视频的方法
const startPlay = () => {
  if (!props.useVideo) return
  timer1 = setTimeout(() => {
    console.log('显示视频')
    quality.value = 'dynamic'
  }, 1500)
}

// 高清图加载完成
const onHighImageLoad = () => {
  if (highImageLoaded.value) return
  console.log('高清图加载完成.', new Date().getTime())
  highImageLoaded.value = true

  // 隐藏低质量图，显示高清图
  timer2 = setTimeout(() => {
    console.log('隐藏低质量图，显示高清图.', new Date().getTime())
    quality.value = 'high'
    localStorage.setItem(highImageCacheKey, 'true')
  }, 100)
}

onMounted(() => {
  // 逻辑3: 如果有缓存，直接使用缓存
  if (isVideoCached.value && props.useVideo) {
    console.info('使用视频缓存')
    quality.value = 'dynamic'
    videoLoaded.value = true
    return
  }

  if (isHighImageCached.value) {
    console.info('使用高清图缓存')
    quality.value = 'high'
    highImageLoaded.value = true
    return
  }

  // 逻辑1和2: useVideo 为 true 时，加载低质量图片，同时加载高清图和视频
  if (props.useVideo) {
    console.info('开始加载高清图和视频')

    // 加载高清图
    const img = new Image()
    img.src = _pic('high')
    img.onload = onHighImageLoad
    img.onerror = () => {
      console.log('高清图加载失败')
    }

    // 视频会在模板中自动加载，通过 @canplay 事件处理
  } else {
    // 如果 useVideo 为 false，只加载高清图
    const img = new Image()
    img.src = _pic('high')
    img.onload = onHighImageLoad
    img.onerror = () => {
      console.log('高清图加载失败')
    }
  }
})

onBeforeUnmount(() => {
  clearTimeout(timer1)
  clearTimeout(timer2)
})

defineExpose({
  video2CanPlay: videoLoaded,
  startPlay
})
</script>

<style lang="scss" scoped>
.header-image {
  width: 7.5rem;
  height: 13.34rem;

  position: relative;

  .head {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .quality-static {
    .head-static-low {
      z-index: 13;
    }

    .head-static-high {
      z-index: 12;
    }
  }

  .quality-dynamic {
    width: 100%;
    height: 100%;

    .head-dynamic {
      z-index: 2;
    }

    .head-dynamic-video {
      width: 100%;
      opacity: 0;
      transition: opacity 0.3s;

      &.video-visible {
        opacity: 1;
      }
    }
  }
}
</style>
