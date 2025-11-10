<template>
  <OssImg
    :src="type == 6 ? 'g-d-bg' : 'g-d-bg2'"
    class="draw-status-dialog"
    :class="`draw-status-dialog-${type}`"
  >
    <!-- type -->
    <!-- 1: 勾选下次不在提示弹框 -->
    <!-- 2: 单个奖励弹框 -->
    <!-- 3: 多个奖励弹框 -->
    <!-- 4: 错误提示 -->
    <!-- 5: 数量不足 -->
    <!-- 6: 奖励表格 -->
    <template v-if="type == 1">
      <Space :val="0.64" h />
      <div class="title">
        {{ TOOL_TEXT[62] }}
      </div>
      <div class="tip fc">
        <img :src="`${ossUrl}/d-sel0.png`" alt="" v-if="!isSelect" @click="isSelect = true" />
        <img :src="`${ossUrl}/d-sel1.png`" alt="" v-else @click="isSelect = false" />
        <Space :val="0.16" />
        <span>{{ TOOL_TEXT[65] }}</span>
      </div>
      <div class="btn-list fc">
        <OssImg src="d-confirm" class="btn confirm fc" @click="confirm">
          <span>{{ TOOL_TEXT[618] }}</span>
        </OssImg>
        <Space :val="0.16" />
        <OssImg src="d-cancel" class="btn cancel fc" @click="hide">
          <span>{{ TOOL_TEXT[617] }}</span>
        </OssImg>
      </div>
    </template>

    <template v-if="type == 2">
      <Space :val="0.8" h />
      <div class="title">
        {{ TOOL_TEXT[58] }}
      </div>
      <Space :val="0.4" h />
      <Rew
        :reward="rewardList[0] || {}"
        :options="{
          size: 'd-rew', // 尺寸
          corner: true, // 角标
          name: false, // 奖励名称 麦圈
          coin: false, // 金币
          num: false, // 天数、数量
          effectFid: false, // 动图
          playIcon: false, // 展示播放按钮
          nameW: 1.22, // 奖励名称宽度
          nameH: 0.32, // 奖励名称高度
          useOutline: true, // 外边框
          outline: `0.05rem #5E005C`
        }"
      />
      <Space :val="0.4" h />
      <OssImg
        :src="groupInfo.curStatus == 4 ? 'd-big-confirm' : 'd-big-confirm-act'"
        :class="{ act: groupInfo.curStatus == 4 }"
        class="big-btn fc"
        @click="confirm"
      >
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 3">
      <Space :val="1.51" h />
      <div class="title" v-html="TOOL_TEXT[57]?.replace('%s', Number(73 + groupInfo.num))" />
      <Space :val="0.39" h />
      <div class="rew-list fc">
        <Rew
          :reward="rewardList[0] || {}"
          :options="{
            size: 'g-rew-d2', // 尺寸
            bgObj: {
              rew: 'g-rew',
              corner: 'g-corner'
              // coin: 'g-coin'
            },
            num: false,
            name: false,
            corner: true,
            coin: false,
            effectFid: false, // 动图
            playIcon: false, // 展示播放按钮
            nameW: 1.5, // 奖励名称宽度
            nameH: 0.32, // 奖励名称高度
            useOutline: false, // 外边框
            outline: `0.05rem #090F07`,
            nameNoScroll: true
          }"
        />

        <Space :val="0.36" />

        <Rew
          :reward="rewardList[1] || {}"
          :options="{
            size: 'g-rew-d2', // 尺寸
            bgObj: {
              rew: 'g-rew',
              corner: 'g-corner'
              // coin: 'g-coin'
            },
            num: false,
            name: false,
            corner: true,
            coin: false,
            effectFid: false, // 动图
            playIcon: false, // 展示播放按钮
            nameW: 1.5, // 奖励名称宽度
            nameH: 0.32, // 奖励名称高度
            useOutline: false, // 外边框
            outline: `0.05rem #090F07`,
            nameNoScroll: true
          }"
        />
      </div>
      <Space :val="0.85" h />
      <OssImg src="g-d2-btn-act" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 4">
      <Space :val="0.64" h />
      <div class="title">
        {{ TOOL_TEXT[26] }}
      </div>
      <Space :val="0.4" h />
      <img :src="`${ossUrl}/fail.png`" class="fail" />
      <Space :val="0.24" h />
      <div class="tip3">
        {{ TOOL_TEXT[27] }}
      </div>
      <Space :val="0.6" h />
      <OssImg src="d-big-confirm" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 5">
      <Space :val="0.64" h />
      <div class="title">
        {{ TOOL_TEXT[28] }}
      </div>
      <Space :val="0.4" h />
      <img :src="`${ossUrl}/fail.png`" class="fail" />

      <Space :val="0.6" h />
      <OssImg src="d-big-confirm" class="big-btn fc" @click="confirm">
        <Outline
          :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
          :text="TOOL_TEXT[618]"
          noColor
        />
      </OssImg>
    </template>

    <template v-if="type == 6">
      <Space :val="0.19" :h="1" />

      <div class="content">
        <OssImg src="reward-table" class="reward-table">
          <div class="th fc">
            <div
              class="item fc"
              :class="{ item1: idx + 1 == 1, item2: idx + 1 != 1 }"
              v-for="(item, idx) in [57, 73, 74, 75]"
              style="height: 0.94rem"
            >
              <span>{{ TOOL_TEXT[item] }}</span>
            </div>
          </div>
          <!-- 表格有五行 4 四 -->
          <div class="tb fc" v-for="(item, index) in 4">
            <div class="item" v-for="(i, idx) in 4" style="height: 1.69rem">
              <div v-if="i == 1" class="item1 fc" style="height: 1.69rem">
                <span>{{ TOOL_TEXT[cityText[index]] }}</span>
              </div>
              <div class="item2 fc" v-else style="height: 1.69rem">
                <Rew
                  :reward="
                    i == 2
                      ? groupInfo.rewards?.[index]?.common?.[0]
                      : i == 3
                      ? groupInfo.rewards?.[index]?.suc?.[0]
                      : groupInfo.rewards?.[index]?.per?.[0]
                  "
                  :options="{
                    size: 'd-rew', // 尺寸
                    bgObj: {
                      rew: 'rew',
                      corner: 'conor'
                      // coin: 'g-coin'
                    },
                    corner: true, // 角标
                    name: false, // 奖励名称 麦圈
                    coin: false, // 金币
                    num: false, // 天数、数量
                    effectFid: false, // 动图
                    playIcon: false, // 展示播放按钮
                    nameW: 1.22, // 奖励名称宽度
                    nameH: 0.32, // 奖励名称高度
                    useOutline: false, // 外边框
                    outline: `0.05rem #090F07`
                  }"
                />
                <img
                  :src="`${ossUrl}/reward-table-yes.png`"
                  alt=""
                  class="yes"
                  v-if="
                    i == 2
                      ? groupInfo.rewards?.[index]?.commonFlag
                      : i == 3
                      ? groupInfo.rewards?.[index]?.sucFlag
                      : groupInfo.rewards?.[index]?.perFlag
                  "
                />
              </div>
            </div>
          </div>
        </OssImg>
      </div>
    </template>
  </OssImg>
</template>

<script lang="ts" setup name="DrawStatusDialog">
import injectTool from '@publicComponents/injectTool'
import { toAppUrl } from '@publicComponents/shared'
import useRequest from '@hooks/useRequest'

const cityText = [102, 104, 106, 108]
const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_NUM } = injectTool()
const ossUrl = inject('ossUrl')
const groupInfo: any = inject('groupInfo')
const emit = defineEmits(['hide', 'confirm', 'changePageInfo'])
const props = defineProps({
  type: {},
  rewardList: {},
  urlType: {},
  pIndex: {},
  pIndexAct: {}
})
const tabType = ref(0)
const changeTab = (idx) => {
  tabType.value = idx
}

const rewardsList = computed(() => {
  return tabType.value == 0 ? groupInfo.sub2?.guardianReward : groupInfo.sub2?.attackReward
})
const pageInfo = reactive({ idx: 1 })

const isSelect = ref(false)

const selIdx = (item) => {
  pageInfo.idx = item
}

const toDraw = (idx) => {
  console.log(idx)
  if (idx == 1) {
    confirm()
  } else {
    hide()
  }
}

const hide = () => {
  emit('hide')
}

const confirm = () => {
  console.log(pageInfo.idx)
  emit('confirm', {
    selIdx: pageInfo.idx
  })
}

const toRoom = () => {
  if (props.obj?.presenter == 0) {
    toAppUrl('live', { uid: props.obj?.uid })
  } else {
    toAppUrl('gift', { roomId: props.obj?.presenter, giftId: props.obj?.giftId })
  }
}
</script>

<style lang="scss" scoped>
.draw-status-dialog {
  width: 7.02rem;
  height: 6.98rem;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  &.draw-status-dialog-6 {
    width: 7.5rem;
    height: 8.78rem;

    .reward-content {
      height: 6rem;
      overflow-y: auto;
    }
  }

  .btn-list2 {
    margin-top: 0.54rem;
    .btn {
      width: 2.46rem;
      height: 0.74rem;

      margin-left: 0.08rem;
      margin-right: 0.08rem;

      span {
        color: #112155;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 108.333% */
      }

      &.act {
        span {
          color: #9c0d0d;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.26rem; /* 108.333% */
        }
      }
    }
  }

  .title2 {
    width: 5.01rem;

    color: #e5ffef;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.32rem; /* 114.286% */
    letter-spacing: -0.001rem;
  }
  .title {
    width: 4.42rem;
    height: 0.49rem;
    color: #fff;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.26rem; /* 108.333% */
  }

  .content {
    width: 100%;
    height: 6.5rem;
    overflow-y: scroll;
  }

  .reward-table {
    width: 6.08rem;
    height: 7.93rem;
    flex-shrink: 0;
    margin: 0 auto;

    .item1 {
      width: 1.13rem;
    }
    .item2 {
      width: 1.67rem;
      position: relative;
      .yes {
        width: 0.8rem;
        height: 0.8rem;
        flex-shrink: 0;
        aspect-ratio: 1/1;
        position: absolute;
        top: 0.93rem;
        right: 0rem;
        z-index: 2;
      }
    }

    .th,
    .tb {
      width: 6.08rem;

      .item {
        span {
          color: #ffdeb6;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.26rem; /* 108.333% */
        }
      }
    }
  }

  .title3 {
    width: 5.01rem;

    color: #e5ffef;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.32rem; /* 114.286% */
    letter-spacing: -0.001rem;
  }

  .list {
    margin-top: 0.6rem;
    margin-bottom: 0.76rem;

    .small-btn {
      width: 1.14rem;
      height: 0.88rem;
      flex-shrink: 0;
      position: relative;
      margin-left: 0.06rem;
      margin-right: 0.06rem;

      span {
        color: #0783e8;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.34rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.32rem; /* 94.118% */
        letter-spacing: -0.001rem;
      }

      &.act {
        span {
          color: #fff;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.34rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.32rem; /* 94.118% */
          letter-spacing: -0.001rem;
        }
      }
    }
  }

  .tip {
    margin-top: 0.24rem;

    img {
      width: 0.24rem;
      height: 0.24rem;
    }

    color: #fff;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.26rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.28rem; /* 107.692% */
    letter-spacing: -0.001rem;

    span {
      color: #ffdc5f;
      font-family: 'SF UI Text';
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.28rem;
      letter-spacing: -0.001rem;
    }
  }

  .btn-list {
    direction: ltr;
    .btn {
      width: 2.46rem;
      height: 0.74rem;

      margin-left: 0.08rem;
      margin-right: 0.08rem;

      span {
        color: #112155;
        text-align: center;
        font-family: 'SF UI Text';
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 108.333% */
      }

      &.act {
        span {
          color: #9c0d0d;
          text-align: center;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.26rem; /* 108.333% */
        }
      }
    }
  }

  .tip3 {
    width: 5.9rem;

    color: #fff;
    text-align: center;
    font-family: Arial;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem;
    /* 128.571% */
  }

  .big-btn {
    width: 3.72rem;
    height: 1.12rem;
    flex-shrink: 0;
    margin-top: 1.21rem;

    span {
      color: #362929;
      font-family: 'SF UI Text';
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 100% */
    }

    &.act {
      span {
        color: #9c0d0d;
        font-family: 'SF UI Text';
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 100% */
      }
    }
  }

  .fail {
    width: 1.44rem;
    height: 1.44rem;
    flex-shrink: 0;
  }
}
</style>
