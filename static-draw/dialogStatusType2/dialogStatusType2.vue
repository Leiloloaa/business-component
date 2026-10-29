<template>
  <Space :val="0.8" h />
  <div class="title">
    {{ TOOL_TEXT[58] }}
  </div>
  <Space :val="0.4" h />
  <Rew
    :reward="rewardList[0] || {}"
    :options="{
      size: 'd-rew', // 尺寸
      corner: true, // 角标
      name: false, // 奖励名称 麦圈
      coin: false, // 金币
      num: false, // 天数、数量
      effectFid: false, // 动图
      playIcon: false, // 展示播放按钮
      nameW: 1.22, // 奖励名称宽度
      nameH: 0.32, // 奖励名称高度
      useOutline: true, // 外边框
      outline: `0.05rem #5E005C`,
    }"
  />
  <Space :val="0.4" h />
  <div
    v-bg="groupInfo.curStatus == 4 ? 'd-big-confirm' : 'd-big-confirm-act'"
    :class="{ act: groupInfo.curStatus == 4 }"
    class="big-btn fc"
    @click="handleConfirm"
  >
    <Outline
      :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
      :text="TOOL_TEXT[618]"
      noColor
    />
  </div>
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

