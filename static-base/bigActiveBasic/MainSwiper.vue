<template>
  <div class="swiper-bg">
    <Swiper
      v-bind="swiperOptions"
      class="swiper-box"
      @swiper="onSwiper"
      @touchEnd="onTouchEnd"
      @transitionEnd="onTransitionEnd"
      @setTranslate="onSetTranslate"
    >
      <template class="swiper-wrapper" v-for="(item, index) in tabList" :key="index">
        <Swiper-slide>
          <div class="tab-item-wrap">
            <img
              class="venue"
              :src="`${ossUrl}/swiper-${item.icon}.png`"
              :data-normal="`${ossUrl}/swiper-${item.icon}.png`"
              :data-act="`${ossUrl}/swiper-${item.icon}-act.png`"
            />

            <!-- 名称按钮 -->
            <div class="name-btn">
              <Outline color="0.05rem #C40789" class="name-text" :text="TOOL_TEXT[item.text]" />
            </div>

            <!-- 日期 -->
            <div class="date-wrap">
              <span class="date-text">
                {{ formatShowDate(headPicData[item.showTimeKey]) || '' }}
              </span>
            </div>
          </div>
        </Swiper-slide>
      </template>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onUnmounted, computed, onMounted, watch, reactive } from 'vue'
import injectTool from '@publicComponents/injectTool'
import { useRoute, useRouter } from 'vue-router'

import SwiperCore, { Autoplay, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
SwiperCore.use([Autoplay, Navigation])

const ARC_CONFIG = {
  opacity: { active: 1, inactive: 1 },
  venueSize: { active: 2.5, inactive: 2.2 }
}

const lerp = (progress: number, { active, inactive }: { active: number; inactive: number }) =>
  active + (inactive - active) * Math.min(Math.abs(progress), 1)

const updateSlideStyle = (slide: any, isActive: boolean) => {
  const progress = slide.progress || 0
  const wrap = slide.querySelector('.tab-item-wrap')
  if (!wrap) return

  wrap.style.opacity = `${lerp(progress, ARC_CONFIG.opacity)}`

  const size = `${lerp(progress, ARC_CONFIG.venueSize)}rem`
  slide.classList.toggle('is-center', isActive)
  wrap.querySelectorAll('.venue').forEach((v: HTMLImageElement) => {
    v.style.width = size
    v.style.height = size
    const target = isActive ? v.dataset.act : v.dataset.normal
    if (target && v.getAttribute('src') !== target) v.setAttribute('src', target)
  })
}

const updateAllSlides = (swiper: any) => {
  // 找出视觉最居中的 slide（progress 绝对值最小），作为激活项（loop 模式 swiper-slide-active 可能不在居中项）
  let centerSlide: any = null
  let min = Infinity
  swiper.slides.forEach((s: any) => {
    const p = Math.abs(s.progress || 0)
    if (p < min) {
      min = p
      centerSlide = s
    }
  })
  swiper.slides.forEach((s: any) => updateSlideStyle(s, s === centerSlide))
}

const getJumpLink = (activityName: string, countryCode: string) => {
  const { origin, hostname } = window.location
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
  const real_activityName = PROJECT == 2 ? 'activity-vite/' + activityName : activityName
  let link = ''
  if (isLocal) {
    const localOrigin =
      'https://activity-h5-test.' + (PROJECT == 1 ? 'yoho' : 'chatchill') + '.media'
    link = `${localOrigin}/${real_activityName}/index.html?lang=${countryCode}`
  } else {
    link = `${origin}/${real_activityName}/index.html?lang=${countryCode}`
  }
  return link
}

const swiperOptions = {
  loop: true,
  centeredSlides: true,
  slidesPerView: 3,
  spaceBetween: 0,
  speed: 300,
  slideToClickedSlide: true,
  watchSlidesProgress: true,
  autoplay: false,
  initialSlide: 0,
  allowTouchMove: true
}

const route = useRoute()
const router = useRouter()
const ossUrl = inject('ossUrl')
const { TOOL_TEXT, TOOL_countryCode, TOOL_toast, TOOL_BPFunc, TOOL_httpClient } = injectTool()
const testFamilyTab = ENV != 'build'
  ? [
      {
        icon: 'family-icon',
        permission: 'familyStatus',
        showTimeKey: 'familyShowTime',
        route: 'family',
        text: 6,
        outerLink: ''
      }
    ]
  : []

// inner: 内部会场, outer: 外部会场；hideArea 配置需隐藏的大区
const VENUE_LIST = [
  {
    icon: 'family-icon',
    permission: 'familyStatus',
    showTimeKey: 'familyShowTime',
    route: 'family',
    text: 6,
    outerLink: '',
    hideArea: ['TW']
  },
  {
    icon: 'guild-icon',
    permission: 'unionStatus',
    showTimeKey: 'unionShowTime',
    route: 'union',
    text: 11,
    outerLink: '',
    hideArea: ['TW']
  },
  {
    icon: 'cp-icon',
    permission: 'cpStatus',
    showTimeKey: 'cpShowTime',
    route: 'cp',
    text: 7,
    outerLink: '',
    hideArea: []
  },
  {
    icon: 'kq-icon',
    permission: 'kingQueenStatus',
    showTimeKey: 'kingQueenShowTime',
    route: 'kingQueen',
    text: 9,
    outerLink: '',
    hideArea: []
  }
]

// 本地 10.* 本地开发域名临时放开 family 入口，方便本地开发调试。
const isLocalTestDomain = ENV != 'build' && window.location.hostname.startsWith('10.')

const tabList = computed(() =>
  VENUE_LIST.filter((item) => {
    if (item.route === 'family' && isLocalTestDomain) return true
    return !item.hideArea.includes(TOOL_countryCode)
  })
)

const swiperInstance = ref<any>(null)
// 是否由用户主动滑动/点击触发（初始化、redirect、程序化定位不应跳转）
const userTriggered = ref(false)
// 首次进入激活样式兜底校正定时器
let activeStyleTimer: ReturnType<typeof setTimeout> | null = null

// 安全刷新激活样式（组件卸载/实例销毁后不执行）
const refreshActiveStyle = (swiper: any) => {
  if (!swiper || swiper.destroyed) return
  updateAllSlides(swiper)
}

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
  // 初始化定位到当前路由对应的会场，避免组件 remount 后 onTransitionEnd 跳到默认居中会场
  const matched = tabList.value.find((item) => route.path.includes(item.route))
  if (matched) {
    const index = tabList.value.findIndex((item) => item.route === matched.route)
    if (index !== -1) swiper.slideToLoop(index, 0)
  }
  // 定位完成后再刷新，确保激活样式按「定位后」的居中项计算
  refreshActiveStyle(swiper)
  // 下一帧 + 1s 兜底校正，避免首次进入卡在非激活/激活中间态
  requestAnimationFrame(() => refreshActiveStyle(swiper))
  if (activeStyleTimer) clearTimeout(activeStyleTimer)
  activeStyleTimer = setTimeout(() => refreshActiveStyle(swiper), 1000)
}

const onTouchEnd = () => {
  userTriggered.value = true
}

const onSetTranslate = (swiper: any) => {
  updateAllSlides(swiper)
}

const onTransitionEnd = (swiper: any) => {
  // 动画结束后刷新一次，确保居中会场的激活样式/图片最终状态正确
  updateAllSlides(swiper)

  // 只有用户主动滑动/点击才跳转；初始化、redirect、程序化定位触发的一律忽略
  if (!userTriggered.value) return
  userTriggered.value = false

  const targetRoute = tabList.value[swiper.realIndex]?.route
  const permission = tabList.value[swiper.realIndex]?.permission
  const showTimeKey = tabList.value[swiper.realIndex]?.showTimeKey
  const outerLink = tabList.value[swiper.realIndex]?.outerLink

  // 已经在该会场，不重复跳转
  if (targetRoute && route.path.includes(targetRoute)) return

  if (headPicData[permission] == -1) {
    // 未开始
    const showTime = headPicData[showTimeKey]
    const s = showTime?.start ? new Date(showTime.start) : null
    const dateStr = s ? `${s.getMonth() + 1}/${s.getDate()}` : ''
    TOOL_toast({ text: `${TOOL_TEXT[608] || ''} ${dateStr}` })
    return
  }

  // 已开始、已结束
  if (outerLink) {
    // 外部会场
    const link = getJumpLink(outerLink, TOOL_countryCode)
    location.href = link
  } else {
    // 内部会场
    router.replace({ name: targetRoute })
  }

  // ========== 埋点 ==========
  TOOL_BPFunc({ desc: `${permission}_venue`, action: 'click' }) // 主会场
}

// ==================== 暴露方法 ====================
// 滑动到指定会场
const slideToVenue = (venueName: string) => {
  const index = tabList.value.findIndex((item) => item.route === venueName)
  if (index !== -1 && swiperInstance.value) {
    swiperInstance.value.slideToLoop(index, 0)
  }
}
defineExpose({ slideToVenue })

watch(
  () => route.path,
  (path) => {
    // 如果active图标不是当前会场，则滑动到当前会场
    const matched = tabList.value.find((item) => path.includes(item.route))
    if (!matched || !swiperInstance.value) return
    const targetIndex = tabList.value.findIndex((item) => item.route === matched.route)
    if (targetIndex !== swiperInstance.value.realIndex) {
      slideToVenue(matched.route)
    }
  }
)

const headPicData = reactive<any>({})

// 默认会场：按 VENUE_LIST 顺序取「最后一个」permission 为 1（已开启）的会场
// 例：family+union 都为 1 → union；family+union+cp 都为 1 → cp
const resolveDefaultVenue = () => {
  let target = ''
  tabList.value.forEach((item) => {
    if (headPicData[item.permission] == 1) target = item.route
  })
  return target || tabList.value[0]?.route || ''
}

// 仅当停留在 page1 容器（未选中任何子路由）时才跳默认会场，
// 避免覆盖 isData 链接跳转(会场/rank/荣誉殿堂等)及深链接进入的具体路由
const redirectToDefaultVenue = () => {
  if (route.name !== 'page1') return
  const target = resolveDefaultVenue()
  if (target) router.replace({ name: target })
}

const fetchHeadPic = async () => {
  try {
    const res = await TOOL_httpClient({
      method: 'get',
      url: '/api/activity/LegendsArenaS2/headPic',
      params: {}
    })
    const { data, errorCode } = res.data
    if (errorCode != 0) return
    Object.assign(headPicData, data)
    redirectToDefaultVenue()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchHeadPic()
})

const formatShowDate = (showTime: any) => {
  if (!showTime?.start || !showTime?.end) return ''
  const s = new Date(showTime.start)
  const e = new Date(showTime.end)
  return `${s.getMonth() + 1}/${s.getDate()}-${e.getMonth() + 1}/${e.getDate()}`
}

onUnmounted(() => {
  if (activeStyleTimer) {
    clearTimeout(activeStyleTimer)
    activeStyleTimer = null
  }
  if (swiperInstance.value) {
    swiperInstance.value.destroy(true, true)
    swiperInstance.value = null
  }
})
</script>

<style lang="scss" scoped>
.swiper-bg {
  direction: ltr;
  width: 7.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 20;
}

.swiper-box {
  width: 7.5rem;
  height: 2.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  :deep(.swiper-wrapper) {
    width: 7.5rem;
    display: flex;
    align-items: center;
  }

  :deep(.swiper-slide) {
    width: 2.5rem;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  /* ==================== 基础布局（激活/非激活共用） ==================== */
  :deep(.tab-item-wrap) {
    width: 2.5rem;
    display: flex;
    align-items: center;
    flex-direction: column;

    .venue {
      position: absolute;
      width: 2.2rem !important;
      height: 2.2rem !important;
      object-fit: contain;
      transition: width 0.3s ease, height 0.3s ease;
    }

    .name-btn {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: width 0.3s ease, height 0.3s ease;

      .name-text {
        position: relative;
        z-index: 1;
        text-align: center;
        font-family: 'SF UI Text';
        font-style: normal;
        transition: color 0.3s ease, font-size 0.3s ease;

        &.text-outline::before {
          transition: -webkit-text-stroke 0.3s ease;
        }
      }
    }

    .date-wrap {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: width 0.3s ease, height 0.3s ease;

      .date-text {
        position: relative;
        z-index: 1;
        text-align: center;
        font-family: 'SF UI Text';
        font-style: normal;
        transition: color 0.3s ease, font-size 0.3s ease;
      }
    }
  }

  /* ==================== 非激活样式 ==================== */
  :deep(.swiper-slide) {
    .name-btn {
      width: 1.716rem;
      height: 0.48rem;
      margin-top: 1.35rem;
    }

    .name-text {
      color: #ff7375;
      font-size: 0.22rem;
      font-weight: 600;
      line-height: 0.24rem;
    }

    .name-text.text-outline::before {
      -webkit-text-stroke: 0 transparent !important;
    }

    .date-wrap {
      width: 1.19226rem;
      height: 0.28387rem;
      margin-top: 0.06rem;
    }

    .date-text {
      color: #ffd6cb;
      font-size: 0.2rem;
      font-weight: 600;
      line-height: 0.2rem;
    }
  }

  /* ==================== 激活样式（居中会场 .is-center） ==================== */
  :deep(.is-center) {
    position: relative;
    z-index: 2;

    .venue {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }

    .name-btn {
      width: 1.95rem;
      height: 0.56rem;
      margin-top: 1.52rem;
    }

    .name-text {
      color: #ffeefe;
      font-size: 0.26rem;
      font-weight: 700;
      line-height: 0.28rem;
    }

    .name-text.text-outline::before {
      -webkit-text-stroke: 0.05rem #c40789 !important;
    }

    .date-wrap {
      width: 1.35484rem;
      height: 0.32258rem;
      margin-top: 0.06rem;
    }

    .date-text {
      color: #fffce1;
      font-size: 0.24rem;
      font-weight: 600;
      line-height: 0.20968rem;
    }
  }
}
</style>
