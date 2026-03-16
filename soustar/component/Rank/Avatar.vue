<!--
  头像组件
  使用示例：
  <Avatar :info="info" isTop3 />        — Top3 专属边框（a1/a2/a3）
  <Avatar :info="info" />               — 普通列表，默认 size-4
  <Avatar :info="info" :isUser="true" /> — 当前用户
  <Avatar :info="info" :size="2" />      — 自定义 size
  
  Props:
  - info: object - 用户信息，包含 avatar 字段
  - size: number - 头像大小 (1, 2, 3, 4)，可选，优先级最高
  - isTop3: boolean - 是否为 Top3 展示（使用 a1/a2/a3 边框）
  - isUser: boolean - 是否为当前用户
  
  CSS 类映射:
  - Top3: size-top1 / size-top2 / size-top3（a1/a2/a3 边框）
  - 非Top3: size-s1 / size-s2 / size-s3（普通边框）
  - 默认/isUser: size-s4
-->

<template>
  <div class="avatar-wrap fc" :class="`size-${computedSize}`">
    <uiImg v-if="!info.avatar" class="avatar" :n="`sofa`" />
    <cdnImg
      v-else
      v-jump="info"
      class="avatar"
      :fid="info.avatar"
      m="none"
      :w="''"
      :h="''"
    />
    <div v-if="info.liveStatus === 1" class="live">
      <img :src="`//image.yoko.media/static/icon/liveIcon.png`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  info: Record<string, any>;
  size?: number | string;
  isTop3?: boolean;
  isUser?: boolean;
}

const props = defineProps<Props>();

const computedSize = computed(() => {
  if (props.size) return `s${props.size}`;
  if (props.isUser) return "s4";
  const idx = props.info.idx;
  if (idx >= 1 && idx <= 3) {
    return props.isTop3 ? `top${idx}` : `s${idx}`;
  }
  return "s4";
});
</script>

<style lang="scss" scoped>
@use "sass:list";
@use "../../static/mixin.scss" as *;

// name: (容器宽, 容器高, 头像宽, 头像高, 边框图, 头像top偏移, live底部距离)
// topX top3大头像 sx top3小头像 s4 是普通头像
$avatar-sizes: (
  "s5": (
    1.14rem,
    1.14rem,
    0.8rem,
    0.8rem,
    "a",
    0.1rem,
    0.15rem,
  ),
  "s4": (
    1.52rem,
    1.52rem,
    1.12rem,
    1.12rem,
    "a",
    0.2rem,
    0.15rem,
  ),
  "s1": (
    1.52rem,
    1.52rem,
    1.12rem,
    1.12rem,
    "a1",
    0.3rem,
    0.15rem,
  ),
  "s2": (
    1.52rem,
    1.52rem,
    1.12rem,
    1.12rem,
    "a2",
    0.3rem,
    0.15rem,
  ),
  "s3": (
    1.52rem,
    1.52rem,
    1.12rem,
    1.12rem,
    "a3",
    0.3rem,
    0.15rem,
  ),
  "top1": (
    2.56rem,
    2.56rem,
    1.56rem,
    1.56rem,
    "a1",
    0.7rem,
    0.15rem,
  ),
  "top2": (
    2.56rem,
    2.56rem,
    1.56rem,
    1.56rem,
    "a2",
    0.7rem,
    0.15rem,
  ),
  "top3": (
    2.56rem,
    2.56rem,
    1.56rem,
    1.56rem,
    "a3",
    0.7rem,
    0.15rem,
  ),
);

.avatar-wrap {
  position: relative;

  .avatar {
    object-fit: cover;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .live {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0.4rem;
    height: 0.24rem;
    @include bg("live");
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    img {
      width: 80%;
      object-fit: contain;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  @each $name, $config in $avatar-sizes {
    $wrap-w: list.nth($config, 1);
    $wrap-h: list.nth($config, 2);
    $avatar-w: list.nth($config, 3);
    $avatar-h: list.nth($config, 4);
    $frame: list.nth($config, 5);
    $top: list.nth($config, 6);
    $live-bottom: list.nth($config, 7);

    &.size-#{$name} {
      width: $wrap-w;
      height: $wrap-h;

      &::after {
        @include bg(#{$frame});
      }

      .avatar {
        width: $avatar-w;
        height: $avatar-h;
        @if $top != 0 {
          top: $top;
          transform: translateX(-50%);
        }
      }

      .live {
        bottom: $live-bottom;
      }
    }
  }
}
</style>
