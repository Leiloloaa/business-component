<template>
  <!-- idx 从 1 开始 -->
  <div
    v-bg="isUser ? 'info' : info.idx <= 3 ? `card1` : 'card'"
    class="card"
    :class="{
      top: Number(info.idx) <= 3 && !isUser,
      isUser: isUser,
    }"
  >
    <div
      v-if="info?.status == 0 && info?.stamp"
      v-bg="`stamp`"
      class="stamp"
      tag="img"
    ></div>
    <div class="content">
      <!-- 新人 -->
      <div
        class="new-or-back fc"
        v-if="info.name && !isUser && info?.isNewUser"
      >
        <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />
        <NoticeBar :w="1.32" :h="0.28">
          <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
        </NoticeBar>
      </div>

      <!-- 新人 -->
      <div
        class="new-or-back fc"
        :class="`new-or-back-right`"
        v-if="info?.cp?.name && !isUser && info?.cp?.isNewUser"
      >
        <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />
        <NoticeBar :w="1.32" :h="0.28">
          <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
        </NoticeBar>
      </div>

      <div class="num" v-if="!isTop3">{{ info.idx }}</div>

      <div class="left">
        <div class="user-info">
          <OptA :data="info || {}" :option="option" />

          <span class="name ov">
            {{ info.name || "---" }}
          </span>
        </div>

        <!-- 奖励信息 -->
        <div
          v-bg="`cp-bottom-info`"
          class="bottom-info fc"
          v-if="!isUser && Number(info.idx) <= 3 && userReward?.length > 0"
        >
          <NoticeBar :w="2" :h="0.8">
            <template v-for="rewardObj in userReward">
              <template
                v-if="
                  info.idx >= rewardObj?.start && info.idx <= rewardObj?.end
                "
              >
                <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
                  <div v-bg="`b-rew`" class="rew fc">
                    <cdnImg :info="gift" />
                  </div>
                  <div class="text-wrap">
                    <Outline
                      :color="1 ? '0.05rem #E0007F' : '0.05rem #581604'"
                      :text="getRew(gift)?.num"
                      :noColor="false"
                      class="text text-name"
                    />
                  </div>
                </div>
              </template>
            </template>
          </NoticeBar>
        </div>
      </div>

      <div class="middle">
        <img
          v-if="isTop3"
          :src="`${ossUrl}/num${info.idx}.png`"
          alt=""
          class="top-rank"
        />

        <div
          class="cp-type"
          v-bg="getCpType(info.gender, info.cp?.gender)"
          tag="png"
        />
        <div v-bg="`score`" class="score fc">{{
          TOOL_NUM(info.score) || "--"
        }}</div>
      </div>

      <div class="right part" :class="{ isUser }">
        <div class="user-info">
          <OptA :data="info?.cp || {}" :option="option" />
          <span class="name ov"> {{ info?.cp?.name || "---" }} </span>
        </div>

        <!-- 奖励信息 -->
        <div
          v-bg="`cp-bottom-info`"
          class="bottom-info fc"
          v-if="!isUser && Number(info.idx) <= 3 && cpReward?.length > 0"
        >
          <NoticeBar :w="2" :h="0.8">
            <template v-for="rewardObj in cpReward">
              <template
                v-if="
                  info.idx >= rewardObj?.start && info.idx <= rewardObj?.end
                "
              >
                <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
                  <div v-bg="`b-rew`" class="rew fc">
                    <cdnImg :info="gift" />
                  </div>
                  <div class="text-wrap">
                    <Outline
                      :color="1 ? '0.05rem #E0007F' : '0.05rem #581604'"
                      :text="getRew(gift)?.num"
                      :noColor="false"
                      class="text text-name"
                    />
                  </div>
                </div>
              </template>
            </template>
          </NoticeBar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from "@publicComponents/injectTool";
import { css } from "@publicComponents/shared";

const getRew = inject("getRew");
const imgUrl = inject("imgUrl");
const isDaily = inject("isDaily", false);
const { TOOL_countryCode, TOOL_TEXT, TOOL_NUM } = injectTool();
const rankLoadInfo = inject("rankLoadInfo");
const ossUrl = inject("ossUrl");

const props = withDefaults(
  defineProps<{
    info: any;
    isUser?: boolean;
    type?: string; // card 类型，不同背景
    idx?: number | string;
    isLink?: boolean;
  }>(),
  { isUser: false, isLink: false, idx: 0 }
);

// 获取cp类型 男-男 'mm' 女-女 'ff' 男-女 'mf'
const getCpType = (gender1, gender2) => {
  if (gender1 == gender2 && gender1 == 2) {
    return "cp-mm";
  } else if (gender1 == gender2 && gender1 == 1) {
    return "cp-ff";
  } else {
    return "cp-mf";
  }
};

const userReward = computed(() => {
  let gender = props.info?.gender;
  if (gender === 1) {
    return rankLoadInfo.reward.femaleReward ?? [];
  } else {
    return rankLoadInfo.reward.maleReward ?? [];
  }
});

const cpReward = computed(() => {
  let gender = props.info?.cp?.gender;
  if (gender === 1) {
    return rankLoadInfo.reward.femaleReward ?? [];
  } else {
    return rankLoadInfo.reward.maleReward ?? [];
  }
});

const optionList = {
  0: {
    styles: css`
      width: 1.425rem;
      height: 1.425rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a",
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: css`
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `,
  },
  1: {
    styles: css`
      width: 1.39484rem;
      height: 1.40719rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a1",
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: css`
      width: 0.9875rem;
      height: 0.9875rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `,
  },
  2: {
    styles: css`
      width: 1.39484rem;
      height: 1.40719rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a2",
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: css`
      width: 0.9875rem;
      height: 0.9875rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `,
  },
  3: {
    styles: css`
      width: 1.39484rem;
      height: 1.40719rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a3",
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: css`
      width: 0.9875rem;
      height: 0.9875rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `,
  },
};

const isTop3 = computed(() => Number(props?.info?.idx) <= 3 && !props?.isUser); // info.idx从1开始

const option = computed(() => {
  if (isTop3.value && !props.isUser) {
    return optionList[props?.info?.idx];
  } else {
    return optionList["0"];
  }
});
</script>

<style lang="scss" scoped>
::v-deep(.van-notice-bar__wrap) {
  justify-content: center !important;
}

.card {
  width: 7.18rem;
  height: 1.82rem;

  flex-shrink: 0;

  margin: 0 auto 0.16rem;

  display: flex;
  justify-content: center;

  position: relative;

  .stamp {
    width: 1.42rem;
    // height: 0.84rem;

    position: absolute;
    top: -0.2rem;
    right: 1.8rem;
    z-index: 98;
  }

  .content {
    width: 7.18rem;
    height: 1.82rem;

    display: flex;
    justify-content: center;

    direction: ltr;

    .new-or-back {
      width: 1.32rem;
      height: 0.32rem;
      flex-shrink: 0;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: 0rem;
      left: 0.2rem;
      z-index: 5;

      &.new-or-back-right {
        left: auto;
        right: 0.2rem;

        img {
          transform: scaleX(-1);
        }
      }

      span {
        position: relative;
        z-index: 2;

        color: #f7e1ff;
        font-family: "SF UI Text";
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.28rem; /* 127.273% */

        text-align: center;
      }
    }

    .num {
      height: 1.82rem;

      color: #faf0ff;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 700;
      line-height: 1.82rem; /* 114.286% */
    }

    .left,
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 2rem;

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .name {
        width: 1.64rem;
        min-height: 0.34rem;

        margin-top: -0.2rem;

        color: #fdffe7;
        text-align: center;
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.34rem; /* 130.769% */
      }

      .bottom-info {
        width: 3.04rem;
        height: 0.8rem;

        display: flex;
        justify-content: center;
        align-items: center;

        .b-icon {
          width: 0.69818rem;
          height: 0.71255rem;
          flex-shrink: 0;
        }

        .rew-wrap {
          width: 0.64rem;
          height: 0.64rem;
          position: relative;
          margin-left: 0.14rem;
          margin-right: 0.14rem;

          .rew {
            width: 0.64rem;
            height: 0.64rem;
            flex-shrink: 0;

            position: relative;

            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 0.56rem;
              height: 0.56rem;
              flex-shrink: 0;
              object-fit: contain;
            }
          }

          .text-wrap {
            position: absolute;
            top: 0.1rem;
            right: 0rem;

            display: flex;
            justify-content: center;
            align-items: center;

            .text {
              color: #fff7e1;
              -webkit-text-stroke-width: 2px;
              -webkit-text-stroke-color: #e0007f;
              font-family: "SF UI Text";
              font-size: 0.16rem;
              font-style: normal;
              font-weight: 700;
              line-height: 0.16rem; /* 100% */
            }
          }
        }
      }
    }

    .middle {
      width: 2.3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.1rem;

      .top-rank {
        width: 0.64rem;
        height: 0.55rem;
        flex-shrink: 0;
      }

      .cp-level {
        color: #ff471d;
        font-size: 0.28rem;
        font-weight: 700;
        line-height: 0.28rem; /* 100% */
      }

      .cp-type {
        width: 0.8rem;
        height: 0.8rem;
        margin-top: 0.13rem;
      }

      .score {
        width: 1.76rem;
        height: 0.4rem;

        margin-top: -0.18rem;

        position: relative;
        z-index: 2;

        flex-shrink: 0;
        color: #faf0ff;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.4rem; /* 145.455% */
      }
    }
  }
}

.top {
  width: 7.18rem;
  height: 3rem !important;

  > img {
    z-index: -10;
  }

  .content {
    height: 3rem !important;

    .new-or-back {
      top: 0.28rem;
    }

    .left,
    .right {
      margin-top: 0.33rem;

      .name {
        margin-top: 0 !important;
      }
    }
  }

  .bottom-bg {
    width: 6.64rem;
    height: 0.8rem;
    position: absolute;
    left: 50%;
    bottom: 0.16rem;
    transform: translateX(-50%);
    z-index: -1;
  }
}
.isUser {
  width: 7.5rem;
  height: 1.68rem;
  margin-bottom: 0;
  .content {
    .user-idx {
      flex-shrink: 0;
      color: #fdffe6;
      font-size: 0.28rem;
      font-weight: 700;
      line-height: normal;
      margin-top: 0.1rem;
    }
    .user-link {
      flex-shrink: 0;
      color: #ff3700;
      font-size: 0.24rem;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */
      margin-top: 0.1rem;
    }
  }

  .middle {
    margin-top: -0.1rem !important;
    top: 0;
    width: 1.6rem;
  }
}
</style>
