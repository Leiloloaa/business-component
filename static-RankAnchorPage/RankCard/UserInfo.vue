<template>
  <div v-bg="`info`" class="info fc">
    <Card :info="{ ...info, idx: info.rank }" isUser v-if="info.isOnTheRank" />
  </div>
</template>

<script lang="ts" setup name="userInfo">
import Card from './Card.vue'

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
}
</style>
