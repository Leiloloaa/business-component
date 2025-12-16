<template>
  <div v-bg="`game-venue-d`" class="dialog-rank">
    <!-- <div v-bg="`d-sub-title`" class="title fc">
      <span>{{ TOOL_TEXT[98] || "record" }}</span>
    </div> -->
    <!-- <div class="th fc">
      <span>{{ TOOL_TEXT[23] }}</span>
      <Space :val="0.46" />
      <span>{{ TOOL_TEXT[23] }}</span>
    </div> -->
    <!-- <div class="btn-list fc">
      <div
        v-bg="tabType == idx ? 'g-draw-btn-act' : `g-draw-btn`"
        class="btn fc"
        :class="{ act: tabType == idx }"
        v-for="(item, idx) in 2"
        @click="changeTab(idx)"
      >
        <Outline
          :color="1 ? '0.05rem #581604' : '0.05rem #581604'"
          :text="TOOL_TEXT[82 + idx]"
          noColor
        />
      </div>
    </div> -->

    <div class="content">
      <div
        class="scroll"
        :class="{
          'short-scroll': pageInfo.userInfo?.isOnTheRank,
        }"
      >
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
              <img :src="`${ossUrl}/empty.png`" alt="" />
              <span>{{ TOOL_TEXT[731] }}</span>
            </div>
          </template>

          <template #userInfo="{ info }" v-if="props.type == 'rank'">
            <UserInfo v-if="info.isOnTheRank" :info="info" isCardStyle />
          </template>
        </RankLoad>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="DialogRank">
import injectTool from "@publicComponents/injectTool";

import DialogCard from "./DialogCardBJ.vue";
// import DialogCard from "./DialogCardSZ.vue";

const { TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");
const activityId = inject("activityId");
const api = computed(() => {
  return "/api/activity/commonBusiness/lotteryRecords";
});
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

  .title {
    width: 4.84rem;
    height: 0.96rem;
    margin-top: 0.45rem;
    span {
      margin-top: 0.35rem;
      color: #702b09;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.28rem; /* 107.692% */
    }
  }

  .th {
    width: 100%;
    height: 0.66rem;

    span {
      width: 2.4rem;

      color: #fff;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem;
      /* 100% */
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
    height: 6.5rem;
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
        margin-top: 2.8rem;
        color: #fff0cc;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 300;
        line-height: 0.26rem; /* 108.333% */
      }
    }
  }
}
</style>
