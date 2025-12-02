<template>
  <OssImg
    src="m-info"
    class="info fc"
    :class="{ 'card-user': isCardStyle, 'normal-user': !isCardStyle }"
  >
    <Card :info="{ ...info, idx: info.rank }" isUser v-if="isCardStyle" />
    <div class="cards" v-else>
      <!-- 自定义 -->
    </div>
  </OssImg>
</template>

<script lang="ts" setup name="userInfo">
import injectTool from '@publicComponents/injectTool'
import Card from './Card.vue'

const { TOOL_countryCode, TOOL_NUM } = injectTool()
const imgUrl = inject('imgUrl')

defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  isCardStyle: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.info {
  width: 7.5rem;
  height: 1.82rem;

  position: fixed;
  left: 0rem;
  bottom: -0.01rem;
  z-index: 49;

  :deep(.card) {
    background: none !important;
    margin-bottom: 0rem !important;
    .top-info {
      height: 100%;

      .stamp {
        display: none !important;
      }
    }
  }

  .normal-user {
    &::after {
      z-index: -1;
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
    }

    .cards {
      display: flex;
      align-items: center;
      width: 6.5rem;

      margin: 0 auto;

      position: relative;

      .num {
        width: 0.6rem;
        height: 0.74rem;

        span {
          color: #fff;
          text-align: center;
          font-family: Arial;
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .name {
        width: 2.01rem;
        height: 0.4rem;
        color: #fff;
        font-family: Arial;
        font-size: 0.35rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: center;
        margin-left: 0.2rem;
        margin-right: 0.5rem;
      }

      .score {
        width: 1.72rem;
        height: 0.42rem;
        flex-shrink: 0;

        color: #fff;
        font-family: Arial;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 400;

        // 行高要注意和 height 保持，有时还得 padding-top
        line-height: 0.42rem;

        text-align: center;
      }
    }
  }
}
</style>
