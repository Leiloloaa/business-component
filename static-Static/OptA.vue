<!--
  外部使用示例，option用于构造样式
  例1:
  <OptA
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
  <OptA :data="list[item]" :type="item + 1"></OptA>
-->

<template>
  <div class="avatar-wrap">
    <!-- 标题 -->
    <div class="avatar" :style="processedStyles.root">
      <cdnImg
        class="avatar-img"
        :fid="data?.avatar || data?.fid || data?.cover"
        :style="processedStyles.avatar"
      >
      </cdnImg>

      <img
        v-for="(adorn, index) in processedStyles.adorns"
        :key="index"
        :src="adorn?.img.startsWith('http') ? adorn?.img : `${ossUrl}/${adorn?.img}.png`"
        :style="adorn.style"
        alt=""
      />

      <!-- <div
        class="live"
        v-if="env === 'develop' || data?.liveStatus == 1"
        :style="processedStyles.live"
      >
        <img :src="defaultImgConfig.live" :style="processedStyles.live" class="bg" />
        <img
          :src="`//image.yoko.media/static/icon/liveIcon.png`"
          :style="processedStyles.liveIcon"
        />
      </div> -->
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
  data: IData
  type?: any
  option?: {
    styles?: string | Record<string, string>
    adorns?: Array<{
      img: string
      styles: string | Record<string, string>
    }>
    avatar?: string | Record<string, string>
    live?: string | Record<string, string>
    liveIcon?: string | Record<string, string>
  }
}

const props = withDefaults(defineProps<IAvatar>(), {
  type: '',
  data: () => ({})
})

const ossUrl = inject('ossUrl')

const route = useRoute()

// 处理样式字符串或对象
const parseStyle = (style: string | Record<string, string> = '') => {
  // 如果已经是对象，直接返回
  if (typeof style === 'object' && style !== null && !Array.isArray(style)) {
    return { ...style }
  }

  // 如果是字符串，解析为对象
  const styles = {}
  const styleStr = String(style)
  styleStr
    .replace(/\n/g, '')
    .split(';')
    .filter((s) => s.trim())
    .forEach((s) => {
      const [prop, value] = s.split(':').map((str) => str.trim())
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
