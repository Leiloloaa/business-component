<template>
  <!-- 前三名 -->
  <div class="top-three" :class="TOOL_countryCode">
    <img :src="`${ossUrl}/top3-bg${TOOL_countryCode == 'EG' ? '' : ''}.png`" class="top3-bg" />

    <template v-for="item in [1, 0, 2]" :key="'top' + item">
      <div :class="['top-item', `top${item}`]">
        <!-- CP 双人头像 -->
        <div class="fc avatar-row" style="direction: ltr">
          <img
            :src="`${ossUrl}/stamp.png`"
            v-if="info.status == 0 && info.list[item] && info.list[item].stamp"
            class="stamp"
          />
          <!-- 左侧用户 -->
          <div class="fcc avatar-box">
            <OptA :data="info.list[item] || {}" :option="option[item]" />
            <Outline
              class="name ov"
              :color="'0.05rem #AF2300'"
              :text="info.list[item]?.name || '--'"
            />
            <!-- 分数 -->
            <div v-bg="`score`" class="score">
              {{ TOOL_NUM(info.list[item]?.cp?.score) || '---' }}
            </div>
          </div>

          <!-- CP类型图标 -->
          <div
            class="cp-type"
            v-bg="getCpType(info.list?.[item]?.gender, info.list?.[item]?.cp?.gender)"
            tag="png"
          />

          <!-- 右侧CP -->
          <div class="fcc avatar-box">
            <OptA :data="info.list[item]?.cp || {}" :option="option[item]" />
            <!-- 新人标识 -->
            <div v-if="info.list?.[item]?.cp?.isNewUser" class="new-or-back fc new-or-back-right">
              <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />
              <NoticeBar :w="1.32" :h="0.28">
                <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
              </NoticeBar>
            </div>
            <Outline
              class="name ov"
              :color="'0.05rem #AF2300'"
              :text="info.list[item]?.cp?.name || '--'"
            />
            <!-- 分数 -->
            <div v-bg="`score`" class="score">
              {{ TOOL_NUM(info.list[item]?.cp?.score) || '---' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 第一名后的间距 -->
      <Space :val="-2.2" v-if="item !== 2" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'

const ossUrl = inject('ossUrl')
const { TOOL_countryCode, TOOL_NUM, TOOL_TEXT } = injectTool()

const props = withDefaults(defineProps<{ info: any }>(), {})

// 获取cp类型 男-男 'mm' 女-女 'ff' 男-女 'mf'
const getCpType = (gender1, gender2) => {
  if (gender1 == gender2 && gender1 == 2) {
    return 'cp-mm'
  } else if (gender1 == gender2 && gender1 == 1) {
    return 'cp-ff'
  } else {
    return 'cp-mf'
  }
}

const option = {
  0: {
    styles: css`
      width: 2.36rem;
      height: 2.36rem;
      aspect-ratio: 1/1;
    `,
    adorns: [
      {
        img: 'a1',
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `
      }
    ],
    avatar: css`
      width: 1.3rem;
      height: 1.4rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  1: {
    styles: css`
      width: 1.6225rem;
      height: 1.6225rem;
      aspect-ratio: 162.25/162.25;
    `,
    adorns: [
      {
        img: 'a2',
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `
      }
    ],
    avatar: css`
      width: 0.88rem;
      height: 0.88rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  2: {
    styles: css`
      width: 1.6225rem;
      height: 1.6225rem;
      aspect-ratio: 162.25/162.25;
    `,
    adorns: [
      {
        img: 'a3',
        styles: css`
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        `
      }
    ],
    avatar: css`
      width: 0.88rem;
      height: 0.88rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  }
}
</script>

<style lang="scss" scoped>
.top-three {
  width: 7.5rem;
  height: 9.02rem;
  margin-bottom: -3rem;
  display: flex;
  justify-content: center;

  position: relative;

  .top3-bg {
    width: 6.54rem;
    height: 9.02rem;

    position: absolute;
    top: -1.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }

  .top-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    // CP 双人头像行
    .avatar-row {
      display: flex;
      align-items: flex-start;
      position: relative;

      .stamp {
        width: 2rem;
        height: 1.2rem;
        flex-shrink: 0;
        object-fit: contain;
        position: absolute;
        top: -0.18rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
      }

      .cp-type {
        width: 0.7rem;
        height: 0.73rem;
        object-fit: contain;
        margin-left: -0.45rem;
        margin-right: -0.45rem;
        z-index: 10;
      }
    }

    // 单个头像盒子
    .avatar-box {
      display: flex;
      flex-direction: column;
      align-items: center;

      .name {
        width: 1.8rem;
        height: 0.34rem;
        flex-shrink: 0;

        margin-top: -0.1rem;

        color: #ffedbd;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #af2300;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;

        position: relative;
        z-index: 5;
      }

      .score {
        width: 1.84rem;
        height: 0.48rem;
        margin-top: 0.1rem;

        color: #ffeccf;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.48rem; /* 133.333% */
      }
    }
  }

  // 第一名
  .top0 {
    z-index: 3;

    .stamp {
      right: 0.16rem;
    }

    .avatar-row .cp-type {
      margin-top: 0.8rem;
    }
  }

  // 第二名、第三名
  .top1,
  .top2 {
    margin-top: 3.2rem;

    .avatar-row .cp-type {
      width: 0.49rem;
      height: 0.511rem;
      flex-shrink: 0;
      margin-top: 0.7rem;
      margin-left: -0.2rem;
      margin-right: -0.2rem;
    }

    .avatar-box {
      .name {
        width: 1.54rem;

        color: #ffedbd;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #af2300;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .score {
        width: 1.68rem;
        height: 0.42rem;

        color: #ffeccf;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.42rem; /* 145.455% */
      }
    }
  }
}
</style>
