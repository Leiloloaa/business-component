<template>
  <div class="bar-wrap">
    <!-- 进度条 绝对定位 -->
    <OssImg src="bar-bg" class="bar-bg">
      <div class="bar-inner" :class="TOOL_countryCode">
        <!-- width/height -->
        <div class="act" :style="{ height: barLength }"></div>
      </div>
    </OssImg>

    <!-- 进度条 头部 desc -->
    <!-- <OssImg src="bar-desc" class="bar-desc">
    </OssImg> -->

    <template v-for="(item, idx) in taskList">
      <div class="bar-lv-info">
        <div class="icon">
          <OssImg
            :src="currentLevel >= idx + 1 ? `bar-icon-act` : `bar-icon`"
            class="icon"
            tag="img"
          />
        </div>

        <div class="text">{{ TOOL_TEXT[102 + item] }}</div>

        <div class="reward-wrap">
          <div class="reward">
            <Rew
              :reward="item"
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
                useOutline: false, // 外边框
                outline: `0.05rem #090F07`,
              }"
            />
          </div>
          <OssImg
            :src="`bar-btn${item.status == 1 ? '-act' : ''}`"
            class="btn"
            @class="obtainReward"
          >
            <span>{{ TOOL_TEXT[statusMap[item.status]] }}</span>
          </OssImg>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup name="puzzleTask">
import injectTool from "@publicComponents/injectTool";

const {
  TOOL_toast,
  TOOL_BPFunc,
  TOOL_httpClient,
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_loading,
  TOOL_NUM,
} = injectTool();

const groupInfo: any = inject("groupInfo");

const statusMap = {
  1: 67, // 未领取
  2: 83, // 已领取
  3: 68, // 未完成
  4: 83, // 已完成
  5: 66, // 已失效
};

const rewardList = ref([]);
const obtainReward = async (item, idx) => {
  if (item.status != 1) return;

  TOOL_BPFunc({ desc: "open_button_click", action: "click" });
  TOOL_loading();
  const url =
    "/api/activity/anniversaryGameCarnival2025/winMasterReward?index=" +
    Number(idx + 1);
  try {
    const res = await TOOL_httpClient({
      url: url,
      method: "get",
    });
    const { data, errorCode } = res.data;
    if (errorCode != 0) throw res;

    const _key = data["code"];
    const messages = {
      401: TOOL_TEXT[608], // coming
      402: TOOL_TEXT[609], // end
      403: TOOL_TEXT[627], // 次数不足
      420: "", // 长度不符合
      504: TOOL_TEXT[627], // 次数已达上线
      default: TOOL_TEXT[627], // 网络异常
    };
    const message = messages[_key] || messages.default;
    if (_key == 200) {
      // 成功 刷新页面
      // getInfo()
      // TOOL_toast({ text: TOOL_TEXT[60] })
      rewardList.value = data.reward?.packageSpecificRewards;
      // showMicoDialog.value = true
      groupInfo.getInfo();
    } else {
      TOOL_toast({ text: message });
    }
  } catch (error) {
    // 错误处理
  } finally {
    TOOL_loading(false);
  }
};

const taskList = computed(() => {
  const isReverse = false; // 是否倒序显示
  console.log("groupInfo.tasks===", groupInfo.tasks);
  const data = unref(groupInfo.tasks);
  if (Array.isArray(data)) {
    return isReverse ? [...data]?.reverse() : data;
  } else {
    return [];
  }
});

const currentLevel = computed(() => {
  let list = taskList.value;
  let listLength = Number(list?.length) || 0;

  let curLv = 0;
  list?.forEach((item, index) => {
    if (item.progress >= item.required && curLv + 1 <= listLength) curLv++;
  });
  console.log("当前进行等级==", curLv);
  return curLv;
});

const barLength = computed(() => {
  //type 1: 分段计算 第一段是长度特殊设置, 后续段均等分
  //type 2: 分段计算 所有等级均等分
  let totalLen = 11.42; // 进度条总长度
  let len1 = 0.48; // 第一段长度
  let type = 1;
  let list = taskList.value;
  let listLength = Number(list?.length) || 0;

  let currentIndex = currentLevel.value;

  // 平均长度
  let avgLen = Number(
    type == 1 ? (totalLen - len1) / (listLength - 1) : totalLen / listLength
  ).toFixed(5);
  // 实际长度
  let resLen = 0;
  list?.forEach((item, index) => {
    let percent = Number(((item?.progress / item?.required) * 100).toFixed(5));
    let realLen = Number(index == 0 && type == 1 ? len1 : avgLen);
    let lvLen = Number(((percent * realLen) / 100).toFixed(5));
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
  console.log("resLen", resLen);
  return resLen + "rem";
});
</script>

<style lang="scss" scoped>
.bar-wrap {
  width: 7.5rem;
  min-height: 6rem;
  position: relative;

  margin-top: 0.23rem;
  margin-bottom: 1.3rem;
  direction: ltr;

  display: flex;
  flex-direction: column;

  .bar-bg {
    width: 0.4rem;
    height: 11.5rem;

    position: absolute;
    top: 0.45rem;
    left: 0.97rem;

    .bar-inner {
      height: 11.22rem;

      position: absolute;
      top: 0.02rem;
      left: 0.02rem;
      border-radius: 0.8rem;

      .act {
        width: 0.32rem;

        border-radius: 0.8rem;
        background: linear-gradient(
          270deg,
          #f86aff 0%,
          #df00be 50%,
          #ff3ed5 100%
        );
        position: relative;
      }
    }
  }

  .bar-lv-info {
    width: 7.5rem;
    height: auto;

    margin-top: 0.45rem;
    margin-left: 0.65rem;

    position: relative;
    z-index: 3;

    display: flex;

    .icon {
      width: 1.04rem;
      height: 1rem;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
      .icon {
      }

      .lv {
        width: 1.04rem;
        height: 1rem;
        position: relative;
        z-index: 2;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      .top {
        display: flex;
        .left {
          width: 2.97rem;
          display: flex;
          flex-direction: column;
          margin-left: 0.22rem;

          .text-1 {
            margin-top: 0.27rem;
            color: #faf0ff;
            font-family: "SF UI Text";
            font-size: 0.26rem;
            font-style: normal;
            font-weight: 700;
          }

          .text-2 {
            margin-top: 0.08rem;
            color: #cd8bff;
            font-family: "SF UI Text";
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 400;
          }

          .text-3 {
            margin-top: 0.04rem;
            color: #fff760;
            font-family: "SF UI Text";
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 400;
          }
        }
        .right {
          flex: 1;

          display: flex;
          flex-direction: column;
          align-items: center;
          .box {
            width: 1.16rem;
            height: 0.92524rem;
            flex-shrink: 0;

            .box-icon {
              width: 1.16rem;
              height: 0.92524rem;
              flex-shrink: 0;
            }
          }
          .num {
            width: 1.44rem;
            height: 0.4rem;
            flex-shrink: 0;
            margin-top: -0.06rem;

            position: relative;
            z-index: 2;

            span {
              margin-top: 0.03rem;
              color: #fff;
              text-align: center;
              -webkit-text-stroke-width: 2px;
              -webkit-text-stroke-color: #464646;
              font-family: "SF UI Text";
              font-size: 0.26rem;
              font-style: normal;
              font-weight: 700;
              line-height: 0.38rem; /* 146.154% */
            }

            &.act {
              span {
                color: #e100ff;
                text-align: center;
                -webkit-text-stroke-width: 2px;
                -webkit-text-stroke-color: #fff48f;
                font-family: "SF UI Text";
                font-size: 0.26rem;
                font-style: normal;
                font-weight: 700;
                line-height: 0.38rem; /* 146.154% */
              }
            }
          }

          .num-group {
            width: 1.5rem;
            height: 0.32rem;
            flex-shrink: 0;
            margin-top: 0.08rem;
            position: relative;

            color: #faf0ff;
            text-align: center;
            font-family: "SF UI Text";
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.32rem; /* 108.333% */
          }
        }
      }
      .bottom {
        width: 5rem;
        height: 1.2rem;
        flex-shrink: 0;
        margin-top: 0.18rem;
        margin-left: 0.22rem;

        display: flex;
        align-items: center;

        .optA {
          margin-left: -0.49rem;
        }

        .text {
          width: 3.71rem;
          height: 0.9rem;
          margin-left: 0.05rem;

          span {
            color: #fff;
            font-family: "SF UI Text";
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.3rem; /* 125% */
          }
        }
      }

      .span3 {
        margin-top: 0.08rem;
        color: #ac3fff;
        font-family: "SF UI Text";
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.24rem; /* 109.091% */
      }
    }

    .rew {
      width: 1.2rem;
      height: 1.2rem;

      img {
        width: 0.9rem;
        height: 0.9rem;
        flex-shrink: 0;
        object-fit: contain;
      }

      .num {
        width: 0.72rem;
        height: 0.24rem;
        flex-shrink: 0;

        position: absolute;
        top: 0.06rem;
        right: 0.06rem;
        z-index: 2;

        color: #faf0ff;
        font-family: "SF UI Text";
        font-size: 0.15rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.24rem; /* 100% */
      }
    }
  }
}
</style>
