<template>
  <!-- 前三名 -->
  <div class="top-three" :class="TOOL_countryCode">
    <img :src="`${imgUrl}/top3-bg${TOOL_countryCode == 'EG' ? '-EG' : ''}.png`" class="top3-bg" />
    <template v-for="item in [1, 0, 2]" :key="'top' + info.idx">
      <div :class="['top-item', `top${item + 1}`]">
        <div class="fc">
          <img
            v-if="info.list[item] && info.status == 0 && info.list[item].stamp"
            :src="`${imgUrl}/stamp.png`"
            alt=""
            class="stamp"
            v-img
          />
          <div v-jump.family="info.list?.[item]?.other">
            <OptA
              :data="{ ...info.list[item], avatar: info.list?.[item]?.other?.cover } || {}"
              :option="option[item]"
              style="pointer-events: none"
            />
          </div>
        </div>

        <div class="name-wrap fc">
          <Outline
            class="name ov"
            :color="'0.05rem #FFFDD0'"
            :text="(info.list[item] && info.list[item].other?.name) || '--'"
            noColor
          />
        </div>

        <div class="score ov">
          {{ (info.list[item] && TOOL_NUM(info.list[item]?.score)) || '--' }}
        </div>

        <div class="box-score">
          <Space :val="0.17" />
          <img :src="`${imgUrl}/fa-score-icon.png${webp}`" class="score-icon" />
          <Space :val="0.08" />
          <span>{{ TOOL_NUM(info.list?.[item]?.other1) || '--' }}</span>
        </div>

        <!-- 层叠头像组件 -->
        <SuperposeAvatar :overlap="0.4">
          <div class="avatar-container" v-for="tp in 3" @click="showToast(info.list[item])">
            <OptA
              :data="info.list?.[item]?.extraInfos?.[tp - 1] || {}"
              :option="option.optionSmall"
              style="pointer-events: none"
            />
          </div>
        </SuperposeAvatar>
      </div>
      <!-- 第一名和二三名的间距 -->
      <Space :val="-0.9" v-if="item !== 2" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import OptA from '../../static-common/OptA.vue'
import { css } from '../../static-common/tool'

const imgUrl = inject('imgUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT, TOOL_BPFunc } = injectTool()

const props = withDefaults(defineProps<{ info: any }>(), {})
const route = useRoute()
const rankStatus = inject('rankStatus')
const showToast = (info) => {
  if (!info.name) return
  TOOL_BPFunc({
    desc: `${
      route.path.includes('/familynewrank') ? 'NEW' : ' '
    }Family ${'Total'} Contribution List_page`,
    action: 'show'
  })
  rankStatus.isDailyRank = false
  rankStatus.showDialog = true
  rankStatus.curInfo = info
}

const option = {
  0: {
    styles: css`
      width: 3.251rem;
      height: 3.251rem;
    `,
    adorns: [
      {
        img: 'fa-a1',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.82rem;
      height: 1.82rem;
      top: 0.9rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.7rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  1: {
    styles: css`
      width: 3.251rem;
      height: 3.251rem;
    `,
    adorns: [
      {
        img: 'fa-a2',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.82rem;
      height: 1.82rem;
      top: 0.9rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.7rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  2: {
    styles: css`
      width: 3.251rem;
      height: 3.251rem;
    `,
    adorns: [
      {
        img: 'fa-a3',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.82rem;
      height: 1.82rem;
      top: 0.9rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.7rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  optionSmall: {
    styles: css`
      width: 0.98rem;
      height: 0.98rem;
    `,
    adorns: [
      {
        img: 'fa-a',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.72rem;
      height: 0.72rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  }
}
</script>

<style lang="scss" scoped>
.top-three {
  width: 7.5rem;
  margin: 0 auto;
  margin-top: 0.79rem;
  margin-bottom: 0.6rem;

  display: flex;
  justify-content: center;
  position: relative;

  .top3-bg {
    width: 7.5rem;
    height: 7.18rem;

    position: absolute;
    top: -1.92rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .top-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    .desc {
      position: absolute;
      top: -0.25rem;
      left: 50%;
      transform: translateX(-50%);

      width: 0.8rem;
      height: 0.8rem;
      flex-shrink: 0;
      z-index: 9;
    }

    .stamp {
      width: 1.78rem;
      height: 1.02rem;

      object-fit: contain;

      position: absolute;
      top: 0.9rem;
      right: -0.34rem;
      z-index: 4;

      &.EG {
        left: -0.34rem;
        right: auto;
      }
    }

    .name-wrap {
      width: 2.08rem;
      height: 0.34rem;
      flex-shrink: 0;

      background: linear-gradient(
        270deg,
        rgba(206, 124, 0, 0) 6.69%,
        #d64d1b 49.89%,
        rgba(206, 124, 0, 0) 92.85%
      );
      margin-top: -0.6rem;
      margin-bottom: 0.09rem;
      position: relative;
      z-index: 19;
    }

    .name {
      width: 1.76rem;

      color: #f0ffec;
      text-align: center;

      /* 内文 */
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.34rem; /* 108.333% */

      text-align: center;

      position: relative;
      z-index: 5;
    }

    .score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;
      margin-bottom: 0.04rem;
      // margin-top: 0.07rem;

      color: #fffce1;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 133.333% */

      text-align: center;
      line-height: 0.48rem;
    }

    .box-score {
      width: 1.84rem;
      height: 0.48rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;

      img {
        width: 0.42rem;
        height: 0.25246rem;
      }

      span {
        color: #fff0cc;

        /* 内文 */
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;

        text-align: center;
        line-height: 0.48rem;
      }
    }

    .honor-wrap {
      margin-top: 0.05rem;
      margin-bottom: 0.07rem;
      width: 2.08rem;
      height: 0.82rem;
      flex-shrink: 0;
      // min-height: 0.86rem;
      flex-shrink: 0;

    }
  }

  .top1 {
    z-index: 3;

    .desc {
      right: 0.16rem;
    }

    .stamp {
      top: 0.28rem;
    }
  }

  .top2,
  .top3 {
    margin-top: 0.6rem;

    .stamp {
      // top: 2rem;
      right: -0.07rem;
    }
  }
}
</style>
