<template>
  <!-- info.idx 从 1 开始 -->
  <div class="cards" v-bg="`d-card`">
    <Space :val="isUser ? 0.2 : 0.02" />
    <div class="num fc">
      <span>{{ info.idx }}</span>
    </div>
    <Space :val="isUser ? 0.2 : 0.1" />
    <OptA :data="info || {}" :option="option" />
    <Space :val="0.16" :h="0" />
    <div class="name ov">{{ info.name || "---" }}</div>
    <Space :val="0.7" />
    <div class="score" v-bg="`score`" >
      {{ TOOL_NUM(info.score) || "---" }}
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from "@publicComponents/injectTool";
import dayjs from "dayjs";
import { css } from "@publicComponents/shared";

const props = withDefaults(
  defineProps<{
    info: any;
    isUser?: boolean;
    type?: number; // card 类型，不同背景
  }>(),
  { isUser: false }
);

const { TOOL_countryCode, TOOL_NUM } = injectTool();
const ossUrl = inject("ossUrl");
const getRew = inject("getRew");

const isTop3 = computed(() => {
  return Number(props.info.idx) <= 3;
});

const isDailyRank = computed(() => {
  return props.info.selDate != 999;
});

const top3FrameStyles = css`
  width: 1.27125rem;
  height: 1.27125rem;
`;
const frameStyles = css`
  width: 1.04rem;
  height: 1.04rem;
`;
const avatarInnerStyles = css`
  width: 0.9rem;
  height: 0.9rem;
`;
const optionMap = Object.fromEntries(
  (
    [
      [0, "a", frameStyles],
      [1, "a1", top3FrameStyles],
      [2, "a2", top3FrameStyles],
      [3, "a3", top3FrameStyles],
    ] as const
  ).map(([key, img, frame]) => [
    key,
    {
      styles: frame,
      adorns: [{ img, styles: frame }],
      avatar: avatarInnerStyles,
    },
  ])
);
const option = computed(() => {
  if (isTop3.value && !props.isUser) {
    return optionMap[props.info.idx];
  }
  return optionMap[0];
});
</script>

<style lang="scss" scoped>
.cards {
  width: 5.99rem;
  height: 1.44rem;
  flex-shrink: 0;

  display: flex;
  align-items: center;

  margin: 0 auto;
  margin-bottom: 0rem;
  position: relative;

  .num {
    width: 0.3rem;
    height: 0.4rem;

    span {
      color: #fffedf;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }
  }

  .name {
    width: 0.96rem;
    height: 0.32rem;

    color: #fffedf;
    text-align: center;
    font-family: "SF UI Text";
    font-size: 0.32rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 100% */
  }

  .score {
    width: 2rem;
    height: 0.56rem;
    flex-shrink: 0;

    color: #fffedf;
    text-align: center;
    font-family: "SF UI Text";
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.56rem; /* 133.333% */
  }
}
</style>
