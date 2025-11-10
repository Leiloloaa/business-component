<!--
  外部使用示例，option用于构造样式
  例1:
  <OptAvatar
    :data="pageInfo.userInfo"
    :option="{
      w: 1.06,
      h: 1.02,
      adorns: [
        {
          img: 'avatar',
          w: '100%',
          h: '100%'
        }
      ],
      avatar: {
        top: 0.14,
        w: 0.795,
        h: 0.795
      },
      live: {
        display: 'none'
      }
    }"
  />
  例2:
  <OptAvatar :data="list[item]" :type="item + 1"></OptAvatar>
-->

<template>
  <div class="avatar-wrap">
    <!-- 标题 -->
    <div class="avatar" v-jump="data" :class="[type, `ava-${type}`]" :style="processedStyles.root">
      <cdnImg
        class="avatar-img"
        :fid="data?.avatar || data?.fid || data?.cover"
        :style="processedStyles.avatar"
      >
      </cdnImg>
      <template v-if="lazy">
        <img
          v-for="(adorn, index) in processedStyles.adorns"
          :key="index"
          v-lazyload.webp="
            adorn?.img.startsWith('http') ? adorn?.img : `${ossUrl}/${adorn?.img}.png`
          "
          :style="adorn.style"
          alt=""
        />
      </template>
      <template v-else>
        <img
          v-for="(adorn, index) in processedStyles.adorns"
          :key="index"
          :src="adorn?.img.startsWith('http') ? adorn?.img : `${ossUrl}/${adorn?.img}.png`"
          :style="adorn.style"
          alt=""
        />
      </template>

      <div
        src="live"
        class="live"
        v-if="env === 'develop' || data?.liveStatus == 1"
        :style="processedStyles.live"
      >
        <img :src="`${ossUrl}/live.png`" :style="processedStyles.live" class="bg" />
        <img
          :src="`//image.yoko.media/static/icon/liveIcon.png`"
          :style="processedStyles.liveIcon"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface IData {
  avatar?: string | number
  fid?: string | number
  liveStatus?: string | number
}

interface IAvatar {
  lazy?: boolean
  data: IData
  type?: any
  option?: {
    styles?: string
    adorns?: Array<{
      img: string
      styles: string
    }>
    avatar?: string
    live?: string
    liveIcon?: string
  }
}

const props = withDefaults(defineProps<IAvatar>(), {
  type: '',
  lazy: true,
  data: () => ({})
})

const env = ENV
const ossUrl = inject('ossUrl')
const yohoUi = inject('yohoUi')

const route = useRoute()

// 处理样式字符串
const parseStyle = (styleStr: string = '') => {
  const styles = {}
  styleStr
    .replace(/\n/g, '')
    .split(';')
    .filter((style) => style.trim())
    .forEach((style) => {
      const [prop, value] = style.split(':').map((s) => s.trim())
      if (prop && value) {
        // 确保所有元素都有定位
        if (prop === 'position' && !value) {
          styles[prop] = 'absolute'
        } else {
          styles[prop] = value
        }
      }
    })
  return styles
}

// 处理所有样式
const processedStyles = computed(() => {
  const option = props.option || {}
  const defaultPosition = { position: 'absolute' }
  return {
    root: {
      position: 'relative',
      ...parseStyle(option.styles)
    },
    avatar: {
      position: 'relative',
      ...parseStyle(option.avatar)
    },
    adorns: (option.adorns || []).map((adorn) => ({
      img: adorn.img,
      style: {
        position: 'absolute',
        ...parseStyle(adorn.styles)
      }
    })),
    live: {
      position: 'absolute',
      bottom: '0',
      ...parseStyle(option.live)
    },
    liveIcon: parseStyle(option.liveIcon)
  }
})
</script>

<style lang="scss" scoped>
.avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  // width: 100%;
  // height: 100%;

  .avatar-img {
    border-radius: 50%;
    position: relative;
    z-index: 1;
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;

    img {
      position: absolute;

      &:not(.avatar-img) {
        z-index: 2;
      }
    }

    .live {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 3;

      .bg {
        width: 0.41rem;
        height: 0.24rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      img {
        position: relative;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
