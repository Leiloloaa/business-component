<template>
  <div
    v-bg="isUser ? '' : info.idx <= 3 ? `m-card1` : 'm-card'"
    :class="['card', { top: isTop3, isUser: isUser }]"
  >
    <!-- , `top${info.idx}` -->
    <div
      class="top-info"
      :style="{ height: info.idx >= 4 && !isUser ? '100%' : '' }"
    >
      <!-- <img
        v-if="info?.status == 0 && info?.stamp"
        class="stamp"
        :src="`${ossUrl}/stamp.png`"
        v-EG
      /> -->

      <Space :val="0.15" />

      <div class="num fc">
        <img v-if="isTop3" :src="`${ossUrl}/m-num${info?.idx}.png`" alt="" />
        <Outline
          v-else
          :color="`0.05rem #DA00B9`"
          :text="info?.idx || info?.rank || '99+'"
          noColor
        />
      </div>

      <Space :val="isTop3 ? 0.14 : 0.3" />
      <OptA :data="info || {}" :option="option" />
      <Space :val="isTop3 ? 0.22 : 0.45" />

      <div>
        <Outline
          class="name ov"
          :color="'0.05rem #7D2759'"
          :text="info?.unionName || '--'"
          noColor
        />
        <div v-bg="`m-guild-score`" class="score">{{
          TOOL_NUM(info?.score) || "--"
        }}</div>
      </div>

      <Space :val="0.09" :h="0" />

      <!-- 层叠头像组件 -->
      <div class="superpose-avatar" @click="showSubRank(info)">
        <SuperposeAvatar :overlap="0.24" style="pointer-events: none">
          <div class="avatar-wrap" v-for="tp in 3">
            <OptA
              :data="info?.extraInfos?.[tp - 1] || {}"
              :option="{
                styles: cssFormat`
                  width: 0.72105rem;
                  height: 0.70713rem;
                `,
                adorns: [
                  {
                    img: 'm-a',
                    styles: `width: 100%; height:100%;`,
                  },
                ],
                avatar: cssFormat`
                  width: 0.58947rem;
                  height: 0.58947rem;
                  border-radius: 50%;
                `,
                live: `display: none;`,
                liveIcon: `width: 0.18rem;`,
              }"
            />
          </div>
        </SuperposeAvatar>
      </div>

      <Space :val="0.08" :h="0" />

      <img
        :src="`${ossUrl}/m-more.png`"
        class="more"
        @click="showSubRank(info)"
        :class="TOOL_countryCode"
      />
    </div>
    <Dialog v-model="showSubRankDialog" :frame="false">
      <DialogRank :info="subInfo" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from "@publicComponents/injectTool";
import { cssFormat } from "@publicComponents/shared";
import SuperposeAvatar from "./SuperposeAvatar.vue";
import DialogRank from "./DialogRank/DialogRank.vue";

const showSubRankDialog = ref(false);
const router = useRouter();

const props = withDefaults(
  defineProps<{
    info: any;
    isUser?: boolean;
    type?: number | string; // card 类型，不同背景
    isDailyRank?: boolean; // 日榜/总榜
  }>(),
  { isUser: false, isDailyRank: true }
);

// 可以直接粘贴 CSS 代码，使用 cssFormat`...` 模板字符串自动转换
const optionList = {
  1: {
    styles: cssFormat`
      width: 1.4rem;
      height: 1.23rem;
    `,
    adorns: [
      {
        img: "m-g-a1",
        styles: cssFormat`
          width: 100%;
          height: 100%;
        `,
      },
    ],
    avatar: cssFormat`
      width: 0.7568rem;
      height: 0.7568rem;
      border-radius: unset;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `,
  },
  2: {
    styles: cssFormat`
      width: 1.4rem;
      height: 1.23rem;
    `,
    adorns: [
      {
        img: "m-g-a2",
        styles: cssFormat`
          width: 100%;
          height: 100%;
        `,
      },
    ],
    avatar: cssFormat`
      width: 0.7568rem;
      height: 0.7568rem;
      border-radius: unset;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `,
  },
  3: {
    styles: cssFormat`
      width: 1.4rem;
      height: 1.23rem;
    `,
    adorns: [
      {
        img: "m-g-a3",
        styles: cssFormat`
          width: 100%;
          height: 100%;
        `,
      },
    ],
    avatar: cssFormat`
      width: 0.7568rem;
      height: 0.7568rem;
      border-radius: unset;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `,
  },
  0: {
    styles: cssFormat`
      width: 0.99949rem;
      height: 0.96rem;
    `,
    adorns: [
      {
        img: "m-g-a",
        styles: cssFormat`
          width: 100%;
          height: 100%;
        `,
      },
    ],
    avatar: cssFormat`
      width: 0.7568rem;
      height: 0.7568rem;
      border-radius: unset;
    `,
    live: cssFormat`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
    `,
    liveIcon: cssFormat`
      width: 0.18rem;
    `,
  },
};

const getRew = inject("getRew");
const ossUrl = inject("ossUrl");
const yohoUi = inject("yohoUi");
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool();

const isTop3 = computed(() => Number(props?.info?.idx) <= 3 && !props?.isUser); // info.idx从1开始

const option = computed(() => {
  if (isTop3.value && !props.isUser) {
    return optionList[props?.info?.idx];
  } else {
    return optionList["0"];
  }
});

const subInfo = ref<any>({});
const showSubRank = (info) => {
  subInfo.value = info;
  showSubRankDialog.value = true;
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  width: 7rem;
  height: 1.72rem;

  margin: 0 auto;
  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  .top-info {
    width: 100%;

    display: flex;
    align-items: center;

    .stamp {
      width: 2.28rem;
      height: 1.86rem;

      object-fit: contain;

      position: absolute;
      top: -0.2rem;
      right: -0.2rem;
      z-index: 48;
    }

    .num {
      width: 0.6rem;
      height: 0.6rem;

      img {
        width: 100%;
        height: 100%;
      }

      span {
        color: #ffeccf;
        text-align: center;

        /* 一级标题 */
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    .name {
      width: 1.85rem;
      height: 0.32rem;

      color: #ffeccf;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
    }

    .score {
      width: 1.76rem;
      height: 0.4rem;

      margin-top: 0.08rem;

      color: #ffeccf;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */
      text-align: center;

      line-height: 0.4rem !important;
    }

    .more {
      width: 0.4rem;
      height: 0.4rem;
      flex-shrink: 0;

      &.EG {
        // 旋转180度
        transform: rotate(180deg);
      }
    }
  }

  &.top1 {
    .top-info {
      .num {
        span {
        }
      }

      .name {
        color: #ec00b9;
        // text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.34rem; /* 130.769% */
      }

      .score {
      }
    }
  }

  &.top2 {
    .top-info {
      .num {
        span {
        }
      }

      .name {
        color: #fff5c7;
        // text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.34rem; /* 130.769% */
      }

      .score {
      }
    }
  }

  &.top3 {
    .top-info {
      .num {
        span {
        }
      }

      .name {
        color: #c30399;
        // text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.34rem; /* 130.769% */
      }

      .score {
      }
    }
  }

  &.isUser {
    .top-info {
      .num {
        span {
          color: #ffeccf;
          text-align: center;

          /* 一级标题 */
          font-family: Arial;
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }

      .name {
        color: #ffeccf;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
      }

      .score {
        color: #fff4dc;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 133.333% */
      }

      .honor-bg {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    }
  }

  &.bInfo {
    flex-direction: column;
  }
}
</style>
