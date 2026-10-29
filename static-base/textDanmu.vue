<!--
  使用示例：
  方式一：通过 API 获取数据
  <TextDanmu
    api="/api/activity/getDanmuList"
    :content="TOOL_TEXT[1]"
  />
  
  方式二：通过 list 传入数据
  <TextDanmu
    :list="[]"
    :content="TOOL_TEXT[1]"
  />
  
  Props:
  - api?: string - API 地址，如果提供则通过接口获取数据（优先级高于 list）
  - list?: any[] - 弹幕列表数据，数据项需包含 name 和 reward 字段
  - content?: string - 内容模板，支持占位符：%s（用户名）、%z（奖励名称），默认 'xxx%sxxx%d'
  - interval?: number - 切换间隔时间（毫秒），默认 2000
-->

<template>
  <div
    class="text-danmu-wrap"
    v-if="danmuState.danmuList && danmuState.danmuList.length != 0"
  >
    <div
      class="text-danmu-list"
      :class="{ 'animate-up': danmuState.animateUp }"
    >
      <div class="text-danmu-item fc" v-for="item in danmuState.danmuList">
        <Rep
          :content="content"
          :rule="[
            {
              reg: '%s',
              eg: true,
              val: item?.name,
              type: 'text',
              options: { color: '#FFE601', fontSize: 0.28, width: 1, y: 0.08 },
              className: 'ov',
            },
            {
              reg: '%z',
              eg: true,
              val: getRew(item.reward?.packageSpecificRewards?.[0])?.name,
              type: 'text',
              options: { color: '#FFE601', fontSize: 0.28 },
            },
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, toRefs, watch, onMounted, inject } from "vue";
import injectTool from "@publicComponents/injectTool";

// 定义 props
const props = withDefaults(
  defineProps<{
    api?: string;
    list?: any[];
    content?: string;
    interval?: number; // 切换间隔时间（毫秒）
  }>(),
  {
    api: "",
    list: () => [],
    content: "xxx%sxxx%d",
    interval: 2000, // 默认 2 秒
  }
);

const { TOOL_httpClient, TOOL_countryCode } = injectTool();
const danmuState = reactive({
  danmuList: [],
  animateUp: false,
});
const getRew = inject("getRew");

let timer: any = null;
const ANIMATION_DURATION = 500; // 动画持续时间（毫秒）

function scrollAnimate() {
  const { animateUp, danmuList } = toRefs(danmuState);
  if (danmuList.value.length === 0) return;

  animateUp.value = true;
  setTimeout(() => {
    danmuList.value.push(danmuList.value[0]);
    danmuList.value.shift();
    animateUp.value = false;
  }, ANIMATION_DURATION);
}

// 启动定时器
function startTimer() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(scrollAnimate, props.interval);
}

// 停止定时器
function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

const appInfo = inject("appInfo") as any;

// 获取弹幕数据
const getDanmu = async () => {
  // 如果 props.api 有值，则请求 API
  if (props.api) {
    await TOOL_httpClient({
      url: props.api,
      method: "GET",
      params: {
        activityId: appInfo.curId,
      },
    })
      .then((response) => {
        const {
          data: { data, errorCode },
        } = response;
        if (errorCode != 0) throw response;
        Object.assign(danmuState.danmuList, data);
        console.log(danmuState.danmuList);
        // 数据更新后启动定时器
        if (danmuState.danmuList && danmuState.danmuList.length > 0) {
          startTimer();
        }
      })
      .catch((error) => {
        console.log("Request Api Error! =====", error);
      });
  } else if (props.list && props.list.length > 0) {
    // 否则使用 props.list 的值
    Object.assign(danmuState.danmuList, props.list);
    // 数据更新后启动定时器
    if (danmuState.danmuList && danmuState.danmuList.length > 0) {
      startTimer();
    }
  }
};

// 监听 props.list 的变化
watch(
  () => props.list,
  (newList) => {
    if (!props.api && newList && newList.length > 0) {
      Object.assign(danmuState.danmuList, newList);
      // 数据更新后启动定时器
      if (danmuState.danmuList && danmuState.danmuList.length > 0) {
        startTimer();
      }
    }
  },
  { deep: true }
);

// 监听 props.interval 的变化，重新设置定时器
watch(
  () => props.interval,
  () => {
    if (danmuState.danmuList && danmuState.danmuList.length > 0) {
      startTimer();
    }
  }
);

onMounted(() => {
  getDanmu().then(() => {
    // 数据加载完成后启动定时器
    if (danmuState.danmuList && danmuState.danmuList.length > 0) {
      startTimer();
    }
  });
});

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped lang="scss">
.text-danmu-wrap {
  width: 100%;
  height: 100%;

  overflow: hidden;
  margin: 0 auto;

  display: flex;
  align-items: center;

  position: relative;
  z-index: 2;

  .text-danmu-list {
    width: 95%;
    height: 95%;

    .text-danmu-item {
      width: 100%;
      height: 100%;

      span {
        margin-top: -0.1rem;
        color: #ffe9a8;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.24rem; /* 123.077% */
        letter-spacing: -0.00805rem;
      }
    }
  }
}

.animate-up {
  transition: all 0.6s ease-in-out;
  transform: translateY(-100%);
}
</style>
