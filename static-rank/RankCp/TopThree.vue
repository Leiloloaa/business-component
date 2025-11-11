<template>
  <!-- 前三名 -->
  <OssImg src="top3-bg" class="top-three" :class="TOOL_countryCode">
    <template v-for="item in [0]" :key="'top' + info.idx">
      <div :class="['top-item', `top0`]">
        <div class="fc" style="direction: ltr">
          <OssImg
            src="stamp"
            v-if="info.list[item] && info.status == 0 && info.list[item].stamp"
            class="stamp"
            tag="png"
          />

          <div class="fcc avatar-box" :class="{ 'top1-avatar': item === 0 }">
            <OptA :data="info.list[item] || {}" :option="option[0]" />
            <!-- 新人或回流标识 -->

            <div
              v-if="info.list?.[item] && info.list[item]?.isNewUser"
              class="new-or-back fc"
              :class="`new-or-back-${TOOL_countryCode}`"
            >
              <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />

              <NoticeBar :w="1.32" :h="0.28">
                <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
              </NoticeBar>
            </div>
            <Outline
              class="name ov"
              :color="'0.05rem #fff9c5'"
              :text="(info.list[item] && info.list[item].name) || '--'"
            />
          </div>

          <Space :val="item == 0 ? -0.6 : -0.9" />

          <div class="fcc avatar-box" :class="{ 'top1-avatar': item === 0 }">
            <OptA :data="info.list[item]?.cp || {}" :option="option[0]" />
            <!-- 新人或回流标识 -->
            <div
              class="new-or-back fc"
              :class="`new-or-back-right`"
              v-if="info.list?.[item] && info.list[item]?.cp?.isNewUser"
            >
              <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />

              <NoticeBar :w="1.32" :h="0.28">
                <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
              </NoticeBar>
            </div>
            <Outline
              class="name ov"
              :color="'0.05rem #fff9c5'"
              :text="(info.list[item] && info.list[item].cp?.name) || '--'"
            />
          </div>
        </div>

        <OssImg
          class="cp-type"
          :src="getCpType(info.list?.[item]?.gender, info.list?.[item]?.cp?.gender)"
          tag="png"
        />

        <OssImg src="score" class="score ov">
          {{ (info.list[item] && TOOL_NUM(info.list[item].score)) || '---' }}
        </OssImg>
      </div>

      <Space :val="-2.9" v-if="item !== 2" />
    </template>
    <div class="second-line fc">
      <template v-for="item in [1, 2]" :key="'top' + item">
        <div :class="['top-item', `top${item}`]">
          <div class="fc" style="direction: ltr">
            <OssImg
              src="stamp"
              v-if="info.list[item] && info.status == 0 && info.list[item].stamp"
              class="stamp"
              tag="png"
            />

            <div class="fcc avatar-box" :class="{ 'top1-avatar': item === 0 }">
              <OptA :data="info.list[item] || {}" :option="option[item]" />
              <!-- 新人或回流标识 -->
              <div
                class="new-or-back fc"
                :class="`new-or-back-right`"
                v-if="info.list?.[item] && info.list[item]?.isNewUser"
              >
                <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />

                <NoticeBar :w="1.32" :h="0.28">
                  <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
                </NoticeBar>
              </div>
              <Outline
                class="name ov"
                :color="'0.05rem #fff9c5'"
                :text="(info.list[item] && info.list[item].name) || '--'"
              />
            </div>

            <div class="fcc avatar-box" :class="{ 'top1-avatar': item === 0 }">
              <OptA :data="info.list[item]?.cp || {}" :option="option[item]" />
              <!-- 新人或回流标识 -->
              <div
                class="new-or-back fc"
                :class="`new-or-back-right`"
                v-if="info.list?.[item] && info.list[item]?.cp?.isNewUser"
              >
                <img class="obg" :src="`${ossUrl}/n1.png`" alt="" />

                <NoticeBar :w="1.32" :h="0.28">
                  <span style="min-width: 1.32rem">{{ TOOL_TEXT[733] }}</span>
                </NoticeBar>
              </div>
              <Outline
                class="name ov"
                :color="'0.05rem #fff9c5'"
                :text="(info.list[item] && info.list[item].cp?.name) || '--'"
              />
            </div>
          </div>

          <OssImg
            class="cp-type"
            :src="getCpType(info.list?.[item]?.gender, info.list?.[item]?.cp?.gender)"
            tag="png"
          />

          <OssImg src="score" class="score ov">
            {{ (info.list[item] && TOOL_NUM(info.list[item].score)) || '---' }}
          </OssImg>
        </div>
      </template>
    </div>
  </OssImg>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import OptA from '../../static-common/OptA.vue'
import { css } from '../../static-common/tool'

const imgUrl = inject('imgUrl')
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
      width: 2.11875rem;
      height: 2.1375rem;
      flex-shrink: 0;
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
      width: 1.5rem;
      height: 1.5rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  1: {
    styles: css`
      width: 1.80094rem;
      height: 1.81688rem;
      flex-shrink: 0;
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
      width: 1.275rem;
      height: 1.275rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
    `,
    liveIcon: css`
      width: 0.18rem;
    `
  },
  2: {
    styles: css`
      width: 1.80094rem;
      height: 1.81688rem;
      flex-shrink: 0;
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
      width: 1.275rem;
      height: 1.275rem;
    `,
    live: css`
      width: 0.41rem;
      height: 0.24rem;
      bottom: 0rem;
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
  height: 9.93rem;
  flex-shrink: 0;
  margin: 0 auto;
  position: relative;
  margin-bottom: -3.8rem;
  padding-top: 0.21rem;

  :deep(> img) {
    top: -3.15rem !important;
  }

  .top-item {
    width: fit-content;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    .cp-type {
      width: 0.7rem;
      height: 0.73rem;
      flex-shrink: 0;
      object-fit: contain;

      position: absolute;
      top: 0.95rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 11;
    }

    .stamp {
      width: 1.42rem;
      // height: 0.84rem;
      flex-shrink: 0;
      object-fit: contain;
      position: absolute;
      top: -0.18rem;
      right: 32%;
      z-index: 4;

      &.EG {
        left: -0.5rem;
        right: auto;
      }
    }

    .name {
      width: 2.5rem;
      margin-bottom: 0.08rem;

      color: #e100bc;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #fff9c5;
      font-family: 'SF UI Text';
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.3rem; /* 115.385% */

      text-align: center;

      position: relative;
      z-index: 5;
    }

    .score {
      width: 1.76rem;
      height: 0.4rem;
      flex-shrink: 0;

      position: relative;
      z-index: 10;

      color: #faf0ff;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.22rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.32rem; /* 145.455% */

      line-height: 0.4rem;
    }
  }
  .avatar-box {
    margin: 0 -0.3rem;

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
        font-family: 'SF UI Text';
        font-size: 0.22rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.28rem; /* 127.273% */

        text-align: center;
      }
    }
  }
  .top1-avatar {
    margin: 0 0.2rem;
  }

  .top0 {
    margin: auto;
    z-index: 3;
    width: 5.49rem;
    height: 2.74854rem;
    .score {
      margin-top: -0.8rem;
    }
  }

  .top1,
  .top2 {
    width: 50%;
    z-index: 5;
    .cp-type {
      top: 0.4rem;
    }
    .score {
      z-index: 100;
      margin-top: -1rem;
    }

    .name{
      width: 2.3rem;
    }
  }
}
.second-line {
  // margin-top: 0.2rem;
}
</style>
