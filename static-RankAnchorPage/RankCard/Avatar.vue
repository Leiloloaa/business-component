<!--
用法示例（可传入 Card 中 optionList 的某一项作为 :style，组件会解析宽高并应用）：
<Avatar
  :data="info || {}"
  :pic="{
    sofa: 'sofa',
    frame: `${isTop3 && !isUser ? `${prefix}a` : `${prefix}a`}`,
    live: `${prefix}live`
  }"
  :option="{ radius: 1, live: isUser ? 0 : 1, alwaysLive: 0, jump: 1 }"
  :type="`${isTop3 && !isUser ? 'a152p70' : 'a152p70'}`"
  :style="optionList[info.idx]"
/>
-->
<template>
  <div
    v-jump="option.jump ? data : {}"
    :class="`avatar-component avatar-component-${pic.type}`"
    :style="{
      width: _sc.frame.width || 'auto',
      height: _sc.frame.height || 'auto'
    }"
  >
    <cdnImg
      class="user-img"
      :info="data || {}"
      :defaultImg="_sofa"
      :style="{ borderRadius: option.radius ? '50%' : '0', ..._sc.avatar }"
    ></cdnImg>

    <img class="frame" :src="_frame" :style="_sc.frame" alt="" />

    <div v-if="isLive" class="live" :style="_sc.live">
      <img class="live-bg" :src="_live" alt="" />
      <img class="live-icon" :src="liveIcon" :style="_sc.liveIcon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { opt } from './avatarOpt'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  option: {
    type: Object,
    default: () => ({
      radius: true,
      live: false,
      alwaysLive: false,
      jump: true
    })
  },
  pic: {
    type: Object,
    default: () => ({
      type: 'card',
      sofa: 'sofa',
      frame: 'a',
      live: 'live'
    })
  },
  styleConfig: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: ''
  },
  // 传入 Card 中 optionList 项（含 styles / avatar / live / liveIcon），组件内部解析宽高并应用
  style: {
    type: Object,
    default: () => null
  }
})

/** 从 style 配置对象中解析出用于 _sc 的样式（支持 css 模板返回的对象或字符串） */
function parseStyleConfig(styleObj: any) {
  if (!styleObj) return null
  const getStyle = (v: any): Record<string, string> => {
    if (v == null) return {}
    if (typeof v === 'object') return v
    if (typeof v !== 'string') return {}
    const o: Record<string, string> = {}
    const re = /([\w-]+)\s*:\s*([^;]+)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(v)) !== null) {
      const k = m[1].replace(/-([a-z])/g, (_, c) => (c as string).toUpperCase())
      o[k.trim()] = m[2].trim()
    }
    return o
  }
  const styles = getStyle(styleObj.styles)
  const avatar = getStyle(styleObj.avatar)
  const live = getStyle(styleObj.live)
  const liveIcon = getStyle(styleObj.liveIcon)
  return {
    frame: { width: styles.width || 'auto', height: styles.height || 'auto', ...styles },
    avatar: avatar,
    live: live,
    liveIcon: liveIcon
  }
}

// 仅当传入 style 有值时才用新逻辑解析并应用；否则保持原有 type / styleConfig 用法
const _sc = computed(() => {
  if (props.style != null) {
    const fromStyle = parseStyleConfig(props.style)
    if (fromStyle) return fromStyle
  }
  return props.type ? opt[props.type] : props.styleConfig
})

const ossUrl = inject('ossUrl')
const liveIcon = '//image.waka.media/static/icon/liveIcon.png'

const isLive = computed(() => {
  return props?.option?.alwaysLive || props?.data?.liveStatus == 1
})

const _sofa = computed(() => {
  let sofa = props?.pic?.sofa
  let afterFix = sofa?.includes('.') ? '' : '.png'
  if (sofa) {
    return sofa?.includes('http') ? `${sofa}${afterFix}` : `${ossUrl}/${sofa}${afterFix}`
  } else {
    return `${ossUrl}/sofa.png`
  }
})

const _frame = computed(() => {
  let frame = props?.pic?.frame
  let afterFix = frame?.includes('.') ? '' : '.png'
  if (frame) {
    return frame?.includes('http') ? `${frame}${afterFix}` : `${ossUrl}/${frame}${afterFix}`
  } else {
    return `${ossUrl}/a.png`
  }
})

const _live = computed(() => {
  let live = props?.pic?.live
  let afterFix = live?.includes('.') ? '' : '.png'
  if (live) {
    return live?.includes('http') ? `${live}${afterFix}` : `${ossUrl}/${live}${afterFix}`
  } else {
    return `${ossUrl}/live.png`
  }
})
</script>

<style lang="scss" scoped>
.avatar-component {
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  .frame {
    width: 1.2rem;
    height: 1.2rem;
    flex-shrink: 0;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  .user-img {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .live {
    width: 0.4rem;
    height: 0.24rem;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    bottom: 0rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;

    .live-bg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      flex-shrink: 0;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .live-icon {
      width: 96%;
      height: 93%;
      object-fit: contain;
      flex-shrink: 0;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
    }
  }
}
</style>
