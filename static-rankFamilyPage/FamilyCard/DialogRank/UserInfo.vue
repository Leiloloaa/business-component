<template>
  <div
    class="info fc"
    v-if="
      rankTempInfo?.curInfo?.familyInfo?.familyId == info.familyInfo?.familyId ||
      info.other == 1 ||
      info.other == 2
    "
  >
    <div class="info-img" v-bg="'family/d-f-info'"></div>
    <Card :info="{ ...info, idx: info.rank }" isUser v-if="isCardStyle" />
    <div class="cards" v-else>
      <!-- 自定义 -->
    </div>
  </div>
</template>

<script lang="ts" setup name="userInfo">
import injectTool from '@publicComponents/injectTool'
import Card from './DialogCard.vue'

const { TOOL_countryCode, TOOL_NUM } = injectTool()
const ossUrl = inject('ossUrl')
const rankTempInfo = inject('rankTempInfo')

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  isCardStyle: {
    type: Boolean,
    default: false
  }
})

console.log(
  'rankTempInfo?.familyInfo?.familyId == info.familyInfo?.familyId || info.other != 3',
  rankTempInfo?.familyInfo?.familyId == props.info.familyInfo?.familyId || props.info.other != 3,
  rankTempInfo?.curInfo,
  props.info
)
</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  left: 50%;
  bottom: 0.5rem;
  z-index: 99;
  transform: translateX(-50%);
  width: 5.97rem;
  height: 1.48rem;
  flex-shrink: 0;

  .info-img {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
