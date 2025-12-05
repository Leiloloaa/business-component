<!--
  头像组件使用示例
  
  基础用法:
  <OptA :data="pageInfo.userInfo" />
  
  例1: 带样式配置
  <OptA
    :data="pageInfo.userInfo"
    :option="{
      styles: 'width: 1.06rem; height: 1.02rem',
      adorns: [
        {
          img: 'avatar',
          styles: 'width: 100%; height: 100%'
        }
      ],
      avatar: {
        top: '0.14rem',
        width: '0.795rem',
        height: '0.795rem'
      },
      live: {
        display: 'none'
      }
    }"
  />
  
  例2: 使用 jump 参数
  <OptA 
    :data="list[item]" 
    jump="family"
  />
  
  例3: 禁用跳转（jump="none"）
  <OptA 
    :data="userInfo" 
    jump="none"
  />
  
  例4: 自定义 live 图片名称
  <OptA
    :data="pageInfo.userInfo"
    :option="{
      liveBgImg: 'customLiveBg',      // 自定义背景图片名称，默认为 'live'
      liveIconImg: 'customLiveIcon'   // 自定义图标图片名称，默认为 'liveIcon'
    }"
  />
  
  例5: 使用 type 参数
  <OptA :data="list[item]" :type="item + 1" />
  
  Props:
  - data: 用户数据对象，包含 avatar/fid/cover、liveStatus 等字段
  - type: 类型标识（可选）
  - jump: 跳转类型，可选值: 'family' | 'none' | ''（默认）
    - 'family': 使用 v-jump.family 指令
    - 'none': 添加 pointer-events: none 样式，禁用点击
    - '': 使用默认的 v-jump 指令
  - option: 样式配置对象（可选）
    - styles: 根元素样式（字符串或对象）
    - adorns: 装饰图片数组
    - avatar: 头像样式
    - live: live 标签样式
    - liveIcon: live 图标样式
    - liveBgImg: live 背景图片名称（默认: 'live'）
    - liveIconImg: live 图标图片名称（默认: 'liveIcon'）
-->

<template>
  <div class="opt-a-avatar-wrap">
    <div
      v-if="jump === 'family'"
      class="opt-a-avatar"
      v-jump.family="data"
      :style="processedStyles.root"
    >
      <AvatarContent />
    </div>
    <div
      v-else
      class="opt-a-avatar"
      v-jump="data"
      :style="processedStyles.root"
    >
      <AvatarContent />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, h } from "vue";

interface IData {
  avatar?: string | number;
  fid?: string | number;
  liveStatus?: string | number;
}

interface IAvatar {
  data: IData;
  type?: any;
  jump?: string;
  option?: {
    styles?: string | Record<string, string>;
    adorns?: Array<{
      img: string;
      styles: string | Record<string, string>;
    }>;
    avatar?: string | Record<string, string>;
    live?: string | Record<string, string>;
    liveIcon?: string | Record<string, string>;
    liveBgImg?: string; // live 背景图片名称，默认为 'live'
    liveIconImg?: string; // live 图标图片名称，默认为 'liveIcon'
  };
}

const props = withDefaults(defineProps<IAvatar>(), {
  type: "",
  data: () => ({}),
  jump: "",
});

const env = ENV;
const ossUrl = inject("ossUrl");
const domain = inject("domain");

// 处理样式字符串或对象
const parseStyle = (style: string | Record<string, string> = "") => {
  // 如果已经是对象，直接返回
  if (typeof style === "object" && style !== null && !Array.isArray(style)) {
    return { ...style };
  }

  // 如果是字符串，解析为对象
  const styles = {};
  const styleStr = String(style);
  styleStr
    .replace(/\n/g, "")
    .split(";")
    .filter((s) => s.trim())
    .forEach((s) => {
      const [prop, value] = s.split(":").map((str) => str.trim());
      if (prop && value) {
        // 确保所有元素都有定位
        if (prop === "position" && !value) {
          styles[prop] = "absolute";
        } else {
          styles[prop] = value;
        }
      }
    });
  return styles;
};

// 处理所有样式
const processedStyles = computed(() => {
  const option = props.option || {};
  const rootStyle: Record<string, string> = {
    position: "relative",
    ...parseStyle(option.styles),
  };

  // 如果 jump 为 none，添加 pointer-events: none
  if (props.jump === "none") {
    rootStyle["pointer-events"] = "none";
  }

  return {
    root: rootStyle,
    avatar: {
      position: "relative",
      ...parseStyle(option.avatar),
    },
    adorns: (option.adorns || []).map((adorn) => ({
      img: adorn.img,
      style: {
        position: "absolute",
        ...parseStyle(adorn.styles),
      },
    })),
    live: {
      position: "absolute",
      bottom: "0",
      ...parseStyle(option.live),
    },
    liveIcon: parseStyle(option.liveIcon),
  };
});

// 内部组件：渲染头像内容
const AvatarContent = () => {
  return [
    h("cdnImg", {
      class: "opt-a-avatar-img",
      fid: props.data?.avatar || props.data?.fid || props.data?.cover,
      style: processedStyles.value.avatar,
    }),
    ...processedStyles.value.adorns.map((adorn, index) =>
      h("img", {
        key: index,
        src: adorn?.img.startsWith("http")
          ? adorn?.img
          : `${ossUrl}/${adorn?.img}.png`,
        style: adorn.style,
        alt: "",
      })
    ),
    (env === "develop" || props.data?.liveStatus == 1) &&
      h(
        "div",
        {
          src: "live",
          class: "opt-a-live",
          style: processedStyles.value.live,
        },
        [
          h("img", {
            src: `${ossUrl}/${props.option?.liveBgImg || "live"}.png`,
            style: processedStyles.value.live,
            class: "opt-a-live-bg",
          }),
          h("img", {
            src: `//image.${domain}.media/static/icon/${
              props.option?.liveIconImg || "liveIcon"
            }.png`,
            style: processedStyles.value.liveIcon,
          }),
        ]
      ),
  ];
};
</script>

<style lang="scss" scoped>
.opt-a-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .opt-a-avatar-img {
    border-radius: 50%;
    position: relative;
    z-index: 1;
  }

  .opt-a-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;

    img {
      position: absolute;

      &:not(.opt-a-avatar-img) {
        z-index: 2;
      }
    }

    .opt-a-live {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 3;

      .opt-a-live-bg {
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
