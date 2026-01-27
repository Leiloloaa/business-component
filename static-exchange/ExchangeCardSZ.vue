<template>
  <div v-bg="`ex-d-card`" class="card">
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
  width: 5.58rem;
  height: 1.2rem;

  margin-bottom: 0.08rem;

  display: flex;
  align-items: center;

  position: relative;

  .left {
    color: #d94100;
    text-align: right;
    font-family: 'SF UI Text';
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.24rem; /* 100% */
  }

  .right {
    .reward {
      img {
        width: 0.88rem;
        height: 0.88rem;
        object-fit: contain;
      }
    }

    span {
      color: #d94100;
      text-align: right;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.24rem; /* 100% */
    }
  }
}
</style>
