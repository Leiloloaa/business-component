<template>
  <div class="progress-wrap">
    <!-- <OssImg src="g-p-desc" class="progress-desc" tag="img"></OssImg> -->
    <div class="progress" ref="progressRef">
      <img :src="`${ossUrl}/g-p-bg.png`" alt="" class="obg" />

      <div class="progress-inner">
        <div
          class="act"
          v-EG.self
          :style="{
            width: barHeight
          }"
        ></div>

        <div class="score fc">
          <div style="direction: ltr">
            <span style="color: #a65b00">{{
              TOOL_NUM(curScore >= reqScore ? curScore : reqScore)
            }}</span>
            <span>/{{ TOOL_NUM(reqScore) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="progress">
import injectTool from '@publicComponents/injectTool'
import useBar from './hooks/useBar'

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_NUM } = injectTool()
const groupInfo: any = inject('groupInfo')

const ossUrl = inject('ossUrl')
const progressRef: any = ref()

// status 状态 -1未开始、0已结束 、1未领取（完成了但没有手动领取）、 2已领取 、3未完成（去完成）、4已完成

// 使用 useBar hook 计算进度条高度
// type 1: 当前等级 curProgress/curRequired
// type 2: 所有等级 curProgress/totalRequired
// type 3: 分段计算 第一段是长度特殊设置, 后续段均等分
// type 4: 分段计算 所有等级均等分
const useBarResult = computed(() =>
  useBar({
    list: groupInfo.task?.task,
    type: 4,
    totalLen: OutWidth.value, // 总长度，对应 progress-inner 的宽度
    lenStart: 0.36, // 第一段长度
    isReverse: false
  })
)

const barHeight = computed(() => {
  return (groupInfo.curTotal / groupInfo.per) * 5.66 + 'rem'
})
const curStatus = computed(() => useBarResult.value.curStatus.value)
const curScore = computed(() => useBarResult.value.curScore.value)
const reqScore = computed(() => useBarResult.value.reqScore.value)
</script>

<style lang="scss" scoped>
.progress-wrap {
  width: auto;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  .info {
    width: 5.82rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .span1 {
      color: #ff9b7a;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 300;
      line-height: 0.3rem; /* 125% */
    }

    .span2 {
      color: #ffdeb6;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem; /* 125% */
    }
  }

  .desc {
    margin-top: -0.1rem;
    display: flex;

    .step {
      position: relative;
      .s {
        width: 0.3rem;
        height: 0.3rem;
        flex-shrink: 0;
        object-fit: contain;
      }

      .bottom {
        position: absolute;
        top: 0.3rem;
        left: -0.95rem;

        .img {
          width: 0.444rem;
          height: 0.444rem;
          flex-shrink: 0;
          object-fit: contain;
          margin-right: 0.05rem;
        }

        .text {
          min-width: 1.2rem;
          height: 0.56rem;

          span {
            color: #e9886b;
            text-align: center;
            font-family: 'SF UI Text';
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 300;
            line-height: 0.28rem; /* 116.667% */
          }
        }
      }

      &.act {
        position: relative;

        .bottom {
          position: absolute;
          top: 0.3rem;
          left: -0.95rem;

          .text {
            // width: 1.7rem;
            span {
              color: #ffdeb6;
              text-align: center;
              font-family: 'SF UI Text';
              font-size: 0.24rem;
              font-style: normal;
              font-weight: 300;
              line-height: 0.28rem; /* 116.667% */
            }
          }
        }
      }
    }
  }

  .progress {
    width: 5.82rem;
    height: 0.73rem;
    flex-shrink: 0;

    margin-top: 0.3rem;

    position: relative;
    display: flex;
    align-items: center;

    .progress-inner {
      width: 5.66rem;
      height: 0.46rem;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      border-radius: 1rem;

      margin: 0 auto;
      margin-top: 0.03rem;

      .act {
        height: 0.46rem;
        border-radius: 1rem;
        background: linear-gradient(180deg, #ff9e27 0%, #fff5cb 34.14%, #ffb233 100%);
        z-index: 1;
      }
    }

    .score {
      width: 100%;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
      direction: ltr;

      span {
        color: #ff5a4a;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.28rem;
      }
    }
  }
}
</style>
