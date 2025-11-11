<template>
  <RankFrame hasTop hasBottom>
    <div class="exchange-wrap">
      <div class="title">{{ TOOL_TEXT[56] }}</div>
      <div class="info">
        <Space :val="0.23" :h="0" />
        <JumpAvatar
          :data="pageInfo?.userInfo || {}"
          :pic="{ sofa: 'sofa', frame: 'a', live: 'live' }"
          :option="{ radius: 1, live: 1, alwaysLive: 0, jump: 1 }"
          :type="'a80'"
        />
        <Space :val="0.2" :h="0" />

        <div class="info-name ov">{{ pageInfo?.userInfo?.name }}</div>
        <Space :val="TOOL_countryCode == 'EG' ? 0.4 : 0.24" />
        <OssImg src="ex-count" class="info-count fc">
          <span>{{ TOOL_NUM(pageInfo?.resourceCount) }}</span>
          <Space :val="0.18" :h="0" />
          <img :src="`${ossUrl}/ex-icon.png`" class="ex-icon" alt="" />
        </OssImg>
        <Space :val="1.71" :h="0" />
        <OssImg src="ex-record" class="info-record fc" @click="showRecordD">
        </OssImg>
      </div>

      <div class="item-wrap">
        <OssImg
          src="ex-item"
          class="item"
          v-for="(item, index) in pageInfo.exchangeRewards"
        >
          <Space :val="0.42" h />

          <OssImg src="ex-rew" class="item-rew fc">
            <Outline
              :color="'0.05rem #4D0000'"
              :text="getRew(item?.reward).num"
              class="count"
            />

            <cdnImg :info="item?.reward"></cdnImg>

            <img :src="`${ossUrl}/item-grad.png`" class="item-grad" alt="" />

            <div class="remain">
              <span>
                {{ TOOL_TEXT[58] }}:{{
                  item?.privateStock - item?.remainPrivateStock
                }}{{ `/${item?.privateStock}` }}
              </span>
            </div>
          </OssImg>

          <!-- 名称 -->
          <!-- <Outline
            class="name ov"
            :color="'0.05rem #001585'"
            :text="getRew(item?.reward).name"
            noColor
          /> -->

          <!-- 数量 -->
          <div class="num fc">
            <img :src="`${ossUrl}/ex-icon.png`" class="ex-icon" alt="" />
            <Space :val="0.08" :h="0" />
            <Outline color="0.05rem #060116" :text="item?.required" noColor />
          </div>

          <!-- 未开始,已结束,无库存 -->
          <OssImg
            :src="'ex-btn'"
            class="btn"
            v-if="pageInfo?.status != 1 || item?.remainStock == 0"
          >
            <Outline
              color="0.05rem #FFFAAE"
              :text="
                TOOL_TEXT[
                  item?.remainStock == 0
                    ? 622
                    : pageInfo?.status == 0
                    ? 609
                    : 608
                ]
              "
              noColor
            />
          </OssImg>

          <OssImg
            :src="'ex-btn-act'"
            class="btn act"
            v-else
            @click="exchange(item, index)"
            v-animate
          >
            <Outline color="0.05rem #FFFAAE" :text="TOOL_TEXT[619]" noColor />
          </OssImg>

          <div class="limit fc">
            <Outline
              :color="'0.05rem #06023f'"
              :text="TOOL_TEXT[621]"
              noColor
            />
            <span class="act">{{ TOOL_NUM(item?.remainStock) }}</span>
          </div>
        </OssImg>
      </div>

      <Dialog v-model="pageInfo.showRecord" :frame="false">
        <ExchangeRank />
      </Dialog>

      <Dialog v-model="pageInfo.showDialogStatus" :frame="false">
        <ExchangeDialogStatus :type="pageInfo.type" />
      </Dialog>
    </div>
  </RankFrame>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";
import ExchangeRank from "./ExchangeRank.vue";
import ExchangeDialogStatus from "./ExchangeDialogStatus.vue";

const getRew = inject("getRew");
const {
  TOOL_BPFunc,
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_httpClient,
  TOOL_toast,
  TOOL_loading,
  TOOL_NUM,
} = injectTool();
const activityId = inject("activityId");
const pageInfo = reactive({
  showDialogStatus: false,
  showRecord: false,
  actItem: {},
  actIdx: 0,
  exchangeRewards: [],
  resourceCount: 0,
  status: -1,
  type: 1,
});

const ossUrl = inject("ossUrl");

const showRecordD = () => {
  TOOL_BPFunc({ desc: "Record_button_click", action: "click" });
  pageInfo.showRecord = true;
};
const showStatusD = (type) => {
  pageInfo.showDialogStatus = true;
  pageInfo.type = type;
};

TOOL_BPFunc({ desc: "Redeem store page_click", action: "show" });
const exchange = (item, idx) => {
  TOOL_BPFunc({ desc: `Redeem Button_click ${idx + 1}`, action: "click" });
  pageInfo.actItem = item;
  console.log("idx", idx);
  pageInfo.actIdx = idx + 1;
  // 需要 2 次确认弹框就开启
  // pageInfo.showTwoConfirm = true
  // 直接兑换
  toExchange();
};

import useApi from "@hooks/useApi";
const getInfo = async () => {
  TOOL_loading();
  const url = "/api/activity/commonBusiness/exchangeInfo";
  const data = await useApi(url, {
    activityId,
  });
  Object.assign(pageInfo, data);
  TOOL_loading(false);
};

getInfo();

const emit = defineEmits(["exchangeSuccess"]);

const toExchange = async () => {
  TOOL_loading();
  const url =
    "/api/activity/commonBusiness/exchange?activityId=" +
    activityId +
    "&index=" +
    pageInfo.actIdx;
  const data = await useApi(url, {}, "POST");
  TOOL_loading(false);

  const _key = data["code"];
  const messages = {
    200: TOOL_TEXT[626], // 兑换成功
    401: TOOL_TEXT[608], // coming
    402: TOOL_TEXT[609], // end
    403: TOOL_TEXT[623], // 积分不足
    420: "", // 长度不符合
    461: TOOL_TEXT[624], // 库存为0
    462: TOOL_TEXT[628]
      ?.replace("%s", pageInfo.actItem?.privateStock)
      ?.replace("s%", pageInfo.actItem?.privateStock),
    default: TOOL_TEXT[627], // 网络异常
  };
  const message = messages[_key] || messages.default;
  if (_key == 200) {
    TOOL_toast({ text: message });
    // 成功 刷新页面
    getInfo();
    // 通知父组件兑换成功，让父组件也刷新数据
    emit("exchangeSuccess");
  } else {
    TOOL_toast({ text: message });
  }
};

defineExpose({ getInfo });
</script>

<style lang="scss" scoped>
.exchange-wrap {
  width: 7.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;

  .info-before {
    width: 7.06rem;
    height: 11.62rem;
    flex-shrink: 0;
    position: absolute;
    top: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .title {
    flex-shrink: 0;
    margin-top: 0.18rem;

    display: flex;
    justify-content: center;
    color: #800;
    text-align: center;
    font-family: "SF UI Text";
    font-size: 0.3rem;
    font-style: normal;
    font-weight: 800;
    line-height: 0.3rem; /* 100% */

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

    .exchange-que {
      width: 0.64rem;
      height: 0.64rem;
      flex-shrink: 0;

      position: absolute;
      top: 0.32rem;
      right: 0rem;
      z-index: 1;
    }
  }

  .info {
    width: 6.9rem;
    height: 0.72rem;
    flex-shrink: 0;

    margin-top: 0.32rem;
    margin-bottom: 0.32rem;

    display: flex;
    align-items: center;

    .info-name {
      width: 1.94rem;

      color: #fff387;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem; /* 130.769% */
    }

    .info-count {
      width: 1.44rem;
      height: 0.4rem;
      flex-shrink: 0;
      direction: ltr;
      .ex-icon {
        margin-right: -0.8rem;
        width: 0.946rem;
        height: 0.48rem;
        flex-shrink: 0;
      }

      span {
        color: #ff9537;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 100% */
      }
    }

    .info-record {
      width: 0.72rem;
      height: 0.72rem;
      flex-shrink: 0;

      span {
        color: #fdffe7;
        text-align: center;
        font-family: Arial;
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 100% */
      }
    }
  }

  .item-wrap {
    margin-bottom: 0.78rem;
    padding: 0 0.24rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.15rem;
    .item {
      width: 2.24rem;
      height: 3.92rem;

      margin-bottom: 0.24rem;

      display: flex;
      align-items: center;
      flex-direction: column;

      position: relative;
      // 奖励图片
      .item-rew {
        width: 1.68rem;
        height: 1.68rem;
        position: relative;
        .item-grad {
          width: 1.68rem;
          height: 0.56rem;
          flex-shrink: 0;
          position: absolute;
          top: 1.12rem;
          z-index: 3;
          left: 50%;
          transform: translateX(-50%);
        }

        img {
          width: 1.4rem;
          height: 1.4rem;
          object-fit: contain;
        }

        .count {
          position: absolute;
          top: 0.16rem;
          right: 0.2rem;

          color: #fffc2a;
          font-family: "SF UI Text";
          font-size: 0.26rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.26rem; /* 100% */
        }

        .remain {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.677rem;
          flex-shrink: 0;
          position: absolute;
          bottom: 0.11rem;
          z-index: 4;

          span {
            color: #faffd3;
            text-align: center;
            font-family: "SF UI Text";
            font-size: 0.2rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.22rem; /* 110% */
          }
        }
      }

      .name {
        width: 1.68rem;
        height: 0.4rem;
        margin: 0.08rem auto 0;
        color: #fff996;

        text-align: center;
        -webkit-text-stroke-width: 2;
        -webkit-text-stroke-color: #001585;
        font-family: Al-Jazeera-Arabic;
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.4rem; /* 133.333% */
      }

      .num {
        height: 0.4rem;
        margin-top: 0.08rem;
        span {
          color: #ff9537;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.3rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.38rem; /* 126.667% */
        }

        .ex-icon {
          width: 0.473rem;
          height: 0.24rem;
          flex-shrink: 0;
          object-fit: contain;
        }
      }

      .btn {
        width: 1.72rem;
        height: 0.56rem;
        flex-shrink: 0;
        margin-top: 0.08rem;

        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 1.6rem;

          color: #2f2121;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.24rem; /* 100% */
        }
        &.act {
          span {
            color: #800;
          }
        }
      }

      .limit {
        width: 1.72rem;

        margin-top: 0.08rem;

        white-space: pre-line;
        display: flex;
        align-items: center;
        flex-direction: column;
        span {
          color: #faffd3;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.2rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.24rem; /* 120% */
          &.act {
            color: #fffc2a;
          }
        }
      }
    }
  }
}

.reconfirm-wrap {
  width: 6.82rem;
  height: 6.12rem;
  flex-shrink: 0;

  margin: 0 auto;

  display: flex;
  align-items: center;
  flex-direction: column;
  .title {
    width: 6.4rem;
    // height: 1.6rem;

    margin: 0 auto;
    margin-top: 1.3rem;
    margin-bottom: 0.28rem;

    span {
      color: #fff;

      text-align: center;
      text-shadow: 0px 0.04rem 0.04rem rgba(27, 14, 174, 0.25);
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.32rem; /* 123.077% */
    }
  }
  // 奖励图片
  .item-item {
    width: 1.68rem;
    height: 1.68rem;

    position: relative;
    img {
      width: 1.4rem;
      height: 1.4rem;
      object-fit: contain;
    }
    .count {
      position: absolute;
      top: 0.16rem;
      right: 0.2rem;

      color: #fff996;

      text-align: right;
      -webkit-text-stroke-width: 2;
      -webkit-text-stroke-color: #001585;
      font-family: Al-Jazeera-Arabic;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.4rem; /* 153.846% */
    }
    .remain {
      width: 2rem;
      // height: 0.48rem;
      flex-shrink: 0;
      position: absolute;
      bottom: 0.09rem;
      color: #fcffff;

      text-align: center;
      -webkit-text-stroke-width: 1;
      -webkit-text-stroke-color: #060484;
      font-family: Arial;
      font-size: 0.22rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
  .btn-wrap {
    margin-top: 0.46rem;

    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      width: 2.18rem;
      height: 0.58rem;

      margin: 0 0.16rem;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        color: #1b389d;
        text-align: center;
        font-family: Arial;
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem; /* 107.692% */
      }
      &.act {
        span {
          color: #d24400;
          text-align: center;
          font-family: "Geeza Pro";
          font-size: 0.26rem;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }
    }
  }
  .tips {
    margin-top: 2rem;
    margin-bottom: 1.2rem;
    span {
      width: 4.94rem;
      color: #fff8d4;
      text-align: center;
      font-family: Al-Jazeera-Arabic;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.4rem; /* 142.857% */
      white-space: pre-line;
      &::before {
        white-space: pre-line;
      }
    }
  }
}
</style>
