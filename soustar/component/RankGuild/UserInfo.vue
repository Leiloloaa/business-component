<template>
  <div class="user-info">
    <Card :info="info" isUser :selDate="selDate" @viewMore="onViewMore" />
  </div>
</template>

<script lang="ts" setup>
import Card from "./Card.vue";

interface Props {
  info: Record<string, any>;
  selDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  selDate: "",
});

const emit = defineEmits<{
  (e: "viewMore", info: Record<string, any>): void;
}>();

const onViewMore = (info: Record<string, any>) => {
  emit("viewMore", info);
};
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.user-info {
  width: 7.5rem;
  height: 3.16rem;
  @include bg("guild-info");

  position: fixed;
  bottom: 0rem;
  left: 0;
  z-index: 50;

  :deep(.rank-card) {
    background: none !important;
    margin-bottom: 0rem !important;

    .top-info {
      padding-top: 0.3rem;
    }
  }
}
</style>
