<!--
  外部使用示例，option用于构造样式
  例1:
  <OptA
    :data="pageInfo.userInfo"
    :option="{
      styles: 'width: 1.06rem; height: 1.02rem;', // 容器尺寸
      img: 'a', // 装饰图：直接传图片名，尺寸默认 100%（充满容器）
      live: 'width: 0.41rem; height: 0.24rem; bottom: 0.2rem;'
    }"
  />
  例2（自定义头像/直播标）:
  <OptA
    :data="pageInfo.userInfo"
    :option="{
      styles: 'width: 2.58rem; height: 2.58rem;',
      img: 'a1',
      avatar: 'width: 1.83rem; height: 1.83rem;', // avatar 不传时默认 width/height 80%
      // live 不传时默认 display: none（不显示直播标）
      // liveIcon 不传时默认 width/height 80%
    }"
  />
-->

<template>
  <div class="avatar-wrap" v-jump="data">
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

      <div class="live" v-if="data?.liveStatus == 1" :style="processedStyles.live">
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
  data: IData
  type?: any
  option?: {
    styles?: string | Record<string, string>
    // 装饰图简写：直接传单个图片名，等价 adorns: [img]
    img?: string
    // 装饰图：可直接传图片名（默认尺寸 100%），也兼容 { img, styles } 对象写法；优先级高于 img
    adorns?: Array<
      | string
      | {
          img: string
          styles?: string | Record<string, string>
        }
    >
    avatar?: string | Record<string, string>
    live?: string | Record<string, string>
    // 直播图标，不传默认 80% x 80%
    liveIcon?: string | Record<string, string>
  }
}

const props = withDefaults(defineProps<IAvatar>(), {
  type: '',
  data: () => ({})
})

const ossUrl = inject('ossUrl')

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
  return {
    root: {
      position: 'relative',
      ...parseStyle(option.styles)
    },
    // 头像默认 80% x 80%，传入 avatar 可覆盖
    avatar: {
      position: 'relative',
      width: '80%',
      height: '80%',
      ...parseStyle(option.avatar)
    },
    // 装饰图默认充满容器（100%）；优先取 adorns，其次取 img 简写
    adorns: (Array.isArray(option.adorns) ? option.adorns : option.img ? [option.img] : []).map(
      (adorn) => {
        const img = typeof adorn === 'string' ? adorn : adorn?.img
        const adornStyles = typeof adorn === 'string' ? '' : adorn?.styles
        return {
          img,
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            ...parseStyle(adornStyles)
          }
        }
      }
    ),
    // 未传 live 时默认隐藏直播标
    live: {
      position: 'absolute',
      bottom: '0',
      ...(option.live ? parseStyle(option.live) : { display: 'none' })
    },
    // 直播图标默认 80% x 80%，传入 liveIcon 可覆盖
    liveIcon: {
      width: '80%',
      height: '80%',
      ...parseStyle(option.liveIcon)
    }
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
