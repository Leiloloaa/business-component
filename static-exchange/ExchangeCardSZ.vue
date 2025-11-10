<template>
  <OssImg src="ex-card" class="card">
    <Space :val="0.48" />
    <div class="left">
      {{ dayjs(info.createTime).format('MM-DD HH:mm:ss') }}
    </div>
    <Space :val="1.5" />

    <div class="right fc">
      <div class="reward fc">
        <cdnImg :fid="info.effectFid || info.fid"></cdnImg>
      </div>
      <Space :val="0.08" />
      <span class="num">{{ getRew(info)?.num }}</span>
    </div>
  </OssImg>
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
  width: 5.94rem;
  height: 1.2rem;

  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  .left {
    color: #ff9537;
    font-family: 'SF UI Text';
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem; /* 128.571% */
  }

  .right {
    .reward {
      img {
        width: 0.56rem;
        height: 0.56rem;
        object-fit: contain;
      }
    }

    span {
      color: #ff9537;
      text-align: right;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.24rem; /* 100% */
    }
  }
}
</style>
