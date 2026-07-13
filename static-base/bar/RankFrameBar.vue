<template>
  <div
    ref="levelTrackRef"
    class="level-track-scroll"
    :class="{ EG: TOOL_countryCode === 'EG' }"
    @scroll.passive="handleTrackScroll"
  >
    <div class="level-track">
      <div class="track-line">
        <i class="track-left" v-bg="'p2-p-left'"></i>
        <i class="track-mid" v-bg="'p2-p-mid'"></i>
        <i class="track-right" v-bg="'p2-p-right'"></i>
        <i class="track-progress" :style="{ width: challengeView.trackProgressWidth }"></i>
      </div>
      <div
        v-for="level in pageLevels"
        :key="level.level"
        class="track-item"
        :class="{ act: level.level === challengeView.level }"
        @click="selectLevel(level)"
      >
        <div class="lock fc">
          <i
            class="lock-bg"
            v-bg="level.level <= challengeView.currentLevel ? 'weekly-level-act' : 'weekly-level'"
          ></i>
        </div>
        <span>{{ getLevelText(level.level) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="RankFrameBar">
import { inject, nextTick, onUnmounted, ref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import injectTool from '@publicComponents/injectTool'
import type { IChallengeLevel } from '../../../utils/type'

interface IRankFrameBarContext {
  pageLevels: ComputedRef<Array<IChallengeLevel>>
  challengeView: ComputedRef<{
    level: number
    currentLevel: number
    trackProgressWidth: string
  }>
  getLevelText: (level: number) => string
  selectLevel: (level: IChallengeLevel) => void
  setChallengeArrowPosition: (centerX: number) => void
}

const { TOOL_countryCode } = injectTool()
const context = inject<IRankFrameBarContext>('rankFrameBar')
if (!context) throw new Error('rankFrameBar 未提供')

const { pageLevels, challengeView, getLevelText, selectLevel, setChallengeArrowPosition } = context
const levelTrackRef = ref<HTMLElement>()
let scrollFrame = 0
let isFirstScroll = true
const updateArrowPosition = () => {
  const activeRect = levelTrackRef.value
    ?.querySelector<HTMLElement>('.track-item.act')
    ?.getBoundingClientRect()
  if (activeRect) setChallengeArrowPosition(activeRect.left + activeRect.width / 2)
}
const scrollActiveLevel = async () => {
  await nextTick()
  const activeItem = levelTrackRef.value?.querySelector<HTMLElement>('.track-item.act')
  if (!activeItem) return
  const behavior = isFirstScroll ? 'auto' : 'smooth'
  activeItem.scrollIntoView({ behavior, block: 'nearest', inline: 'center' })
  isFirstScroll = false
  // 目标本就在可视区内时不会触发 scroll 事件，因此必须主动定位一次；
  // 若触发了滚动，后续由 handleTrackScroll 在动画过程中持续校正
  await nextTick()
  updateArrowPosition()
}
const handleTrackScroll = () => {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    updateArrowPosition()
  })
}

watch([() => challengeView.value.level, () => pageLevels.value.length], scrollActiveLevel, {
  immediate: true,
  flush: 'post'
})
onUnmounted(() => cancelAnimationFrame(scrollFrame))
</script>

<style lang="scss" scoped>
.level-track-scroll {
  width: 6.78rem;
  padding-right: 0.29rem;
  padding-left: 0.29rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &.EG {
    .level-track {
      .track-line {
        .track-progress {
          right: 0;
          left: auto;
        }
      }
    }
  }
}

.level-track {
  width: max-content;
  min-width: 6.28rem;
  margin: 0.4rem auto 0.27rem;
  display: flex;
  gap: 0.56rem;
  align-items: flex-start;
  position: relative !important;

  .track-line {
    width: 100%;
    height: 0.28rem;
    position: absolute !important;
    top: 0.18rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    direction: ltr;

    i {
      height: 0.28rem;
      flex-shrink: 0;
    }

    .track-left {
      width: 0.75rem;
    }

    .track-mid {
      min-width: 0.2rem;
      flex: 1;
      background-repeat: repeat-x;
      background-size: 0.2rem 0.28rem;
    }

    .track-right {
      width: 1.07rem;
    }

    .track-progress {
      height: 0.2rem;
      position: absolute !important;
      top: 0.04rem;
      left: 0;
      z-index: 1;
      background: linear-gradient(180deg, #00c3ff 0%, #ffbb1e 100%);
      transition: width 0.3s ease;
    }
  }

  .track-item {
    width: 0.58rem;
    flex-shrink: 0;
    position: relative !important;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .lock {
      width: 0.58rem;
      height: 0.58rem;
      flex-shrink: 0;

      .lock-bg {
        width: 0.58rem;
        height: 0.58rem;
        flex-shrink: 0;
        transition: width 0.3s ease, height 0.3s ease;
      }
    }

    span {
      margin-top: 0.15rem;
      color: #d6e6ff;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.28rem;
      transition: color 0.3s ease, font-size 0.3s ease;
    }

    &.act {
      .lock-bg {
        width: 0.72rem;
        height: 0.72rem;
      }

      span {
        color: #ffea47;
        font-size: 0.28rem;
      }
    }
  }
}
</style>
