<template>
  <img :src="`${ossUrl}/${cpType}.png`" alt="" />
</template>

<script lang="ts" setup name="CpType">
import { inject } from 'vue'
const ossUrl = inject('ossUrl')
const props = defineProps<{
  info?: any
}>()

// 获取cp类型
// PROJECT == 1: 使用字段 relation (1 恋人 2 兄弟 3 姐妹)
// PROJECT == 2: 使用字段 relateType (1 cp 2 挚友 3 知己)
const cpType = computed(() => {
  const relationCode = PROJECT == 1 ? props.info?.relation : props.info?.relateType
  if (PROJECT == 1) {
    if (relationCode == 1) {
      return 'cp-mf'
    } else if (relationCode == 2) {
      return 'cp-mm'
    } else if (relationCode == 3) {
      return 'cp-ff'
    } else {
      return 'cp-mf'
    }
  } else if (PROJECT == 2) {
    if (relationCode == 1) {
      return 'cp-hy1'
    } else if (relationCode == 2) {
      return 'cp-hy2'
    } else if (relationCode == 3) {
      return 'cp-hy3'
    } else {
      return 'cp-hy1'
    }
  }
  return 'cp-mf'
})
</script>

<style lang="scss" scoped></style>
