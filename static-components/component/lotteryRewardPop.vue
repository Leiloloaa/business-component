<template>
  <lotteryPopup
    v-model:visible="popVisible"
    :defaultTitle="false"
    :hasClose="false"
  >
    <template #close>
      <div class="close-btn" @click="onClose"></div>
    </template>
    <template #title>
      <p class="pop-title">{{ TOOL_TEXT[13] }}</p>
      <p class="pop-sub-title">{{ TOOL_TEXT[14] }}</p>
    </template>
    <template #result-reward>
      <div class="lottery-list-reward">
        <div
          class="item"
          v-for="(item, index) in rewards"
          :key="(item.fid || index) + '-' + index"
        >
          <div class="desc" v-if="item.count">{{ item.count }}</div>
          <div class="rew fc">
            <cdnImg
              class="reward-img"
              :fid="item.fid"
              m="none"
              :w="''"
              :h="''"
            />
          </div>
          <div class="name" v-marquee="{ center: true, speed: 50 }">{{ item.goodsName }}</div>
          <div class="count fc">
            <uiImg class="coin" n="lottery-coin" />
            <Space :val="0.02" :h="0" />
            <span>{{ item.coin }}</span>
          </div>
        </div>
      </div>
    </template>
  </lotteryPopup>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import lotteryPopup from "@activity-business/h5-package-lotteryPopup";

const { TOOL_TEXT } = fnGetInjectInfo();

const props = defineProps<{
  visible: boolean;
  lotteryType: number;
  rewards: any[];
}>();

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
  (e: "close"): void;
}>();

const popVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit("update:visible", val),
});

const onClose = () => {
  emit("update:visible", false);
  emit("close");
};
</script>

<style lang="scss" scoped>
@use "../static/mixin.scss" as *;

.close-btn {
  width: 0.72rem;
  height: 0.72rem;
  @include bg("close");
  margin: 0 auto;
  margin-top: 0.32rem;
}

.pop-title {
  text-align: center;
  font-family: Arial;
  font-size: 0.46rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  background: linear-gradient(180deg, #faf6a1 26.68%, #f7c959 85.27%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pop-sub-title {
  margin-top: 0.4rem;
  color: #fff;
  text-align: center;

  /* 内文 */
  font-family: "SF UI Text";
  font-size: 0.24rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.26rem; /* 108.333% */
}

::v-deep(.popup-result-content) {
  position: relative;
  z-index: 4;
  overflow-y: scroll;
  width: 100%;
  height: 70%;
  margin: 0.84rem auto 0.84rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.lottery-list-reward {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 0.24rem;
  padding: 0.2rem;

  .item {
    width: 1.7rem;
    height: 2.24rem;
    @include bg("lottery-rew");
    padding-top: 0.1rem;
    position: relative;

    .desc {
      width: 0.64rem;
      height: 0.32rem;
      @include bg("lottery-rew-desc");

      position: absolute;
      top: -0.02rem;
      right: 0;

      color: #4a2214;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .rew {
      width: 1.32rem;
      height: 1.32rem;
      margin: 0 auto;

      .reward-img {
        width: 1.22rem;
        height: 1.22rem;
        object-fit: contain;
      }
    }

    .name {
      width: 1.6rem;
      margin: 0 auto;
      margin-top: 0.04rem;

      color: #f9ffc8;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.27159rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.0097rem;
    }

    .count {
      width: 1.34rem;
      height: 0.28rem;
      margin: 0 auto;

      .coin {
        width: 0.3rem;
        height: 0.3rem;
      }

      span {
        color: #f9ffc8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.25219rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
}
</style>
