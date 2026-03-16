<template>
  <div class="user-info">
    <Card :info="info" isUser />
  </div>
</template>

<script lang="ts" setup>
import Card from "./Card.vue";

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.user-info {
  width: 7.5rem;
  height: 1.68rem;
  @include bg("info");

  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 50;

  :deep(.rank-card) {
    background: none !important;
    margin-bottom: 0rem !important;
    margin-top: -0.15rem;
    padding-top: 0rem;
  }
}
</style>
