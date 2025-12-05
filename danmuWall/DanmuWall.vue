<template>
  <div class="danmu-wall-wrap">
    <Danmu
      v-if="info?.bulletScreenList?.length > 0"
      :list="info?.bulletScreenList"
      :duration="9.5"
      :interval="0.9"
      :toplist="['2.96rem', '3.86rem', '4.76rem']"
      :offsetend="40"
      :direction="TOOL_countryCode == 'EG' ? 'right' : 'left'"
      ref="danmuRef"
      v-slot="{ item, index }"
    >
      <div class="item" :key="index">
        <div class="fc box">
          <OptA
            v-EG.self
            style="pointer-events: none"
            :data="item?.userInfo"
            :option="option0"
          />
        </div>

        <Space :val="-0.3" />

        <OssImg src="danmu-bg" class="msg" :class="`style${item?.style + 1}`">
          <Outline color="0.05rem #F338A4" :text="item?.text" noColor />
        </OssImg>
      </div>
    </Danmu>
  </div>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";
import { cssFormat } from "@publicComponents/shared";

const activityId = inject("activityId");
const ossUrl = inject("ossUrl");
const { TOOL_BPFunc, TOOL_httpClient, TOOL_countryCode, TOOL_TEXT } =
  injectTool();

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});

const danmuRef = ref(null);

const option0 = {
  styles: cssFormat`
    width: 1.22rem;
    height: 1.22rem;
  `,
  adorns: [
    {
      img: "a",
      styles: cssFormat`
        width: 100%;
        height: 100%;
      `,
    },
  ],
  avatar: cssFormat`
    top: 0.12rem;
    width: 0.9rem;
    height: 0.9rem;
  `,
  live: cssFormat`
    display: none;
  `,
};

const shootMsg = (item) => {
  if (pageInfo.list?.length == 0) {
    pageInfo.list.push(item);
  } else {
    danmuRef.value?.shootMsg(item);
  }
};

defineExpose({ shootMsg });
</script>

<style lang="scss" scoped>
.danmu-wall-wrap {
  width: 7.5rem;
  height: 8.45rem;
  flex-shrink: 0;

  position: absolute;
  top: 0.5rem;
  left: 0;
  z-index: 1;

  .item {
    width: 7.5rem;
    height: 0.8rem;
    flex-shrink: 0;
    padding: 0 0.1rem;

    display: flex;
    align-items: center;

    .msg {
      width: 3.52rem;
      height: 0.88rem;
      flex-shrink: 0;

      display: flex;
      align-items: center;

      position: relative;
      z-index: -1;

      span {
        color: #fff;
        font-family: Arial;
        font-size: 0.2rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.2rem;
        /* 100% */
      }
    }
  }

  .empty {
    width: 2.32rem;
    height: 0.52rem;
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 3rem;
    left: 2.59rem;

    span {
      color: #fff;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
}
</style>
