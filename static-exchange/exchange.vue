<template>
  <RankFrame :title="TOOL_TEXT[97]" type="v1p1_2">
    <div class="exchange-wrap">
      <div class="title fc">
        <Outline
          :color="1 ? '0.05rem #003D3D' : '0.05rem #581604'"
          :text="TOOL_TEXT[98]"
        />
      </div>
      <div class="info" v-bg="`ex-info`">
        <!-- <Space :val="0.23" :h="0" />
        <Avatar
          :data="pageInfo?.userInfo || {}"
          :pic="{ sofa: 'sofa', frame: 'a', live: 'live' }"
          :option="{ radius: 1, live: 1, alwaysLive: 0, jump: 1 }"
          :type="'a80'"
        />
        <Space :val="0.2" :h="0" /> -->

        <!-- <div class="info-name ov">{{ pageInfo?.userInfo?.name }}</div>
        <Space :val="TOOL_countryCode == 'EG' ? 0.4 : 0.24" /> -->
        <div v-bg="`ex-count`" class="info-count fc">
          <Outline
            :color="1 ? '0.05rem #FFF27B' : '0.05rem #581604'"
            :text="TOOL_NUM(pageInfo?.resourceCount)"
          />
          <Space :val="0.08" :h="0" />
          <img :src="`${ossUrl}/ex-icon.png`" class="ex-icon" alt="" />
        </div>
        <div
          v-bg="`ex-record`"
          class="info-record fc"
          @click="showRecordD"
        ></div>
        <!-- <Space :val="1.71" :h="0" />
        -->
      </div>

      <div class="item-wrap">
        <div
          v-bg="`ex-item`"
          class="item"
          v-for="(item, index) in pageInfo.exchangeRewards"
        >
          <Space :val="0.42" h />
          <!-- v-bg="`ex-rew`" -->
          <div class="item-rew fc">
            <Outline
              :color="'0.05rem #4D0000'"
              :text="getRew(item?.reward).num"
              class="count"
            />
            <cdnImg :info="item?.reward"></cdnImg>
            <!-- <img :src="`${ossUrl}/item-grad.png`" class="item-grad" alt="" /> -->

            <div class="remain fc">
              <Outline
                :color="'0.05rem #F9FFC8'"
                :text="TOOL_TEXT[621] + TOOL_NUM(item?.remainStock)"
              />
            </div>
          </div>

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
            <Outline color="0.05rem #FFF27B" :text="item?.required" />
          </div>

          <!-- 未开始,已结束,无库存 -->
          <div
            v-bg="'ex-btn'"
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
          </div>

          <div
            v-bg="'ex-btn-act'"
            class="btn act"
            v-else
            @click="exchange(item, index)"
            v-animate
          >
            <Outline color="0.05rem #FFFAAE" :text="TOOL_TEXT[619]" noColor />
          </div>

          <div class="limit">
            <span>{{ TOOL_TEXT[101] }}</span>
            <span class="limit-num">{{
              item?.privateStock - item?.remainPrivateStock
            }}</span>
            <span>{{ `/${item?.privateStock}` }}</span>
          </div>
        </div>
      </div>

      <Dialog v-model="pageInfo.showRecord" :frame="false">
        <ExchangeRank />
      </Dialog>

      <!-- <Dialog v-model="pageInfo.showDialogStatus" :frame="false">
        <ExchangeDialogStatus :type="pageInfo.type" />
      </Dialog> -->
    </div>
  </RankFrame>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";
import ExchangeRank from "./ExchangeRank.vue";
// import ExchangeDialogStatus from './ExchangeDialogStatus.vue'

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
  TOOL_BPFunc({ desc: `Exchange ${idx + 1}`, action: "click" });
  pageInfo.actItem = item;
  console.log("idx", idx);
  pageInfo.actIdx = idx + 1;
  // 需要 2 次确认弹框就开启
  // pageInfo.showTwoConfirm = true
  // 直接兑换
  toExchange();
};

const getInfo = async () => {
  TOOL_loading();
  const url = "/api/activity/commonBusiness/exchangeInfo";
  try {
    const res = await TOOL_httpClient({
      url: url,
      method: "get",
      params: {
        activityId,
      },
    });
    const { data, errorCode } = res.data;
    if (errorCode != 0) throw res;
    Object.assign(pageInfo, data);
  } catch (error) {
    // 错误处理
  } finally {
    TOOL_loading(false);
  }
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
  try {
    const res = await TOOL_httpClient({
      url: url,
      method: "post",
    });
    const { data, errorCode } = res.data;
    if (errorCode != 0) throw res;

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
  } catch (error) {
    // 错误处理
  } finally {
    TOOL_loading(false);
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
  padding-top: 1.76rem;

  .title {
    width: 6rem;
    span {
      color: #f9ffc8;
      text-align: center;
      text-shadow: 0 1px 10px rgba(21, 61, 44, 0.6);
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #003d3d;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.34rem; /* 130.769% */
    }
  }

  .info {
    width: 6.06rem;
    height: 0.48rem;
    flex-shrink: 0;

    margin-top: 0.16rem;
    margin-bottom: 0.24rem;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

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
      .ex-icon {
        width: 0.34rem;
        height: 0.34rem;
        flex-shrink: 0;
      }

      span {
        color: #f50;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #fff27b;
        font-family: "SF UI Text";
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 800;
        line-height: 0.3rem; /* 100% */
      }
    }

    .info-record {
      width: 0.72rem;
      height: 0.72rem;
      flex-shrink: 0;

      position: absolute;
      top: -0.25rem;
      right: 0;

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
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 0.1rem;
    margin-bottom: 1.21rem;
    .item {
      width: 2rem;
      height: 3.92rem;
      flex-shrink: 0;

      margin-bottom: 0.16rem;

      display: flex;
      align-items: center;
      flex-direction: column;

      position: relative;
      // 奖励图片
      .item-rew {
        width: 1.44rem;
        height: 1.44rem;
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
          width: 1.44rem;
          height: 1.44rem;
          object-fit: contain;
        }

        .count {
          position: absolute;
          top: 0.12rem;
          right: -0.06rem;

          color: #fffc4a;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #6d1800;
          font-family: "SF UI Text";
          font-size: 0.26rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.26rem; /* 100% */
        }

        .remain {
          width: 1.68rem;
          flex-shrink: 0;
          position: absolute;
          bottom: 0.1rem;
          z-index: 4;

          white-space: pre-line;
          display: flex;
          align-items: center;
          flex-direction: column;
          span {
            color: #d94100;
            text-align: center;
            -webkit-text-stroke-width: 2px;
            -webkit-text-stroke-color: #f9ffc8;
            font-family: "SF UI Text";
            font-size: 0.22rem;
            font-style: normal;
            font-weight: 700;
            line-height: 0.24rem; /* 109.091% */
            &.act {
              color: #fffc2a;
            }
          }
        }
      }

      .name {
        width: 1.68rem;
        height: 0.4rem;
        margin: 0.08rem auto 0;

        color: #f50;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #fff27b;
        font-family: "SF UI Text";
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 800;
        line-height: 0.3rem; /* 100% */
      }

      .num {
        height: 0.4rem;
        margin-top: 0.08rem;
        span {
          color: #f50;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #fff27b;
          font-family: "SF UI Text";
          font-size: 0.3rem;
          font-style: normal;
          font-weight: 800;
          line-height: 0.3rem; /* 100% */
        }

        .ex-icon {
          width: 0.34rem;
          height: 0.34rem;
          flex-shrink: 0;
          object-fit: contain;
        }
      }

      .btn {
        width: 1.64rem;
        height: 0.52rem;
        margin-top: 0.08rem;

        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 1.6rem;

          color: #fdffeb;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.24rem; /* 100% */
        }
        &.act {
          span {
            color: #fdffeb;
            text-align: center;
            font-family: "SF UI Text";
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 700;
            line-height: 0.24rem; /* 100% */
          }
        }
      }

      .limit {
        width: 1.72rem;
        height: 0.4rem;

        margin-top: 0.08rem;

        display: flex;
        align-items: center;
        justify-content: center;

        span {
          color: #d94100;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.2rem;
          font-style: normal;
          font-weight: 700;
        }

        .limit-num {
          color: #d9ff00;
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
