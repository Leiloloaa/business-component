<template>
  <div
    v-bg="type == 6 ? 'g-d-bg' : 'g-d-bg2'"
    class="draw-status-dialog"
    :class="`draw-status-dialog-${type}`"
  >
    <!-- type -->
    <!-- 1: 勾选下次不在提示弹框 -->
    <!-- 2: 单个奖励弹框 -->
    <!-- 3: 多个奖励弹框 -->
    <!-- 4: 错误提示 -->
    <!-- 5: 数量不足 -->
    <!-- 6: 奖励表格 -->
    <component
      :is="typeComponent"
      v-if="typeComponent"
      :rewardList="rewardList"
      @confirm="confirm"
      @hide="hide"
    />
  </div>
</template>

<script lang="ts" setup name="DrawStatusDialog">
import { defineAsyncComponent, ref, watch } from "vue";
import injectTool from "@publicComponents/injectTool";
import { toAppUrl } from "@publicComponents/shared";

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_NUM } = injectTool();
const ossUrl = inject("ossUrl");
const groupInfo: any = inject("groupInfo");
const emit = defineEmits(["hide", "confirm", "changePageInfo"]);
const props = defineProps({
  type: {},
  rewardList: {},
  urlType: {},
  pIndex: {},
  pIndexAct: {},
});

// 类型组件动态导入映射
const typeComponentMap = {
  1: () => import("./DialogStatusType1/DialogStatusType1.vue"),
  2: () => import("./DialogStatusType2/DialogStatusType2.vue"),
  3: () => import("./DialogStatusType3/DialogStatusType3.vue"),
  4: () => import("./DialogStatusType4/DialogStatusType4.vue"),
  5: () => import("./DialogStatusType5/DialogStatusType5.vue"),
  6: () => import("./DialogStatusType6/DialogStatusType6.vue"),
};

// 当前加载的组件
const typeComponent = ref(null);

// 根据 type 动态加载组件
watch(
  () => props.type,
  (newType) => {
    if (newType && typeComponentMap[newType]) {
      typeComponent.value = defineAsyncComponent(typeComponentMap[newType]);
    } else {
      typeComponent.value = null;
    }
  },
  { immediate: true }
);

const tabType = ref(0);
const changeTab = (idx) => {
  tabType.value = idx;
};

const rewardsList = computed(() => {
  return tabType.value == 0
    ? groupInfo.sub2?.guardianReward
    : groupInfo.sub2?.attackReward;
});
const pageInfo = reactive({ idx: 1 });

const selIdx = (item) => {
  pageInfo.idx = item;
};

const toDraw = (idx) => {
  console.log(idx);
  if (idx == 1) {
    confirm();
  } else {
    hide();
  }
};

const hide = () => {
  emit("hide");
};

const confirm = (data?: any) => {
  console.log(pageInfo.idx);
  emit("confirm", {
    selIdx: pageInfo.idx,
    ...data,
  });
};

const toRoom = () => {
  if (props.obj?.presenter == 0) {
    toAppUrl("live", { uid: props.obj?.uid });
  } else {
    toAppUrl("gift", {
      roomId: props.obj?.presenter,
      giftId: props.obj?.giftId,
    });
  }
};
</script>

<style lang="scss" scoped>
.draw-status-dialog {
  width: 7.02rem;
  height: 6.98rem;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  &.draw-status-dialog-6 {
    width: 7.5rem;
    height: 8.78rem;

    .reward-content {
      height: 6rem;
      overflow-y: auto;
    }
  }

  .btn-list2 {
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

  .title2 {
    width: 5.01rem;

    color: #e5ffef;
    text-align: center;
    font-family: "SF UI Text";
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.32rem; /* 114.286% */
    letter-spacing: -0.001rem;
  }
  .title3 {
    width: 5.01rem;

    color: #e5ffef;
    text-align: center;
    font-family: "SF UI Text";
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.32rem; /* 114.286% */
    letter-spacing: -0.001rem;
  }

  .list {
    margin-top: 0.6rem;
    margin-bottom: 0.76rem;

    .small-btn {
      width: 1.14rem;
      height: 0.88rem;
      flex-shrink: 0;
      position: relative;
      margin-left: 0.06rem;
      margin-right: 0.06rem;

      span {
        color: #0783e8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.34rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.32rem; /* 94.118% */
        letter-spacing: -0.001rem;
      }

      &.act {
        span {
          color: #fff;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.34rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.32rem; /* 94.118% */
          letter-spacing: -0.001rem;
        }
      }
    }
  }
}
</style>
