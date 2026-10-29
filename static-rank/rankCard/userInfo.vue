<template>
  <div
    v-bg="`info`"
    class="info fc"
    :class="{ 'card-user': isCardStyle, 'normal-user': !isCardStyle }"
  >
    <Card :info="{ ...info, idx: info.rank }" isUser v-if="isCardStyle" />
    <div class="cards" v-else>
      <!-- 自定义 -->
    </div>
  </div>
</template>

<script lang="ts" setup name="userInfo">
import injectTool from '@publicComponents/injectTool'
import Card from './Card.vue'

const { TOOL_countryCode, TOOL_NUM } = injectTool()

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
  height: 1.96rem;

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
}
</style>
