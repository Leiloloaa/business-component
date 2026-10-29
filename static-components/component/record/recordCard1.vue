<template>
  <div class="record-item">
    <div class="top">
      <span class="time">{{
        dayjs(info.createTime).format("YYYY-MM-DD HH:mm")
      }}</span>
      <span>{{ TOOL_TEXT[21] }}</span>
    </div>

    <div class="bottom">
      <div class="avatar-info">
        <Avatar :info="info.userInfo" :size="5" />
        <div class="name ov">{{ info.userInfo?.name }}</div>
      </div>
      <span class="reward-count"
        ><uiImg n="lottery-coin" />{{ info.rewardCount }}</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fnGetInjectInfo } from "@components/developTool_TS";
import Avatar from "../Rank/Avatar.vue";
import dayjs from "dayjs";

const { TOOL_TEXT } = fnGetInjectInfo();

defineProps<{
  info: Record<string, any>;
}>();

const formatNumber = (num: number | string) => {
  const n = Number(num);
  if (isNaN(n)) return num;
  return n.toLocaleString();
};
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.record-item {
  width: 5.82rem;
  height: 1.52rem;
  @include bg("d-card0");
  margin-bottom: 0.08rem;
  padding-top: 0.08rem 0.12rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    width: 5.58rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .time {
      color: rgba(255, 255, 255, 0.8);
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    span {
      color: rgba(255, 255, 255, 0.8);
      text-align: right;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
  .bottom {
    width: 5.58rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatar-info {
      display: flex;
      align-items: center;
      .name {
        width: 1.82rem;
        color: #d9d0e3;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.32rem; /* 133.333% */
      }
    }
    .reward-count {
      display: flex;
      align-items: center;
      img {
        width: 0.32rem;
        height: 0.32rem;
        object-fit: contain;
      }

      color: #ffe89a;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.32rem; /* 133.333% */
    }
  }
}
</style>
