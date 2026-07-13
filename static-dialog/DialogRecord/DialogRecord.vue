<template>
  <div class="dialog-rank" v-bg="`d-bg`">
    <div class="d-title fc" v-bg="'d-title'">
      <span>{{ TOOL_TEXT[79] }}</span>
    </div>

    <div class="th fc">
      <span v-for="item in 3">{{ TOOL_TEXT[item + 80] }}</span>
    </div>

    <div class="content">
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
            <DialogCard :info="info" />
          </template>
          <template #empty>
            <div class="empty fcc">
              <!-- <img :src="`${ossUrl}/empty.png`" alt="" /> -->
              <span>{{ TOOL_TEXT[731] }}</span>
            </div>
          </template>
        </RankLoad>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="DialogRank">
import injectTool from "@publicComponents/injectTool";

// import DialogCard from './DialogCardBJ.vue'
import DialogCard from "./DialogCardSZ.vue";

const { TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");
const activityId = inject("activityId");
const api = computed(() => {
  return "/api/activity/treasureHunter/lotteryRecords";
});
const apiParams = computed(() => {
  return Object.assign({});
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
  width: 7.04rem;
  height: 8.41rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .btn-list {
    margin-top: 0.54rem;
    .btn {
      width: 2.46rem;
      height: 0.74rem;

      margin-left: 0.08rem;
      margin-right: 0.08rem;

      span {
        color: #112155;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 108.333% */
      }

      &.act {
        span {
          color: #9c0d0d;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.26rem; /* 108.333% */
        }
      }
    }
  }

  .d-title {
    width: 5.66rem;
    height: 0.68rem;
    margin: 0 auto;
    margin-top: 0.43rem;
    margin-bottom: 0.3rem;

    span {
      width: 2.5rem;
      text-align: center;
      font-feature-settings: "liga" off, "clig" off;
      font-family: "SF UI Text";
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 800;
      line-height: 0.38rem;

      background: linear-gradient(
        90deg,
        #ffe4aa 0.19%,
        #fffde6 49.94%,
        #ffe4aa 99.7%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .th {
    width: 5.6rem;

    span {
      width: 33.33%;

      color: #ffdeb6;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.32rem; /* 133.333% */
    }
  }

  .content {
    width: 6rem;
    height: 6.5rem;
    flex-shrink: 0;
    margin-top: 0.12rem;
  }

  .scroll {
    width: 6rem;
    height: 6rem;
    flex-shrink: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;
    transition-duration: 1s;

    &.short-scroll {
      height: 5.2rem;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    .empty {
      img {
        margin-top: 2.75rem;
        width: 2.4rem;
        height: 1.23rem;
        flex-shrink: 0;
      }

      span {
        margin-top: 2.62rem;
        color: #ffdeb6;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.32rem; /* 100% */
      }
    }
  }
}
</style>
