<template>
  <OssImg
    :src="isUser ? '' : info.idx <= 3 ? `card${info.idx}` : 'card'"
    :class="[
      'card',
      { top: isTop3, isUser: isUser, bInfo: config.showBottomInfo },
      `top${info.idx}`,
    ]"
  >
    <div
      class="top-info"
      :style="{ height: info.idx >= 4 && !isUser ? '100%' : '' }"
    >
      <img
        v-if="info?.status == 0 && info?.stamp"
        class="stamp"
        :src="`${ossUrl}/n-stamp.png`"
        v-EG
      />

      <Space :val="isTop3 ? 0.66 : 0.4" />

      <div class="num fc" v-if="!isTop3">
        <img
          v-if="config.showTop3NumIcon && isTop3"
          :src="`${ossUrl}/num${info?.idx}.png`"
          alt=""
        />
        <Outline
          v-else
          :color="`0.05rem #DA00B9`"
          :text="info?.idx || info?.rank || '99+'"
          :noColor="false"
        />
      </div>

      <Space :val="isTop3 ? 0 : 0.26" />
      <OptA :data="info || {}" :option="option" />
      <Space :val="0.24" />

      <!-- 层叠头像组件 -->
      <!-- <div class="superpose-avatar">
      <SuperposeAvatar :overlap="0.16">
        <div class="avatar-wrap" v-for="tp in 3">
          <cdnImg class="avatar" :fid="info?.top3?.[tp - 1] || ''"></cdnImg>
        </div>
      </SuperposeAvatar>
    </div> -->

      <!-- 没有荣誉勋章 -->
      <template v-if="!config.showHonor || isUser">
        <div>
          <Space
            :val="0.37"
            h
            v-if="
              ((info.isNewUser || info.isReturnUser) &&
                !isUser &&
                config.showNewOrBack) ||
              ENV == 'develop'
            "
          />
          <Outline
            class="name ov"
            :color="'0.05rem #7D2759'"
            :text="info?.name || '--'"
            noColor
          />
          <!-- 新人或回流标识 -->
          <div
            class="new-or-back fc"
            :class="TOOL_countryCode"
            v-if="
              (info.isNewUser || info.isReturnUser) &&
              !isUser &&
              config.showNewOrBack &&
              router.currentRoute.value.name != 'rankneworreturn'
            "
          >
            <img :src="`${ossUrl}/${info.isNewUser ? 'n1' : 'n1'}.png`" />
            <NoticeBar :w="1.3" :h="0.32">
              <span style="min-width: 1.3rem">{{
                TOOL_TEXT[info?.isNewUser ? 107 : 107]
              }}</span>
            </NoticeBar>
          </div>
        </div>
        <Space :val="0.2" />
        <OssImg src="score" class="score">{{
          TOOL_NUM(info?.score) || "--"
        }}</OssImg>
      </template>

      <!-- 有荣誉勋章 -->
      <template v-else>
        <div>
          <div class="fc">
            <div class="name ov">{{ info?.name || "---" }}</div>
            <Space :val="0.06" />
            <OssImg src="score" class="score">{{
              TOOL_NUM(info?.score) || "---"
            }}</OssImg>
          </div>

          <div class="honor-bg fc" v-if="info?.name">
            <Honor :data="info" />
          </div>
        </div>
      </template>
    </div>

    <!-- 奖励信息 -->
    <OssImg
      :src="`b-info` + info.idx"
      class="bottom-info fc"
      v-if="isDailyRank && !isUser && Number(info?.idx) <= config.bInfoNum"
    >
      <Space :val="0.3" />
      <img :src="`${yohoUi}/b-icon.png`" class="b-icon shake" />
      <Space :val="0.09" />
      <NoticeBar :w="6" :h="0.8">
        <template v-for="rewardObj in info?.reward">
          <template
            v-if="info?.idx >= rewardObj?.start && info?.idx <= rewardObj?.end"
          >
            <div class="rew-wrap fc" v-for="gift in rewardObj?.rewards">
              <Space :val="0.05" />
              <OssImg :src="`n-b-rew${info.idx}`" class="rew fc">
                <cdnImg :info="gift" />
              </OssImg>
              <Space :val="0.12" />
              <div class="text-wrap">
                <div class="text text-name">{{ getRew(gift)?.name }}</div>
                <div class="text text-days">{{ getRew(gift)?.num }}</div>
              </div>
            </div>
          </template>
        </template>
      </NoticeBar>
    </OssImg>
  </OssImg>
</template>

<script lang="ts" setup name="Card">
import injectTool from "@publicComponents/injectTool";
import { cssFormat } from "@publicComponents/shared";
const router = useRouter();
console.log(router.currentRoute.value.name);
const props = withDefaults(
  defineProps<{
    info: any;
    isUser?: boolean;
    type?: number | string; // card 类型，不同背景
    isDailyRank?: boolean; // 日榜/总榜
  }>(),
  { isUser: false, isDailyRank: true }
);

// 1. 配置
const config = {
  showBottomInfo: true, // 是否显示奖励信息？
  showTop3NumIcon: 0, // 是否显示前三名次图标？
  showHonor: false, // 是否显示荣誉勋章？
  bInfoNum: 3, // 前几名奖励信息？
  showNewOrBack: 1, // 是否显示新人或回流标识？
};

// 2. 使用对象形式存储样式配置
// 可以直接粘贴 CSS 代码，使用 cssFormat`...` 模板字符串自动转换
const optionList = {
  1: {
    styles: cssFormat`
      width: 1.6rem;
      height: 1.15rem;
    `,
    adorns: [
      {
        img: "a1",
        styles: cssFormat`
          width: 1.6rem;
          height: 1.15rem;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: cssFormat`
      width: 1.1rem;
      height: 1.1rem;
      flex-shrink: 0;
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
      width: 1.55375rem;
      height: 1.5675rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a2",
        styles: cssFormat`
          width: 1.55375rem;
          height: 1.5675rem;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: cssFormat`
      width: 1.1rem;
      height: 1.1rem;
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
      width: 1.55375rem;
      height: 1.5675rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a3",
        styles: cssFormat`
          width: 1.55375rem;
          height: 1.5675rem;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: cssFormat`
      width: 1.1rem;
      height: 1.1rem;
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
      width: 1.55375rem;
      height: 1.5675rem;
      flex-shrink: 0;
    `,
    adorns: [
      {
        img: "a",
        styles: cssFormat`
          width: 1.55375rem;
          height: 1.5675rem;
          flex-shrink: 0;
        `,
      },
    ],
    avatar: cssFormat`
      width: 1.1rem;
      height: 1.1rem;
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
</script>

<style lang="scss" scoped>
.card {
  width: 6.9rem;
  height: 2.37606rem;

  margin: 0 auto;
  margin-bottom: 0.04rem;

  display: flex;
  align-items: center;

  position: relative;

  &.top {
    width: 6.9rem;
    height: 2.944rem;

    .top-info {
      margin-top: 0.49rem;

      .name {
      }

      .score {
      }
    }

    .bottom-info {
      margin-top: 0rem;
    }
  }

  .top-info {
    width: 100%;
    margin-top: 0.19rem;

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
      width: 0.39rem;
      height: 0.39rem;

      img {
        width: 100%;
        height: 100%;
      }

      span {
        color: #fff5c7;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 114.286% */
      }
    }

    .name {
      width: 1.51rem;
      height: 0.34rem;

      color: #fdffe7;
      // text-align: center;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.34rem; /* 130.769% */
    }

    .new-or-back {
      width: 1.3rem;
      height: 0.32rem;
      flex-shrink: 0;
      position: relative;
      margin-left: 0.05rem;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      span {
        position: relative;
        z-index: 2;
        color: #ffe89a;
        text-align: center;
        font-family: Arial;
        font-size: 0.18rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem; /* 155.556% */
      }
    }

    .score {
      width: 1.76rem;
      height: 0.48rem;
      flex-shrink: 0;

      color: #fdffe7;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.22rem;
      font-style: normal;
      font-weight: 500;

      text-align: center;
      line-height: 0.48rem !important;
    }

    .honor-bg {
      width: 4.12rem;
      height: 0.4rem;
      flex-shrink: 0;

      margin-top: 0.16rem;
    }
  }

  .bottom-info {
    width: 6.4rem;
    height: 0.8rem;
    display: flex;
    align-items: center;

    margin-top: 0.01rem;

    .b-icon {
      width: 0.70057rem;
      height: 0.69818rem;
      flex-shrink: 0;
    }

    .rew-wrap {
      .rew {
        width: 0.64rem;
        height: 0.64rem;
        flex-shrink: 0;

        img {
          width: 0.56rem;
          height: 0.56rem;
          flex-shrink: 0;
          object-fit: contain;
        }
      }

      .text-wrap {
        min-width: 0.56rem;

        display: flex;
        justify-content: center;
        flex-direction: column;
        .text {
          color: #ffde91;
          font-family: "Geeza Pro";
          font-size: 0.22rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.28rem; /* 127.273% */
        }
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
          color: #fff5c7;
          text-align: center;
          font-family: "SF UI Text";
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.32rem; /* 114.286% */
        }
      }

      .name {
        color: #fdffe7;
        // text-align: center;
        font-family: "SF UI Text";
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.34rem; /* 130.769% */
      }

      .score {
        color: #fdffe7;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.32rem; /* 145.455% */
      }
    }
  }

  &.bInfo {
    flex-direction: column;
  }
}
</style>
