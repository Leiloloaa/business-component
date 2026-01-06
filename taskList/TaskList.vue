<template>
  <div
    v-for="(item, idx) in groupInfo.tasks"
    v-bg="`${item.finished ? 'p2-task-finished' : 'p2-task-unfinished'}`"
    class="task-card"
    :class="`task-card${idx + 1} ${item.finished ? 'finished' : ''}`"
    :key="'task' + idx"
  >
    <Space :val="0.42" :h="0" />
    <div class="left fc ov">
      <SwiperFrame
        class="task-swiper"
        :list="item?.reward?.packageSpecificRewards"
        :swiper-options="taskSwiperOptions"
        :swiper-id="`task-swiper-${idx}`"
        :allow-touch-move="false"
      >
        <template v-slot="{ item: rewItem }">
          <div class="rew-item fc" v-bg="`rew`">
            <cdnImg :fid="rewItem?.src || rewItem?.fid" :info="rewItem" />
            <div class="desc fc" v-bg="`rew-desc`">
              <span>{{ getRew(rewItem)?.num }}</span>
            </div>
          </div>
        </template>
      </SwiperFrame>
    </div>
    <Space :val="0.48" />
    <div class="mid">
      <Rep
        class="info"
        :content="TOOL_TEXT[idx == 0 ? 61 : 62]"
        :rule="[
          {
            reg: '%s',
            eg: true,
            val: item?.required / 60,
            type: 'text',
          },
        ]"
      />

      <div class="progress ov" v-if="idx != 0">
        <div
          class="act"
          :style="{ width: (item?.progress / item?.required) * 100 + '%' }"
        ></div>
        <div class="score fc">
          <span style="color: #ffdf0d">{{ TOOL_NUM(item?.progress) }}</span>
          <span>/{{ TOOL_NUM(item?.required) }}</span>
        </div>
      </div>
    </div>
    <Space :val="0.16" />
    <div class="right fcc" v-if="0">
      <!-- status 任务按钮的状态 -1未开始、0已结束 、1未领取（完成了但没有手动领取） 、 2已领取 、3未完成（去完成）、4已完成 -->
      <div
        v-bg="`task-btn${getBtnStatus(idx, item.status)}`"
        class="task-btn fc"
        :class="{ act: item.status == 4 }"
      >
        <Outline
          :color="`0.05rem #CF0101`"
          :text="TOOL_TEXT[getBtnText(idx, item.status)]"
          :noColor="item.status != 4"
        />
      </div>
    </div>

    <div
      v-bg="`task-btn4-ok`"
      class="task-btn4-ok"
      v-EG
      v-if="idx == 0 && item.finished"
    ></div>
  </div>
</template>

<script lang="ts" setup name="TaskList">
import injectTool from "@publicComponents/injectTool";
import { toAppUrl, isLiveBanner, getRoomList } from "@publicComponents/shared";

const props = defineProps({
  list: { type: Array, default: () => [] },
  status: { type: Number },
  info: { type: Object },
  type: { type: Number },
});

const groupInfo = inject("groupInfo");
const ossUrl = inject("ossUrl");
const getRew = inject("getRew");
// 任务奖励轮播配置
const taskSwiperOptions = {
  loop: false,
  speed: 800,
  initialSlide: 0,
  slidesPerView: 2,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  navigation: false,
};

const {
  TOOL_TEXT,
  TOOL_BPFunc,
  TOOL_loading,
  TOOL_countryCode,
  TOOL_toast,
  TOOL_NUM,
  TOOL_httpClient,
} = injectTool();
const activityId = inject("activityId");

const getShowStatus = (idx) => {
  // 任务 1,2 除了阶段 1
  // 任务 3,4 3 阶段或 4 阶段
  if (idx == 0 || idx == 1) {
    if (props.info?.step == 1) {
      return false;
    } else {
      return true;
    }
  } else {
    if (props.info?.step >= 3) {
      return true;
    } else {
      return false;
    }
  }
};

const getBtnStatus = (idx, itemStatus) => {
  if (itemStatus == 4) {
    return "1";
  } else {
    return "0";
  }
};

// status 任务按钮的状态 -1未开始、0已结束 、1未领取（完成了但没有手动领取） 、 2已领取 、3未完成（去完成）、4已完成
const getBtnText = (idx, itemStatus) => {
  if (itemStatus == 4) {
    return 81;
  } else {
    return 80;
  }
};

const router = useRouter();
// 去完成跳转
const toFinish = (idx, status) => {
  if (props.status != 1) {
    TOOL_toast({ text: TOOL_TEXT[props.status == 0 ? 609 : 608] });
    return;
  }

  if (idx <= 1) {
    if (props.info?.isLive) {
      TOOL_BPFunc({ desc: "Go to the room_button_click", action: "click" });
    } else {
      TOOL_BPFunc({ desc: "Go to reserve_button_click", action: "click" });
    }
  }
  if (idx == 2) {
    TOOL_BPFunc({ desc: "Go like_button_click", action: "click" });
  }
  if (idx == 3) {
    TOOL_BPFunc({ desc: "To predict_button_click", action: "click" });
  }

  console.log(status, idx);
  if (status == "3-0") {
    // 去预约
    if (props.info?.isLive) {
      router.push("/home/page1/subpage3");
    } else {
      router.push("/home/page1/subpage1");
    }
  } else if (status == "3-1") {
    toAppUrl("live", {
      uid: props.info?.liveUid,
    });
  }
};

// 领取奖励
const getReward = (idx) => {
  TOOL_BPFunc({ desc: "Newbie Receive_click", action: "click" });
  return async () => {
    try {
      const res = await TOOL_httpClient({
        url: "/api/activity/missionImpossible/receiveReward",
        method: "get",
        params: {
          type: props?.type,
          index: idx,
        },
      });
      const { data, errorCode } = res.data;
      if (errorCode != 0) throw res;
      if (data.code === 200) {
        close();
        // 领取成功
        TOOL_toast({ text: TOOL_TEXT[64] });
      }
    } catch (error) {
      // 错误处理
    }
  };
};

// 跳转直播间
const getJumpLivingUid = async () => {
  TOOL_loading();
  try {
    const res = await TOOL_httpClient({
      url: "/api/activity/commonBusiness/jumpLiveRoom",
      method: "get",
      params: {
        activityId,
      },
    });
    const { data, errorCode } = res.data;
    if (errorCode != 0) throw res;
    toAppUrl("live", { uid: data?.userInfo?.uid, roomId: data?.roomId });
  } catch (error) {
    // 错误处理
  } finally {
    TOOL_loading(false);
  }
};
</script>

<style lang="scss" scoped>
.task-card {
  width: 6.88742rem;
  height: 2.14rem;

  margin: 0 auto;
  margin-bottom: -0.1rem;

  display: flex;
  align-items: center;

  position: relative;

  &.finished {
    .mid {
      .info {
        margin-top: -0.5rem;
        color: #fff;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.32rem; /* 123.077% */
      }
    }
  }

  .left {
    width: 2.52rem;
    height: 1.2rem;
    position: relative;

    .task-swiper {
      width: 100%;
      height: 100%;

      .rew-item {
        width: 1.2rem;
        height: 1.2rem;
        position: relative;

        img {
          width: 0.85714rem;
          height: 0.85714rem;
          object-fit: contain;
        }

        .desc {
          width: 1.04rem;
          height: 0.32rem;
          position: absolute;
          top: 0;
          right: 0;

          span {
            color: #af1400;
            text-align: center;
            font-family: "SF UI Text";
            font-size: 0.2rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.2rem; /* 100% */
          }
        }
      }
    }
  }

  .mid {
    width: 3.14rem;

    display: flex;
    flex-direction: column;

    .info {
      color: #fff;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.28rem; /* 116.667% */
    }

    .progress {
      width: 2.8rem;
      height: 0.24rem;

      margin-top: 0.16rem;

      border-radius: 0.4rem;
      background: #0e2cc1;

      position: relative;

      .act {
        height: 0.24rem;
        flex-shrink: 0;

        border-radius: 0.4rem;
        border-radius: 0.4rem;
        background: linear-gradient(
          180deg,
          #6aff00 0%,
          #0095b6 54%,
          #00a9cf 100%
        );
        box-shadow: 0 4px 4px 0 #aef inset;
      }

      .score {
        width: 2.8rem;
        height: 0.24rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        direction: ltr;
        span {
          color: #e5ffef;
          font-family: "SF UI Text";
          font-size: 0.2rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.32rem;
        }
      }
    }
  }

  .right {
    .task-btn {
      width: 1.82rem;
      height: 0.76rem;
      flex-shrink: 0;

      span {
        color: #acacac;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
        letter-spacing: -0.00805rem;
      }
      &.act {
        span {
          color: #fff4a4;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #cf0101;
          font-family: "SF UI Text";
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          letter-spacing: -0.00805rem;
          line-height: 0.32rem; /* 133.333% */
        }
      }
    }

    .task-btn3-0 {
      span {
        color: #fff4a4;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #7b004c;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
        letter-spacing: -0.00805rem;
      }
    }

    .task-btn3-1 {
      span {
        color: #fff4a4;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #cf0101;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
        letter-spacing: -0.00805rem;
      }
    }

    .task-btn4 {
      span {
        color: #c1b7c0;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #2d061e;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
        letter-spacing: -0.00805rem;
      }
    }
  }

  .task-btn4-ok {
    width: 0.68rem;
    height: 0.66rem;
    flex-shrink: 0;
    position: absolute;
    right: 0.42rem;
    bottom: 0.36rem;
  }
}
</style>
