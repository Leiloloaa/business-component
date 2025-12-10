<template>
  <!-- info.idx 从 1 开始 -->
  <div class="card" :class="{ top: isTop3 && isDaily && computedIsDaily }">
    <div class="card-img" v-bg="'family-card1'"></div>
    <div class="up">
      <Space :val="0.24" />
      <!-- 排名 -->
      <div class="num fc">
        <span>{{ info.idx }}</span>
      </div>
      <Space :val="0.16" />
      <!-- 头像 -->
      <OptA :data="info || {}" :option="option" />
      <Space :val="0.16" />

      <div class="name ov">{{ info.name || "---" }}</div>

      <Space :val="0.29" />
      <div class="score ov fc">
        <div class="score-img" v-bg="'score'"></div>
        {{ TOOL_NUM(info.score) || "---" }}
      </div>
    </div>

    <div
      class="bottom-info"
      v-if="isDaily && !isUser && Number(info.idx) <= 3 && computedIsDaily"
    >
      <div class="bottom-info-img" v-bg="'family/d-f-b-info'"></div>
      <Space :val="0.38" />
      <div class="gift-icon shake">
        <div class="gift-icon-img" v-bg="'b-icon'"></div>
      </div>
      <Space :val="0.16" />
      <!-- <div class="reward-tip">{{ TOOL_TEXT[100] }}</div> -->
      <NoticeBar :w="4.5" :h="0.8">
        <div style="display: flex; align-items: center">
          <template v-for="rewardObj in info.reward">
            <template
              v-if="info.idx >= rewardObj.start && info.idx <= rewardObj.end"
            >
              <div class="gift-wrap" v-for="gift in rewardObj.rewards">
                <Space :val="0.05" />
                <div v-bg="`b-rew`" class="gift-box">
                  <cdnImg class="gift" :info="gift"></cdnImg>
                </div>
                <Space :val="0.12" />
                <div class="msg-wrap">
                  <div class="text">{{ getRew(gift).name }}</div>
                  <div class="text">{{ getRew(gift).num }}</div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </NoticeBar>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from "@publicComponents/injectTool";
import { cssFormat } from "@publicComponents/shared";

const props = withDefaults(
  defineProps<{
    info: any;
    isUser?: boolean;
    type?: number; // card 类型，不同背景
  }>(),
  { isUser: false }
);
const homeInfo = inject("homeInfo");
const getRew = inject("getRew");

const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");

const isTop3 = computed(() => {
  return Number(props.info.idx) <= 3;
});

const rankTempInfo = inject("rankTempInfo");
const computedIsDaily = computed(() => {
  return props.info.reward?.length >= props.info.idx;
});

const isDaily = computed(() => {
  return rankTempInfo.isDaily;
});

const option = {
  styles: cssFormat`
    width: 0.79rem;
    height: 0.88rem;
  `,
  adorns: [
    {
      img: "f-a",
      styles: cssFormat`
        width: 100%;
        height: 100%;
      `,
    },
  ],
  avatar: cssFormat`
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 0.15rem;
  `,
  live: cssFormat`
    width: 0.36rem;
    height: 0.24rem;
    bottom: 0.05rem;
    display: none;
  `,
  liveIcon: cssFormat`
    width: 0.29rem;
  `,
};
</script>

<style lang="scss" scoped>
.card {
  width: 5.8rem;
  height: 1.2rem;
  position: relative;

  display: flex;
  align-items: center;

  &.top {
    width: 5.8rem;
    height: 1.92rem;

    flex-direction: column;
  }

  .card-img {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;
  }

  margin: 0 auto;
  margin-bottom: 0.16rem;

  position: relative;

  .stamp {
    width: 1.32457rem;
    height: 1.2591rem;
    flex-shrink: 0;

    position: absolute;
    top: -0.41rem;
    right: 0.09rem;
    z-index: 98;
  }

  .num {
    width: 0.34rem;
    height: 0.34rem;

    img {
      width: 0.6rem;
      height: 0.48rem;
      flex-shrink: 0;
    }

    span {
      color: #ffffb6;
      text-align: center;
      font-family: Arial;
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .name {
    width: 1.81rem;
    color: #ffffb6;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem;
    /* 133.333% */
  }

  .score {
    width: 1.6rem;
    height: 0.4rem;

    position: relative;

    .score-img {
      width: 100%;
      height: 100%;

      position: absolute;
      top: 0;
      left: 0;
    }

    color: #ffffb6;
    text-align: center;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem;
    /* 133.333% */
  }

  .up {
    display: flex;
    align-items: center;
  }

  padding-top: 0.08rem;

  &.top {
    width: 5.7rem;
    height: 2.11rem;
    flex-shrink: 0;
    padding-top: 0.07rem;

    .bottom-info {
      width: 5.7rem;
      height: 0.8rem;
      flex-shrink: 0;

      position: relative;

      .bottom-info-img {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;
      }

      display: flex;
      align-items: center;
      margin-top: 0.14rem;

      .gift-icon {
        width: 0.48rem;
        height: 0.48rem;
        object-fit: contain;

        position: relative;

        .gift-icon-img {
          width: 100%;
          height: 100%;

          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .reward-tip {
        color: #ffffb6;
        font-family: Arial;
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem;
        /* 127.273% */
      }

      .gift-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        .gift-box {
          width: 0.64rem;
          height: 0.64rem;
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          .gift {
            width: 0.56rem;
            height: 0.56rem;
            flex-shrink: 0;
            object-fit: contain;
          }

          .super {
            width: 0.56rem;
            height: 0.56rem;
            flex-shrink: 0;
            object-fit: contain;
          }
        }

        .msg-wrap {
          min-width: 0.56rem;

          display: flex;
          justify-content: center;
          flex-direction: column;

          .text {
            color: #ffffb6;
            font-family: Arial;
            font-size: 0.22rem;
            font-style: normal;
            font-weight: 700;
            line-height: 0.28rem;
            /* 127.273% */
          }
        }
      }
    }
  }
}
</style>
