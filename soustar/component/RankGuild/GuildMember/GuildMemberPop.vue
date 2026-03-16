<!--
  公会成员榜单弹框
  使用示例：
  <GuildMemberPop v-model:show="showPop" :guildInfo="guildInfo" :selDate="selDate" />
  
  Props:
  - show: boolean - 是否显示弹框
  - guildInfo: object - 公会信息 { id, name, guildId }
  - selDate: string - 日期，"999" 表示总榜，其他值为日期 YYYYMMDD
-->

<template>
  <PopUp :showPopUp="show" @closePop="close">
    <div class="guild-member-pop">
      <!-- 标题 -->
      <div class="pop-title fc">
        <Outline :color="'0.05rem #FF6B00'" :text="TOOL_TEXT[52]" noColor />
      </div>

      <!-- 公会信息 -->
      <div class="guild-info fc">
        <div class="guild-name ov">
          {{ guildInfo.agencyInfo?.agencyName || "--" }}
        </div>
        <div class="guild-id">
          ID:{{ guildInfo.agencyInfo?.agencyId || "--" }}
        </div>
      </div>

      <!-- 成员列表 -->
      <div class="member-list-wrap">
        <RankLoad
          :api="api"
          :params="params"
          :keyConfig="{ listKey: 'list' }"
          isDialog
          :paddingBottom="'0rem'"
        >
          <template #card="{ info }">
            <MemberCard :info="info" />
          </template>
        </RankLoad>
      </div>
    </div>
  </PopUp>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import { fnGetInjectInfo } from "@components/developTool_TS";
import PopUp from "../../common/PopUp.vue";
import RankLoad from "../../common/RankLoad.vue";
import MemberCard from "./GuildMemberCard.vue";

interface AgencyInfo {
  agencyName?: string;
  agencyUid?: string | number;
  agencyId?: string | number;
  uid?: string | number;
}

interface GuildInfo {
  agencyInfo?: AgencyInfo;
}

interface Props {
  show: boolean;
  guildInfo: GuildInfo;
  selDate: string; // 日期，"999" 表示总榜
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  guildInfo: () => ({}),
  selDate: "",
});

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const { TOOL_TEXT } = fnGetInjectInfo();
const activityId = inject("activityId");

// 关闭弹框
const close = () => {
  emit("update:show", false);
};

// API 地址 - 公会成员榜
const api = "/api/activity/eidAlFitr2026/memberRank";

// 请求参数 - 总榜不传 date
const params = computed(() => {
  const baseParams = {
    leaderId: props.guildInfo?.agencyInfo?.uid,
  };
  // 总榜不传 date
  if (props.selDate === "999") {
    return baseParams;
  }
  return {
    ...baseParams,
    date: props.selDate,
  };
});
</script>

<style lang="scss" scoped>
@use "../../../static/mixin.scss" as *;

.guild-member-pop {
  width: 7.02rem;
  height: 9.32rem;
  @include bg("guild-pop-bg");
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .pop-title {
    width: 5.4rem;
    height: 0.56rem;
    @include bg("guild-pop-title");
    position: relative;
    margin-top: 1.11rem;

    span {
      color: #ffe89a;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 123.077% */
    }
  }

  .guild-info {
    margin-top: 0.1rem;
    flex-direction: column;
    gap: 0.08rem;

    .guild-name {
      width: 3rem;
      color: #ffed1a;
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.3rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 106.667% */
      text-transform: capitalize;
    }

    .guild-id {
      color: rgba(255, 251, 202, 0.65);
      text-align: center;
      font-family: "SF UI Text";
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.32rem; /* 123.077% */
      text-transform: capitalize;
    }
  }

  .member-list-wrap {
    width: 6.8rem;
    height: 6rem;
    margin-top: 0.08rem;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
</style>
