<template>
  <OssImg src="g-d-bg" class="dialog-rank">
    <OssImg src="d-sub-title" class="title fc">
      <span>{{ TOOL_TEXT[98] || "record" }}</span>
    </OssImg>
    <!-- <div class="th fc">
      <span>{{ TOOL_TEXT[23] }}</span>
      <Space :val="0.46" />
      <span>{{ TOOL_TEXT[23] }}</span>
    </div> -->
    <!-- <div class="btn-list fc">
      <OssImg
        :src="tabType == idx ? 'g-draw-btn-act' : `g-draw-btn`"
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
      </OssImg>
    </div> -->
    <OssImg src="d-rank-content" class="content">
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
              <span>{{ TOOL_TEXT[731] }}</span>
            </div>
          </template>
          <!-- <template #userInfo="{ info }">
          <UserInfo v-show="info.isOnTheRank" :info="info" isCardStyle />
        </template> -->
        </RankLoad>
      </div>
    </OssImg>
  </OssImg>
</template>

<script lang="ts" setup name="DialogRank">
import injectTool from "@publicComponents/injectTool";
import RankLoad from "../Static/RankLoad.vue";

// import DialogCard from './DialogCardSZ.vue'
import DialogCard from "./DialogCardBJ.vue";
import UserInfo from "./UserInfo.vue";

const { TOOL_TEXT, TOOL_BPFunc, TOOL_countryCode } = injectTool();
const ossUrl = inject("ossUrl");
const activityId = inject("activityId");
const isData = inject("isData");

const tabType = ref(0);
const changeTab = (idx) => {
  tabType.value = idx;
};

const api = computed(() => {
  return "/api/activity/trNational2025/lotteryRecords";
});
const props = defineProps({ urlType: {} });
const apiParams = computed(() => {
  return Object.assign({ date: "" });
});

const selDate = ref<string | number>(""); // 默认当天传 空 999 为总榜
const pageInfo = reactive({
  list: [],
});
const getPageInfo = (info) => {
  Object.assign(pageInfo, info);
};
</script>

<style lang="scss" scoped>
.dialog-rank {
  width: 7.02rem;
  height: 8.6rem;
  flex-shrink: 0;

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
    width: 5.52rem;
    height: 6.5rem;
    flex-shrink: 0;
    margin-top: 0.22rem;
  }

  .scroll {
    width: 5.52rem;
    height: 6.5rem;
    flex-shrink: 0;
    padding-top: 0.11rem;
    overflow-y: scroll;
    scroll-behavior: smooth;
    transition-duration: 1s;

    &::-webkit-scrollbar {
      display: none;
    }

    .empty {
      img {
        margin-top: 1rem;
        width: 1.6rem;
        height: 1.6rem;
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
