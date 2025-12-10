<template>
  <div v-bg="`m-g-d-bg`" class="dialog-rank">
    <!-- <div v-bg="`m-top1-tile`" class="title fc">
      <Outline
        :color="1 ? '0.05rem #6D0701' : '0.05rem #581604'"
        :text="TOOL_TEXT[59]"
        :noColor="false"
      />
    </div> -->
    <div class="info fc">
      <OptA
        :data="info || {}"
        :option="{
          styles: cssFormat`
            width: 0.88rem;
            height: 0.8448rem;
          `,
          adorns: [
            {
              img: 'm-g-a',
              styles: cssFormat`
                width: 0.88rem;
                height: 0.8448rem;
                flex-shrink: 0;
                aspect-ratio: 88/84.48;
              `,
            },
          ],
          avatar: cssFormat`
            width: 0.7568rem;
            height: 0.7568rem;
          `,
          live: `width: 0.41rem; height: 0.24rem; bottom: 0rem`,
          liveIcon: `width: 0.18rem;`,
        }"
      />

      <div class="name ov">{{ info.unionName || "--" }}</div>
    </div>

    <div class="info-text">{{ TOOL_TEXT[91] }}</div>

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
    <div v-bg="''" class="content">
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
    </div>
  </div>
</template>

<script lang="ts" setup name="DialogRank">
import injectTool from "@publicComponents/injectTool";
import RankLoad from "../../../Static/RankLoad.vue";
import { cssFormat } from "@publicComponents/shared";

import DialogCard from "./DialogCard.vue";
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
  return "/api/activity/AnnualCeremony2025/unionMemberRank";
});
const props = defineProps({ info: {} });
const guildRankStage = inject("guildRankStage");
const apiParams = computed(() => {
  return Object.assign({
    stage: guildRankStage.value,
    agencyId: props.info?.unionId,
  });
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
  width: 7.5rem;
  height: 7.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 5.33rem;
    height: 0.86rem;
    flex-shrink: 0;

    margin: 0 auto;
    margin-top: 0.38rem;

    span {
      color: #fff;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #6d0701;
      font-family: "SF UI Text";
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 106.667% */
    }
  }
  .info {
    margin-top: 1rem;
    .name {
      width: 1.85rem;
      margin-left: 0.26rem;
      margin-right: 0.26rem;
      color: #ffeccf;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }
  }

  .info-text {
    width: 5.72rem;

    margin-top: 0.09rem;
    margin-bottom: 0.22rem;

    color: #d33f00;
    text-align: center;
    font-family: "SF UI Text";
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.32rem; /* 133.333% */
  }

  .content {
    width: 5.9rem;
    height: 4.5rem;
  }

  .scroll {
    width: 5.9rem;
    height: 4rem;
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
        margin-top: 1.8rem;
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
