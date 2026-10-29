<template>
  <div class="rank-card" :class="cardClass">
    <uiImg
      :n="TOOL_countryCode == 'EG' ? 'stamp-EG' : 'stamp-TR'"
      class="stamp"
      :class="TOOL_countryCode"
      v-if="info.stamp && info.status == 0"
    />
    <div class="top-info">
      <Space :val="0.15" :h="0" />

      <!-- 排名徽章 -->
      <div class="num fc">
        <uiImg :n="`num${info.idx}`" v-if="info.idx <= 3 && !isUser" />
        <span v-else>{{ info.idx }}</span>
      </div>

      <Space :val="0" :h="0" />

      <!-- 头像 -->
      <Avatar
        :info="{ avatar: info.agencyInfo?.agencyImg, idx: info.idx }"
        :isUser="isUser"
      />

      <Space :val="0.21" :h="0" />

      <!-- 用户名 -->
      <div class="name" v-marquee="{ center: true, speed: 50 }">
        {{ info.agencyInfo?.agencyName || "--" }}
      </div>

      <Space :val="0.23" :h="0" />

      <!-- 分数 -->
      <div class="score">{{ info.score || "--" }}</div>
    </div>

    <div class="bottom-info">
      <!-- 成员头像列表 -->
      <div class="member-list">
        <div class="avatars">
          <div class="member-avatar fc" v-for="index in 5" :key="index">
            <cdnImg
              v-if="getMemberAvatar(index - 1)"
              class="avatar"
              :fid="getMemberAvatar(index - 1)"
              m="none"
              :w="''"
              :h="''"
            />
            <uiImg v-else class="avatar" n="sofa" />
          </div>
        </div>
        <Space :val="0.07" :h="0" />
        <!-- 查看更多按钮 -->
        <div
          class="more-arrow fc"
          :class="{ rtl: TOOL_countryCode === 'EG' }"
          @click="onViewMore"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import Avatar from "./Avatar.vue";

interface Props {
  info: Record<string, any>;
  isUser?: boolean;
  selDate?: string;
}

const emit = defineEmits<{
  (e: "viewMore", info: Record<string, any>): void;
}>();

const { TOOL_countryCode, TOOL_TEXT } = fnGetInjectInfo();

const props = withDefaults(defineProps<Props>(), {
  isUser: false,
  selDate: "",
});

// 根据排名返回不同的 class
const cardClass = computed(() => {
  const rank = props.info.idx;
  if (rank == 1) return "rank-1";
  if (rank == 2) return "rank-2";
  if (rank == 3) return "rank-3";
  return "rank-other";
});

// 根据索引获取成员头像
const getMemberAvatar = (index: number) => {
  const topUsers = props.info?.topUsers;
  if (!topUsers || !Array.isArray(topUsers)) return null;
  return topUsers[index]?.avatar || topUsers[index]?.fid || null;
};

// 查看更多
const onViewMore = () => {
  if (!props?.info?.name) return;
  emit("viewMore", props.info);
};
</script>

<style lang="scss" scoped>
@use "../../static/mixin.scss" as *;

.rank-card {
  width: 6.59rem;
  height: 3.16rem;
  @include bg("guild-card");

  position: relative;

  margin: 0 auto;
  margin-bottom: 0.08rem;

  .top-info {
    display: flex;
    align-items: center;
    padding-top: 0.45rem;
  }

  &.rank-1,
  &.rank-2,
  &.rank-3 {
    width: 6.59rem;
    height: 3.54rem;
    @include bg("guild-card1");
    .stamp {
      top: 0.7rem;
    }
    .top-info {
      padding-top: 0.84rem;
    }
  }

  .stamp {
    width: 1.3rem;
    height: 0.86rem;
    object-fit: contain;

    position: absolute;
    top: 0.3rem;
    right: -0.32rem;
    z-index: 20;

    &.EG {
      right: unset;
      left: -0.32rem;
    }
  }

  .num {
    width: 0.6rem;
    height: 0.6rem;

    img {
      width: 0.6rem;
      height: 0.6rem;
      object-fit: contain;
    }

    span {
      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  .name {
    width: 1.81rem;
    color: #ffe89a;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.32rem; /* 133.333% */
  }

  .score {
    width: 1.68rem;
    height: 0.48rem;
    @include bg("score");

    color: #f1ca86;
    text-align: center;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.48rem; /* 108.333% */
  }

  .bottom-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    margin-top: 0.12rem;

    .member-list {
      height: 0.98rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.08rem;

      .avatars {
        display: flex;
        align-items: center;

        .member-avatar {
          width: 0.98rem;
          height: 0.98rem;
          flex-shrink: 0;
          position: relative;

          // 背景框伪元素（在头像上层）
          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            @include bg("a5");
            z-index: 2;
            pointer-events: none;
          }

          .avatar {
            width: 0.72rem;
            height: 0.72rem;
            object-fit: cover;
            border-radius: 50%;
            position: relative;
            z-index: 1;
          }
        }
      }

      .more-arrow {
        width: 0.4rem;
        height: 0.4rem;
        @include bg("more-arrow");
        cursor: pointer;
        position: relative;
        z-index: 10;

        // 中东地区水平翻转
        &.rtl {
          transform: scaleX(-1);
        }
      }
    }
  }
}
</style>
