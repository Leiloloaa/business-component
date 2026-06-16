<!--
  通用奖励单元 — 礼物图 + 角标 (+ 名称)
  Props:
    - reward:  奖励对象（任意结构，由 inject('getRew') 解析）
    - options: 可选配置对象，按需覆盖默认值
        ┌ size      尺寸类名（sm / md / lg），默认 md
        ├ showDesc  是否展示数量角标，默认 true
        ├ showName  是否展示名称行，默认 false
        ├ bg        礼物框背景图名（v-bg），默认 'rew'
        └ bgDesc    数量角标背景图名（v-bg），默认 'rew-desc'
  Emits:
    - click(reward): 点击整个奖励单元时触发，payload 为当前 reward
        使用示例：
          <Rew :reward="item" @click="look" />          // look 函数自动收到 reward
          <Rew :reward="item" @click="look(item)" />    // 也可手动传参
-->

<template>
  <div class="rew" :class="opts.size" @click="look(reward)">
    <div class="rew-wrap" ref="rewWrapRef">
      <div class="rew-icon fc" v-bg="opts.bg">
        <cdnImg :info="reward" />
      </div>

      <div v-if="opts.showDesc" class="desc fc" v-bg="opts.bgDesc">
        <span>{{ getRew(reward)?.num }}</span>
      </div>
    </div>

    <NoticeBar v-if="opts.showName" :w="noticeBox.w" :h="noticeBox.h" center>
      <span ref="rewNameRef" class="rew-name">{{ getRew(reward)?.name }}</span>
    </NoticeBar>
  </div>
</template>

<script lang="ts" setup name="Rew">
import { useAppStore } from '../../../../store'

interface RewOptions {
  /** 尺寸类名（预设 sm / md / lg） */
  size?: 'sm' | 'md' | 'lg'
  /** 是否展示数量角标 */
  showDesc?: boolean
  /** 是否展示名称行 */
  showName?: boolean
  /** 礼物框背景图名（v-bg） */
  bg?: string
  /** 数量角标背景图名（v-bg） */
  bgDesc?: string
}

const DEFAULT_OPTIONS: Required<RewOptions> = {
  size: 'md',
  showDesc: true,
  showName: false,
  bg: 'rew',
  bgDesc: 'rew-desc'
}

const props = withDefaults(
  defineProps<{
    reward: any
    options?: RewOptions
  }>(),
  {
    options: () => ({})
  }
)
const appStore = useAppStore()

const look = (item) => {
  appStore.showReward(item)
}

const opts = computed(() => ({ ...DEFAULT_OPTIONS, ...props.options }))

const getRew: any = inject('getRew')

const DEFAULT_NAME_HEIGHT = 0.32
const DEFAULT_NAME_WIDTH = 0.96
const noticeBox = reactive({ w: DEFAULT_NAME_WIDTH, h: DEFAULT_NAME_HEIGHT })

const rewWrapRef = ref<HTMLElement | null>(null)
const rewNameRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const pxToRem = (px: number) => {
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100
  return Number((px / rootFontSize).toFixed(4))
}

const updateNoticeBox = () => {
  const wrapRect = rewWrapRef.value?.getBoundingClientRect()
  const nameRect = rewNameRef.value?.getBoundingClientRect()

  noticeBox.w = wrapRect?.width ? pxToRem(wrapRect.width) : DEFAULT_NAME_WIDTH
  noticeBox.h = nameRect?.height ? pxToRem(nameRect.height) : DEFAULT_NAME_HEIGHT
}

const observeNoticeBox = () => {
  resizeObserver?.disconnect()
  resizeObserver = null

  if (!rewWrapRef.value && !rewNameRef.value) return
  resizeObserver = new ResizeObserver(updateNoticeBox)
  if (rewWrapRef.value) resizeObserver.observe(rewWrapRef.value)
  if (rewNameRef.value) resizeObserver.observe(rewNameRef.value)
  updateNoticeBox()
}

watch(
  () => [opts.value.size, opts.value.showName, props.reward],
  () => nextTick(observeNoticeBox),
  { immediate: true }
)

onMounted(() => nextTick(observeNoticeBox))

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<style lang="scss" scoped>
.rew {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.08rem;

  // === 尺寸预设：rew-wrap 外框（desc 锚点空间） + rew-icon 礼物框 ===
  &.sm {
    .rew-wrap {
      width: 1.13rem;
      height: 1.12rem;
      .rew-icon {
        width: 1.04782rem;
        height: 1.03855rem;
      }

      // 数量角标（背景由 v-bg='rew-desc' 注入）
      .desc {
        width: 0.74011rem;
        height: 0.25251rem;
        position: absolute;
        top: 0.03rem;
        right: 0.03rem;

        span {
          color: #fffabc;
          text-align: center;
          font-family: Roboto;
          font-size: 0.16rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
    }
  }

  &.md {
    .rew-wrap {
      width: 1.11rem;
      height: 1.11rem;
      aspect-ratio: 1/1;

      .rew-icon {
        width: 1.02927rem;
        height: 1.02927rem;
      }

      // 数量角标（背景由 v-bg='rew-desc' 注入）
      .desc {
        width: 0.74011rem;
        height: 0.25251rem;
        position: absolute;
        top: 0.03rem;
        right: 0.03rem;

        span {
          color: #fffabc;
          text-align: center;
          font-family: Roboto;
          font-size: 0.16rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
    }
  }

  &.lg {
    .rew-wrap {
      width: 1.44rem;
      height: 1.44rem;

      .rew-icon {
        width: 1.44rem;
        height: 1.44rem;
      }

      // 数量角标（背景由 v-bg='rew-desc' 注入）
      .desc {
        width: 1.04rem;
        height: 0.32rem;
        position: absolute;
        top: 0rem;
        right: 0rem;

        span {
          color: #af1400;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.2rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.2rem; /* 100% */
        }
      }
    }
  }

  // 外层定位容器：rew-icon 居中、desc 绝对定位锚点
  .rew-wrap {
    flex-shrink: 0;
    position: relative !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 礼物框（背景由 v-bg='rew' 注入；img 走 80% 留白）
  .rew-icon {
    flex-shrink: 0;

    img {
      width: 80%;
      height: 80%;
      object-fit: contain;
    }
  }

  // 名称文字（宽高由 NoticeBar 控制；超出自动滚动）
  .rew-name {
    color: #a7fbff;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-weight: 400;
    line-height: 0.32rem;
  }
}
</style>
