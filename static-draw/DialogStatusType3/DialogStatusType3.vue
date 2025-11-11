<template>
  <Space :val="1.51" h />
  <div
    class="title"
    v-html="TOOL_TEXT[57]?.replace('%s', Number(73 + groupInfo.num))"
  />
  <Space :val="0.39" h />
  <div class="rew-list fc">
    <Rew
      :reward="rewardList[0] || {}"
      :options="{
        size: 'g-rew-d2', // 尺寸
        bgObj: {
          rew: 'g-rew',
          corner: 'g-corner',
          // coin: 'g-coin'
        },
        num: false,
        name: false,
        corner: true,
        coin: false,
        effectFid: false, // 动图
        playIcon: false, // 展示播放按钮
        nameW: 1.5, // 奖励名称宽度
        nameH: 0.32, // 奖励名称高度
        useOutline: false, // 外边框
        outline: `0.05rem #090F07`,
        nameNoScroll: true,
      }"
    />

    <Space :val="0.36" />

    <Rew
      :reward="rewardList[1] || {}"
      :options="{
        size: 'g-rew-d2', // 尺寸
        bgObj: {
          rew: 'g-rew',
          corner: 'g-corner',
          // coin: 'g-coin'
        },
        num: false,
        name: false,
        corner: true,
        coin: false,
        effectFid: false, // 动图
        playIcon: false, // 展示播放按钮
        nameW: 1.5, // 奖励名称宽度
        nameH: 0.32, // 奖励名称高度
        useOutline: false, // 外边框
        outline: `0.05rem #090F07`,
        nameNoScroll: true,
      }"
    />
  </div>
  <Space :val="0.85" h />
  <OssImg src="g-d2-btn-act" class="big-btn fc" @click="handleConfirm">
    <Outline
      :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
      :text="TOOL_TEXT[618]"
      noColor
    />
  </OssImg>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";

const { TOOL_TEXT } = injectTool();
const groupInfo: any = inject("groupInfo");
const emit = defineEmits(["confirm"]);

defineProps({
  rewardList: {
    type: Array,
    default: () => [],
  },
});

const handleConfirm = () => {
  emit("confirm");
};
</script>

<style lang="scss" scoped>
.title {
  width: 4.42rem;
  height: 0.49rem;
  color: #fff;
  font-family: "SF UI Text";
  font-size: 0.24rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.26rem; /* 108.333% */
}

.big-btn {
  width: 3.72rem;
  height: 1.12rem;
  flex-shrink: 0;
  margin-top: 1.21rem;

  span {
    color: #362929;
    font-family: "SF UI Text";
    font-size: 0.32rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 100% */
  }

  &.act {
    span {
      color: #9c0d0d;
      font-family: "SF UI Text";
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 100% */
    }
  }
}
</style>

