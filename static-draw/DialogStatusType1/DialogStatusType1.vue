<template>
  <Space :val="0.64" h />
  <div class="title">
    {{ TOOL_TEXT[62] }}
  </div>
  <div class="tip fc">
    <img
      :src="`${ossUrl}/d-sel0.png`"
      alt=""
      v-if="!isSelect"
      @click="isSelect = true"
    />
    <img
      :src="`${ossUrl}/d-sel1.png`"
      alt=""
      v-else
      @click="isSelect = false"
    />
    <Space :val="0.16" />
    <span>{{ TOOL_TEXT[65] }}</span>
  </div>
  <div class="btn-list fc">
    <OssImg src="d-confirm" class="btn confirm fc" @click="handleConfirm">
      <span>{{ TOOL_TEXT[618] }}</span>
    </OssImg>
    <Space :val="0.16" />
    <OssImg src="d-cancel" class="btn cancel fc" @click="handleHide">
      <span>{{ TOOL_TEXT[617] }}</span>
    </OssImg>
  </div>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";

const { TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");
const emit = defineEmits(["confirm", "hide"]);

const isSelect = ref(false);

const handleConfirm = () => {
  emit("confirm", {
    isSelect: isSelect.value,
  });
};

const handleHide = () => {
  emit("hide");
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

.tip {
  margin-top: 0.24rem;

  img {
    width: 0.24rem;
    height: 0.24rem;
  }

  color: #fff;
  text-align: center;
  font-family: "SF UI Text";
  font-size: 0.26rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.28rem; /* 107.692% */
  letter-spacing: -0.001rem;

  span {
    color: #ffdc5f;
    font-family: "SF UI Text";
    font-size: 0.26rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.28rem;
    letter-spacing: -0.001rem;
  }
}

.btn-list {
  direction: ltr;
  .btn {
    width: 2.46rem;
    height: 0.74rem;

    margin-left: 0.08rem;
    margin-right: 0.08rem;

    span {
      color: #112155;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.26rem; /* 108.333% */
    }

    &.act {
      span {
        color: #9c0d0d;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem; /* 108.333% */
      }
    }
  }
}
</style>
