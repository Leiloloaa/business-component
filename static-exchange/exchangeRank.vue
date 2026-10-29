<template>
  <div v-bg="`ex-d`" class="dialog-rank">
    <div class="title fc" v-bg="`rank-title`">
      <Outline
        :color="1 ? '0.05rem #ECF87A' : '0.05rem #581604'"
        :text="TOOL_TEXT[100]"
      />
    </div>
    <!-- <div class="col">
      <span>{{ TOOL_TEXT[69] }}</span>
      <Space :val="0.94" />
      <span>{{ TOOL_TEXT[70] }}</span>
    </div> -->

    <div class="scroll">
      <RankLoad
        :api="api"
        :apiParams="apiParams"
        :frame="false"
        :paddingBottom="'0.2'"
        dialog
        @getPageInfo="getPageInfo"
      >
        <template #card="{ info }">
          <ExchangeCard class="dialog-card" :info="{ ...info, selDate }" />
        </template>
        <template #empty>
          <div class="empty fcc">
            <!-- <img :src="`${ossUrl}/empty.png`" alt="" /> -->
            <span>{{ TOOL_TEXT[14] }}</span>
          </div>
        </template>
      </RankLoad>
    </div>
  </div>
</template>

<script lang="ts" setup name="ExchangeRank">
import injectTool from "@publicComponents/injectTool";
import RankLoad from "./RankLoad.vue";

import ExchangeCard from "./ExchangeCardSZ.vue";

const { TOOL_TEXT, TOOL_BPFunc, TOOL_countryCode } = injectTool();
const ossUrl = inject("ossUrl");
const activityId = inject("activityId");

const api = computed(() => {
  return "/api/activity/commonBusiness/exchangeRecords";
});
const props = defineProps({ selDate: {} });
const apiParams = computed(() => {
  return Object.assign({ activityId });
});

const pageInfo = reactive({
  list: [],
});
const getPageInfo = (info) => {
  Object.assign(pageInfo, info);
};
</script>

<style lang="scss" scoped>
.dialog-rank {
  width: 6.38rem;
  height: 7.2rem;

  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  .col {
    margin-top: 0.16rem;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      width: 2.24rem;
      color: #fff387;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem; /* 130.769% */
    }
  }

  .title {
    width: 4.8rem;
    height: 1.2rem;
    span {
      margin-top: 0.4rem;
      color: #004e49;
      text-align: center;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #ecf87a;
      font-family: "SF UI Text";
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 800;
      line-height: 0.38rem; /* 135.714% */
    }
  }

  .th {
    width: 5.54rem;
    height: 0.56rem;
    flex-shrink: 0;

    margin-top: 0.12rem;
    margin-bottom: 0.12rem;

    span {
      color: #eedfff;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .scroll {
    margin-top: 0.24rem;
    height: 5rem;
    overflow-y: scroll;
    scroll-behavior: smooth;
    transition-duration: 1s;

    &::-webkit-scrollbar {
      display: none;
    }

    .empty {
      img {
        width: 2rem;
        height: 2rem;

        margin-top: 1.26rem;
      }

      span {
        margin-top: 2.21rem;
        color: #d94100;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
      }
    }
  }
}
</style>
