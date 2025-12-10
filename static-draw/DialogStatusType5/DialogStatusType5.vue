<template>
  <Space :val="0.64" h />
  <div class="title">
    {{ TOOL_TEXT[28] }}
  </div>
  <Space :val="0.4" h />
  <img :src="`${ossUrl}/fail.png`" class="fail" />

  <Space :val="0.6" h />
  <div v-bg="`d-big-confirm`" class="big-btn fc" @click="handleConfirm">
    <Outline
      :color="1 ? '0.05rem #952a11' : '0.05rem #581604'"
      :text="TOOL_TEXT[618]"
      noColor
    />
  </div>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";

const { TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");
const emit = defineEmits(["confirm"]);

const handleConfirm = () => {
  emit("confirm");
};
</script>

<style lang="scss" scoped>
.title {
  width: 4.42rem;
  height: 0.49rem;
  color: #fff;
  font-family: "SF UI Text";
  font-size: 0.24rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.26rem; /* 108.333% */
}

.big-btn {
  width: 3.72rem;
  height: 1.12rem;
  flex-shrink: 0;
  margin-top: 1.21rem;

  span {
    color: #362929;
    font-family: "SF UI Text";
    font-size: 0.32rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 100% */
  }

  &.act {
    span {
      color: #9c0d0d;
      font-family: "SF UI Text";
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 100% */
    }
  }
}

.fail {
  width: 1.44rem;
  height: 1.44rem;
  flex-shrink: 0;
}
</style>

