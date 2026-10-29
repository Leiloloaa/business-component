<template>
  <div class="record-item">
    <div class="timer">
      {{ dayjs(info.createTime).format("YYYY-MM-DD HH:mm") }}
    </div>

    <div class="text" v-marquee="{ speed: 50 }">
      <span>
        {{
          TOOL_TEXT[info.lotteryType == 1 ? 19 : 20]
            ?.replace("%b%", info.other2)
            ?.replace("%a%", info.rewardCount)
        }}
      </span>
    </div>

    <div class="reward-list">
      <div class="reward-item" v-for="item in info.rewardModels" :key="item.id">
        <div class="reward-img fc">
          <div class="rew-desc">{{ item.count }}</div>
          <cdnImg :fid="item.fid" m="none" :w="''" :h="''" />
        </div>
        <div class="reward-name" v-marquee="{ center: true, speed: 50 }">
          {{ item.goodsName }}
        </div>
        <span class="reward-count fc"
          ><uiImg n="lottery-coin" />{{ item.count }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fnGetInjectInfo } from "@components/developTool_TS";
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
  height: 2.14rem;
  @include bg("d-card0");
  margin-bottom: 0.08rem;
  padding: 0.08rem 0.12rem;
  padding-bottom: 0;

  display: flex;
  flex-direction: column;
  .timer {
    color: rgba(255, 255, 255, 0.8);
    font-family: Arial;
    font-size: 0.26rem;
    font-style: normal;
    font-weight: 700;
  }
  .text {
    width: 5.6rem;
    height: 0.4rem;
    margin-top: -0.1rem;

    display: flex;
    align-items: center;
    span {
      color: #d5d0d8;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }
  .reward-list {
    width: 5.6rem;
    height: 1.6rem;
    display: flex;
    overflow-x: scroll;
    gap: 0.26rem;
    margin-top: 0rem;
    padding-top: 0.06rem;
    
    .reward-item {
      width: 0.8rem;

      .reward-img {
        width: 0.8rem;
        height: 0.8rem;
        @include bg("d-rew");
        position: relative;

        .rew-desc {
          width: 0.44rem;
          height: 0.22rem;
          @include bg("d-rew-desc");
          position: absolute;
          top: -0.06rem;
          right: -0.1rem;

          color: #fff;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.2rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.22rem;
        }
        img {
          width: 0.73rem;
          height: 0.73rem;
          object-fit: contain;
        }
      }
      .reward-name {
        width: 0.8rem;
        height: 0.24rem;

        color: #d5d0d8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.24rem; /* 100% */
      }
      .reward-count {
        img {
          width: 0.24rem;
          height: 0.24rem;
        }

        color: #ffe89a;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.24rem; /* 100% */
      }
    }
  }

  .avatar-wrap {
    width: 1.12rem;
    height: 1.12rem;
    aspect-ratio: 1/1;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include bg("a");
      z-index: 2;
      pointer-events: none;
    }

    .avatar {
      width: 0.82526rem;
      height: 0.82526rem;
      object-fit: cover;
      border-radius: 50%;
      position: relative;
      z-index: 1;
    }
  }

  .label {
    color: #d94100;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 133.333% */
  }

  .amount {
    color: #d94100;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 133.333% */
  }

  .record-coin {
    width: 0.5rem;
    height: 0.5rem;
    object-fit: contain;
    flex-shrink: 0;
  }
}
</style>
