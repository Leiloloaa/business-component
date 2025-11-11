<template>
  <Space :val="0.19" :h="1" />

  <div class="content">
    <OssImg src="reward-table" class="reward-table">
      <div class="th fc">
        <div
          class="item fc"
          :class="{ item1: idx + 1 == 1, item2: idx + 1 != 1 }"
          v-for="(item, idx) in [57, 73, 74, 75]"
          style="height: 0.94rem"
        >
          <span>{{ TOOL_TEXT[item] }}</span>
        </div>
      </div>
      <!-- 表格有五行 4 四 -->
      <div class="tb fc" v-for="(item, index) in 4">
        <div class="item" v-for="(i, idx) in 4" style="height: 1.69rem">
          <div v-if="i == 1" class="item1 fc" style="height: 1.69rem">
            <span>{{ TOOL_TEXT[cityText[index]] }}</span>
          </div>
          <div class="item2 fc" v-else style="height: 1.69rem">
            <Rew
              :reward="
                i == 2
                  ? groupInfo.rewards?.[index]?.common?.[0]
                  : i == 3
                  ? groupInfo.rewards?.[index]?.suc?.[0]
                  : groupInfo.rewards?.[index]?.per?.[0]
              "
              :options="{
                size: 'd-rew', // 尺寸
                bgObj: {
                  rew: 'rew',
                  corner: 'conor',
                  // coin: 'g-coin'
                },
                corner: true, // 角标
                name: false, // 奖励名称 麦圈
                coin: false, // 金币
                num: false, // 天数、数量
                effectFid: false, // 动图
                playIcon: false, // 展示播放按钮
                nameW: 1.22, // 奖励名称宽度
                nameH: 0.32, // 奖励名称高度
                useOutline: false, // 外边框
                outline: `0.05rem #090F07`,
              }"
            />
            <img
              :src="`${ossUrl}/reward-table-yes.png`"
              alt=""
              class="yes"
              v-if="
                i == 2
                  ? groupInfo.rewards?.[index]?.commonFlag
                  : i == 3
                  ? groupInfo.rewards?.[index]?.sucFlag
                  : groupInfo.rewards?.[index]?.perFlag
              "
            />
          </div>
        </div>
      </div>
    </OssImg>
  </div>
</template>

<script lang="ts" setup>
import injectTool from "@publicComponents/injectTool";

const cityText = [102, 104, 106, 108];
const { TOOL_TEXT } = injectTool();
const ossUrl = inject("ossUrl");
const groupInfo: any = inject("groupInfo");
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 6.5rem;
  overflow-y: scroll;
}

.reward-table {
  width: 6.08rem;
  height: 7.93rem;
  flex-shrink: 0;
  margin: 0 auto;

  .item1 {
    width: 1.13rem;
  }
  .item2 {
    width: 1.67rem;
    position: relative;
    .yes {
      width: 0.8rem;
      height: 0.8rem;
      flex-shrink: 0;
      aspect-ratio: 1/1;
      position: absolute;
      top: 0.93rem;
      right: 0rem;
      z-index: 2;
    }
  }

  .th,
  .tb {
    width: 6.08rem;

    .item {
      span {
        color: #ffdeb6;
        text-align: center;
        font-family: "SF UI Text";
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.26rem; /* 108.333% */
      }
    }
  }
}
</style>
