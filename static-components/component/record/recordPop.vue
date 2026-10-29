<!--
  获得记录弹框
  使用示例：
  <RecordPop v-model:show="showPop" />
-->

<template>
  <PopUp :showPopUp="show" @closePop="close">
    <div class="record-pop">
      <!-- 标题 -->
      <div class="pop-title fc">
        <Outline
          :color="'0.05rem #ECF87A'"
          :text="TOOL_TEXT[type == 0 ? 17 : 18]"
          noColor
        />
      </div>

      <!-- 记录列表 -->
      <div class="record-list-wrap">
        <RankLoad
          :api="api"
          :params="params"
          :keyConfig="{ listKey: 'list' }"
          isDialog
        >
          <template #card="{ info }">
            <RecordCard0 :info="info" v-if="type == 0" />
            <RecordCard1 :info="info" v-else />
          </template>
          <template #empty>
            <div class="empty">
              <uiImg :n="`empty`" />
              <div class="text fc">{{ TOOL_TEXT[29] || "暂无数据" }}</div>
            </div>
          </template>
        </RankLoad>
      </div>
    </div>
  </PopUp>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import PopUp from "../common/PopUp.vue";
import RankLoad from "../common/RankLoad.vue";
import RecordCard0 from "./RecordCard0.vue";
import RecordCard1 from "./RecordCard1.vue";

interface Props {
  show: boolean;
  type: string | number; //0-抽奖记录 1-大奖池中奖记录
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 0,
});

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const { TOOL_TEXT } = fnGetInjectInfo();
const activityId = inject("activityId");

const close = () => {
  emit("update:show", false);
};

const api = "/api/activity/eidAlFitr2026/lotteryRecords";

const params = computed(() => ({ type: props.type }));
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.record-pop {
  width: 7.02rem;
  height: 8.62rem;
  @include bg("guild-pop-bg");
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .pop-title {
    width: 5.4rem;
    height: 0.56rem;
    @include bg("guild-pop-title");
    position: relative;
    margin-top: 1.11rem;
    margin-bottom: 0.15rem;

    span {
      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 123.077% */
    }
  }

  .record-list-wrap {
    // width: 5.8rem;
    height: 5.7rem;
    margin-top: 0.2rem;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .empty {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    img {
      width: 2rem;
      height: 2rem;
      object-fit: contain;
      margin: 0 auto;
      margin-top: 1.1rem;
    }
    .text {
      width: 5.26rem;
      margin: 0 auto;
      margin-top: 0.24rem;
      color: rgba(255, 255, 255, 0.3);
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }
  }
}
</style>
