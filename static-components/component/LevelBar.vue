<!--
  阶层进度条组件
  使用示例：
  <LevelBar :taskList="pageInfo.task" />
-->

<template>
  <div class="level-list">
    <!-- 进度条 绝对定位 -->
    <div class="bar-bg">
      <div class="bar-inner">
        <div class="act" :style="{ height: barLength }"></div>
      </div>
    </div>

    <div
      v-for="(level, index) in taskList"
      class="level-item"
      :key="index"
      :class="[{ finished: level.finished }]"
    >
      <!-- 主内容区 -->
      <div class="level-card">
        <!-- 阶层名称标签 -->
        <div class="level-name-tag fc">
          <Outline
            :class="{
              'name-text': level.finished,
              'name-text-unfinished': !level.finished,
            }"
            :color="'0.05rem #4F0700'"
            :text="TOOL_TEXT[Number(index) + 9]"
            :noColor="!level.finished"
          />
        </div>

        <div class="bottom-info">
          <div class="p1-progress fc">
            <Progress
              :curScore="level.progress"
              :reqScore="level.required"
              :finished="level.finished"
            />
            <Space :val="0.06" :h="0" />
            <div class="p1-progress-text">
              {{ TOOL_TEXT[17] }}
            </div>
          </div>
          <!-- 奖励列表 -->
          <LevelRewardList
            :rewards="level.rewards?.[0]?.giftBagInfo || []"
            :finished="level.finished"
          />
        </div>
      </div>

      <!-- 右侧 LV 标签 -->
      <div class="level-tag" :class="{ unfinished: !level.finished }">
        <uiImg :n="`p1-lv${level.number}`" class="tag-bg" />
        <div class="lv-text fc">
          <span>LV{{ level.number }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, unref } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import LevelRewardList from "./LevelRewardList.vue";
import Progress from "./Progress.vue";

const { TOOL_TEXT } = fnGetInjectInfo();

interface Props {
  taskList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  taskList: () => [],
});

const currentLevel = computed(() => {
  const list = props.taskList;
  const listLength = Number(list?.length) || 0;
  let curLv = 0;
  list?.forEach((item) => {
    if (item.progress >= item.required && curLv + 1 <= listLength) curLv++;
  });
  return curLv;
});

const barLength = computed(() => {
  const totalLen = 19.02;
  const len1 = 0;
  let type = 2; // 1: 分段计算 第一段是长度特殊设置, 后续段均等分 2: 分段计算 所有等级均等分
  const list = props.taskList;
  const listLength = Number(list?.length) || 0;
  const currentIndex = currentLevel.value;

  const avgLen = Number(
    type == 1 ? (totalLen - len1) / (listLength - 1) : totalLen / listLength
  ).toFixed(5);
  let resLen = 0;
  list?.forEach((item, index) => {
    const percent = Number(
      ((item?.progress / item?.required) * 100).toFixed(5)
    );
    const realLen = Number(index == 0 && type == 1 ? len1 : avgLen);
    const lvLen = Number(((percent * realLen) / 100).toFixed(5));
    if (index <= currentIndex) resLen += lvLen;
    console.log(
      "type ==",
      type,
      "avgLen ==",
      avgLen,
      "progress=",
      item?.progress,
      "required=",
      item?.required,
      "index==",
      index,
      "currentIndex==",
      currentIndex,
      "index<=currentIndex",
      index <= currentIndex,
      index <= currentIndex ? "[加上此长度]" : "[不加此长度]",
      "percent=",
      percent,
      "%",
      "*",
      realLen,
      "=",
      lvLen,
      "结果resLen",
      resLen
    );
  });
  return resLen + "rem";
});
</script>

<style lang="scss" scoped>
@use "../static/mixin.scss" as *;

.level-list {
  display: flex;
  flex-direction: column;

  margin-top: 1.84rem;
  margin-bottom: 0.92rem;

  position: relative;

  .bar-bg {
    width: 0.36rem;
    height: 16.34623rem;
    @include bg("bar-bg");
    position: absolute;
    top: 0.75rem;
    right: 0.27rem;

    .bar-inner {
      width: 0.27rem;
      height: 16.31rem;
      overflow: hidden;

      position: absolute;
      top: 0.02rem;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 0.8rem;

      .act {
        width: 0.27rem;
        border-radius: 0.8rem;
        background: linear-gradient(90deg, #c77400 0%, #ffdb27 100%);

        position: absolute;
        bottom: -2.71rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}

.finished {
  .level-card {
    @include bg("task-1");
  }
}

.level-item {
  display: flex;
  align-items: center;

  direction: ltr;

  .level-card {
    width: 5.27rem;
    height: 2.51rem;
    @include bg("task-0");
    margin-bottom: 0.16rem;

    .level-name-tag {
      width: 4.97857rem;
      height: 0.48908rem;

      margin: 0 auto;
      margin-top: 0.1rem;

      .name-text {
        color: #fff200;
        text-align: center;
        -webkit-text-stroke-width: 1.68px;
        -webkit-text-stroke-color: #4f0700;
        font-family: "SF UI Text";
        font-size: 0.25145rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.30174rem;
      }

      .name-text-unfinished {
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem;

        background: linear-gradient(
          90deg,
          #f4f3ae 0.24%,
          #fdffeb 50%,
          #f4f3ae 99.76%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .bottom-info {
      margin-top: 0.06rem;
      .p1-progress {
        margin-bottom: 0.07rem;
        .p1-progress-text {
          min-width: 1.68rem;
          color: #f9ffc8;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.34rem;
        }
      }
    }
  }

  .level-tag {
    width: 0.9rem;
    height: 0.9rem;
    position: relative;
    margin-top: -0.4rem;

    .tag-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }

    &.unfinished {
      filter: grayscale(100%);
    }

    .lv-text {
      width: 0.66481rem;
      height: 0.35466rem;
      @include bg("lv-text");

      position: absolute;
      left: 50%;
      bottom: 0rem;
      transform: translateX(-50%);

      span {
        color: #823700;
        text-align: center;
        font-family: Arial;
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
}
</style>
