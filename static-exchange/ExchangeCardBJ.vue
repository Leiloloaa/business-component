<template>
  <div class="card">
    <Space :val="0.65" />
    <div class="left">
      <div class="top">{{ dayjs(info.createTime).format('YYYY-MM-DD') }}</div>
      <div class="bottom">{{ dayjs(info.createTime).format('hh:mm') }}</div>
    </div>
    <Space :val="1.6" />
    <div class="right fc">
      <div class="reward fc">
        <cdnImg :fid="info.effectFid || info.fid"></cdnImg>
      </div>
      <Space :val="0.16" />
      <span class="num">{{ getRew(info)?.num }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup name="Card">
import injectTool from '@publicComponents/injectTool'
import dayjs from 'dayjs'

const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

const ossUrl = inject('ossUrl')
const activityId = inject('activityId')
const getRew = inject('getRew')
const { TOOL_countryCode, TOOL_NUM } = injectTool()
</script>

<style lang="scss" scoped>
.card {
  width: 6.1rem;
  height: 1.4rem;
  flex-shrink: 0;
  @include bg('ex-c-b');

  margin: 0 auto;
  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  .left {
    .top {
      color: #eedfff;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .bottom {
      margin-top: 0.08rem;

      color: #679de0;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  .right {
    .reward {
      width: 0.72rem;
      height: 0.72rem;
      flex-shrink: 0;
      @include bg('product-item-bg');

      img {
        width: 0.72rem;
        height: 0.72rem;
        flex-shrink: 0;
        object-fit: contain;
      }
    }

    span {
      color: #eedfff;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
}
</style>
