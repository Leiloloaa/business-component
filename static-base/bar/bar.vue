<template>
  <div class="bar-wrap" ref="barWrapRef" :class="`theme${taskConfig.theme}`">
    <!-- 进度条 绝对定位 -->
    <div
      v-bg="
        taskConfig.upgradeTaskPoints?.length == 5
          ? `${taskConfig.themeFold}/p1-bar-long`
          : `${taskConfig.themeFold}/p1-bar-short`
      "
      :class="[
        'bar-bg',
        taskConfig.upgradeTaskPoints?.length == 5 ? 'long' : 'short',
        TOOL_countryCode
      ]"
    >
      <div class="bar-inner">
        <div class="act" :style="{ width: barLength }"></div>
      </div>

      <div class="bar-lv-list">
        <template v-for="(item, idx) in taskList">
          <div
            class="bar-lv-info"
            :style="{
              [barDirection === 'rtl' ? 'right' : 'left']: segmentEndPositions[idx] + 'rem',
              transform: `translateX(${barDirection === 'rtl' ? '50%' : '-50%'})`
            }"
          >
            <div
              class="icon"
              :class="{ active: groupInfo.curIdx === idx }"
              v-bg="
                currentLevel > idx
                  ? `${taskConfig.themeFold}/p1-bar-finished`
                  : `${taskConfig.themeFold}/p1-bar-unfinished`
              "
            ></div>

            <div class="text fc">
              <Outline
                class="ov"
                :color="currentLevel > idx ? outlineColorAct : outlineColor"
                :text="TOOL_TEXT[65]?.replace('%s', item?.taskId)?.replace('s%', item?.taskId)"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="puzzleTask">
import injectTool from '@publicComponents/injectTool'

const {
  TOOL_toast,
  TOOL_BPFunc,
  TOOL_httpClient,
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_loading,
  TOOL_NUM
} = injectTool()

const taskConfig: any = inject('taskConfig')

const OUTLINE_COLOR_MAP_ACT = {
  1: '0.05rem #FFF0AC',
  2: ''
}

const OUTLINE_COLOR_MAP = {
  1: '0.05rem #FFF1B3',
  2: ''
}
const outlineColorAct = computed(() => OUTLINE_COLOR_MAP_ACT[taskConfig.theme])
const outlineColor = computed(() => OUTLINE_COLOR_MAP[taskConfig.theme])

const ossUrl = inject('ossUrl')
const groupInfo: any = inject('page1Info')
const barWrapRef = ref<HTMLElement | null>(null)

const scrollToIndex = (idx: number) => {
  const wrap = barWrapRef.value
  if (!wrap) return
  const items = wrap.querySelectorAll('.bar-lv-info')
  if (!items.length || idx < 0 || idx >= items.length) return

  const lastIdx = items.length - 1
  const isRtl = getComputedStyle(wrap).direction === 'rtl'
  const maxScroll = wrap.scrollWidth - wrap.clientWidth

  if (idx === 0) {
    wrap.scrollTo({ left: isRtl ? maxScroll : 0, behavior: 'smooth' })
    return
  }
  if (idx === lastIdx) {
    wrap.scrollTo({ left: isRtl ? -maxScroll : maxScroll, behavior: 'smooth' })
    return
  }

  items[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

watch(
  () => groupInfo.curIdx,
  (newIdx) => {
    nextTick(() => scrollToIndex(newIdx))
  },
  { immediate: true }
)

const taskList = computed(() => {
  const isReverse = false // 是否倒序显示
  const data = unref(groupInfo?.taskInfos)
  if (!Array.isArray(data)) return []
  return isReverse ? [...data].reverse() : data
})

const currentLevel = computed(() => {
  const curLv = taskList.value.filter((item) => item.progress >= item.required).length
  return curLv
})

const barDirection = computed(() =>
  barWrapRef.value ? getComputedStyle(barWrapRef.value).direction : 'ltr'
)

const totalLen = computed(() => (taskConfig.upgradeTaskPoints?.length == 5 ? 7.52 : 5.84))

const barSegments = computed(() => {
  const len1 = 0.36
  const icon = 0.48
  const list = taskList.value
  const listLength = list.length
  const firstSegLen = len1 + icon
  const avgLen = listLength > 1 ? (totalLen.value - firstSegLen) / (listLength - 1) : totalLen.value
  return { firstSegLen, avgLen, list, listLength }
})

/** 每一段末尾距渲染容器起始边的距离 (rem) */
const segmentEndPositions = computed(() => {
  const { firstSegLen, avgLen, list } = barSegments.value
  if (!list.length) return []
  return list.map((_, i) => Number((i === 0 ? firstSegLen : firstSegLen + avgLen * i).toFixed(5)))
})

const barLength = computed(() => {
  const { firstSegLen, avgLen, list, listLength } = barSegments.value
  if (!listLength) return '0rem'

  const total = totalLen.value
  const currentIndex = currentLevel.value
  let resLen = 0

  console.log(
    '[Bar] totalLen=',
    total,
    'firstSegLen=',
    firstSegLen,
    'avgLen=',
    avgLen,
    'listLength=',
    listLength,
    'currentIndex=',
    currentIndex
  )

  if (currentIndex >= listLength) {
    resLen = total
    console.log('[Bar] 所有等级已完成, resLen=', resLen)
  } else {
    if (currentIndex > 0) {
      resLen = firstSegLen + avgLen * (currentIndex - 1)
      console.log('[Bar] 已完成段累积长度=', resLen)
    }
    const cur = list[currentIndex]
    if (cur?.required > 0) {
      const percent = Math.min(cur.progress / cur.required, 1)
      const segLen = currentIndex === 0 ? firstSegLen : avgLen
      resLen += percent * segLen
      console.log(
        '[Bar] 当前等级 index=',
        currentIndex,
        'progress=',
        cur.progress,
        'required=',
        cur.required,
        'percent=',
        (percent * 100).toFixed(2) + '%',
        'segLen=',
        segLen,
        '填充=',
        (percent * segLen).toFixed(5),
        'resLen=',
        resLen
      )
    }
  }

  console.log('[Bar] 最终 barLength=', resLen.toFixed(5) + 'rem')
  return resLen.toFixed(5) + 'rem'
})
</script>

<style lang="scss" scoped>
.bar-wrap {
  width: auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  height: 1.38rem;

  display: flex;
  position: relative;

  margin-top: 0.19rem;
  margin-bottom: 0.11rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  &.theme1 {
    .bar-bg .bar-inner .act {
      background: linear-gradient(180deg, #ffe89d 0%, #c9a01e 99.45%);
    }
    .bar-bg .bar-lv-list .bar-lv-info .text span {
      color: #760000;
      -webkit-text-stroke-color: #fff1b3;
    }
  }

  .bar-bg {
    position: absolute;
    top: 0.45rem;
    left: 0.65rem;

    &.long {
      width: 7.6rem;
      height: 0.24rem;
    }

    &.short {
      width: 5.92rem;
      height: 0.24rem;
    }

    &.EG {
      left: unset;
      right: 0.65rem;

      .bar-inner {
        left: unset;
        right: 0.04rem;
      }
    }

    .bar-inner {
      width: 100%;
      overflow: hidden;
      height: 0.2rem;

      position: absolute;
      top: 0.04rem;
      left: 0.04rem;
      border-radius: 0.8rem;

      .act {
        height: 0.16rem;
        border-radius: 0.8rem;
        position: relative;
      }
    }

    .bar-lv-list {
      width: 100%;
      height: 1.38rem;
      position: absolute;
      top: -0.4rem;

      .bar-lv-info {
        width: 0.96rem;

        position: absolute;
        top: 0;
        z-index: 3;

        display: flex;
        flex-direction: column;
        align-items: center;

        .icon {
          width: 0.96rem;
          height: 0.96rem;
          position: relative;
          z-index: 2;
          transition: width 0.3s ease, height 0.3s ease, margin 0.3s ease;

          &.active {
            width: 1.06rem;
            height: 1.06rem;
            margin-top: -0.05rem;
            margin-bottom: -0.05rem;
          }
        }

        .text {
          width: 0.96rem;
          margin-top: 0.08rem;

          span {
            text-align: center;
            -webkit-text-stroke-width: 2px;
            font-family: 'SF UI Text';
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 700;
            line-height: 0.24rem;
          }
        }
      }
    }
  }
}
</style>
