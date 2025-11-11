<template>
  <OssImg src="ex-dialog" class="draw-status-dialog">
    <!-- type -->
    <!-- 1: 兑换规则 -->
    <!-- 2: 积分不足 -->
    <!-- 3: 二次确认弹框 -->
    <template v-if="type == 1">
      <Space :val="0.26" h />
      <OssImg src="ex-title" class="title">
        <Outline
          class="text"
          :color="1 ? '0.05rem #FFFCAB' : '0.05rem #581604'"
          :text="TOOL_TEXT[94]"
          :noColor="false"
        />
      </OssImg>

      <div class="rule">
        <div class="item" v-for="item in [95, 124, 125]">
          {{ TOOL_TEXT[item] }}
        </div>
      </div>
    </template>

    <template v-if="type == 2">
      <Space :val="0.8" h />
      <div class="title">
        {{ TOOL_TEXT[58] }}
      </div>
      <Space :val="0.4" h />
      <Rew
        :reward="rewardList[0] || {}"
        :options="{
          size: 'd-rew', // 尺寸
          corner: true, // 角标
          name: false, // 奖励名称 麦圈
          coin: false, // 金币
          num: false, // 天数、数量
          effectFid: false, // 动图
          playIcon: false, // 展示播放按钮
          nameW: 1.22, // 奖励名称宽度
          nameH: 0.32, // 奖励名称高度
          useOutline: true, // 外边框
          outline: `0.05rem #5E005C`,
        }"
      />
      <Space :val="0.4" h />
      <OssImg src="d-big-confirm" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 3">
      <Space :val="0.64" h />
      <div class="title">
        {{ TOOL_TEXT[58] }}
      </div>
      <Space :val="0.24" h />
      <div class="rew-list fc">
        <Rew
          :reward="rewardList[0]"
          :options="{
            size: 'rew', // 尺寸
            corner: true, // 角标
            name: false, // 奖励名称 麦圈
            coin: false, // 金币
            num: false, // 天数、数量
            effectFid: false, // 动图
            playIcon: false, // 展示播放按钮
            nameW: 1.22, // 奖励名称宽度
            nameH: 0.32, // 奖励名称高度
            useOutline: true, // 外边框
            outline: `0.05rem #5E005C`,
          }"
        />

        <Space :val="0.24" />

        <Rew
          :reward="rewardList[1]"
          :options="{
            size: 'rew', // 尺寸
            corner: true, // 角标
            name: false, // 奖励名称 麦圈
            coin: false, // 金币
            num: false, // 天数、数量
            effectFid: false, // 动图
            playIcon: false, // 展示播放按钮
            nameW: 1.22, // 奖励名称宽度
            nameH: 0.32, // 奖励名称高度
            useOutline: true, // 外边框
            outline: `0.05rem #5E005C`,
          }"
        />
      </div>
      <Space :val="0.16" h />
      <div class="tip3">
        {{
          TOOL_TEXT[25] ||
          "Tips:奖池为空时只能获得免费礼物，给CP赠送活动礼物，产生积分可增加奖池金币数哦"
        }}
      </div>
      <Space :val="0.24" h />
      <OssImg src="d-big-confirm" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 4">
      <Space :val="0.64" h />
      <div class="title">
        {{ TOOL_TEXT[26] }}
      </div>
      <Space :val="0.4" h />
      <img :src="`${ossUrl}/fail.png`" class="fail" />
      <Space :val="0.24" h />
      <div class="tip3">
        {{ TOOL_TEXT[27] }}
      </div>
      <Space :val="0.6" h />
      <OssImg src="d-big-confirm" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 5">
      <Space :val="0.64" h />
      <div class="title">
        {{ TOOL_TEXT[28] }}
      </div>
      <Space :val="0.4" h />
      <img :src="`${ossUrl}/fail.png`" class="fail" />

      <Space :val="0.6" h />
      <OssImg src="d-big-confirm" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>
  </OssImg>
</template>

<script lang="ts" setup name="DrawStatusDialog">
import injectTool from "@publicComponents/injectTool";
import { toAppUrl } from "@publicComponents/shared";
import useApi from "@hooks/useApi";

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");
const emit = defineEmits(["hide", "confirm", "changePageInfo"]);
const props = defineProps({
  type: {},
  rewardList: {},
});

const isSelect = ref(false);

const hide = () => {
  emit("hide");
};

const confirm = () => {
  emit("confirm", {
    isSelect: isSelect.value,
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
  width: 7.04rem;
  height: 8.6rem;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 4.84rem;
    height: 0.96rem;
    flex-shrink: 0;

    display: flex;
    justify-content: center;

    .text {
      width: 6.4rem;
      margin-top: 0.56rem;

      color: #da00b9;

      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 114.286% */
    }
  }

  .rule {
    width: 5.79rem;
    margin-top: 0.48rem;

    .item {
      margin-bottom: 0.24rem;
      color: #fdffe7;
      font-family: "SF UI Text";
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.32rem; /* 100% */
    }
  }

  .tip {
    margin-top: 0.96rem;

    img {
      width: 0.24rem;
      height: 0.24rem;
    }

    span {
      color: #fff;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem;
      /* 130.769% */
    }
  }

  .btn-list {
    margin-top: 0.98rem;

    .btn {
      width: 2.72rem;
      height: 0.9rem;
    }

    .confirm {
      span {
        color: #7e1500;
        text-align: center;
        font-family: Arial;
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.3rem;
        /* 115.385% */
      }
    }

    .cancel {
      span {
        color: #7e1500;
        text-align: center;
        font-family: Arial;
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.3rem;
        /* 115.385% */
      }
    }
  }

  .tip3 {
    width: 5.9rem;

    color: #fff;
    text-align: center;
    font-family: Arial;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem;
    /* 128.571% */
  }

  .big-btn {
    width: 3.52rem;
    height: 0.9rem;
    flex-shrink: 0;

    span {
      color: #7e1500;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.3rem;
      /* 115.385% */
    }
  }

  .fail {
    width: 1.44rem;
    height: 1.44rem;
    flex-shrink: 0;
  }
}
</style>
