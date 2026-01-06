<template>
  <div v-bg="`family/d-save`" class="dialog-rank">
    <div class="title">
      <div class="title-img" v-bg="'family/d-info-title'"></div>
      <Space :val="0.43" />
      <div class="left" v-jump.family="rankTempInfo.curInfo">
        <OptA
          :data="{ avatar: rankTempInfo.curInfo?.familyInfo?.cover } || {}"
          :option="optionList.option1"
          style="pointer-events: none"
        />
      </div>
      <Space :val="0.16" />
      <div class="mid ov">{{ rankTempInfo.curInfo?.familyInfo?.name || '--' }}</div>
      <Space :val="0.65" />
      <div class="right">
        <div class="top" v-jump="{ uid: rankTempInfo.curInfo?.familyInfo?.patriarchId }">
          <OptA
            :data="{ avatar: rankTempInfo.curInfo?.familyInfo?.patriarchAvatar }"
            :option="optionList.option2"
            style="pointer-events: none"
          />
        </div>

        <Outline :color="'0.02rem #FF3F3F'" :text="TOOL_TEXT[80]" class="stamp-text" />

        <!-- <div class="name ov">{{ rankTempInfo.curInfo?.familyInfo?.patriarchName || '--' }}</div> -->
      </div>
    </div>
    <div class="info-text">{{ TOOL_TEXT[rankTempInfo.isDaily ? 101 : 105] }}</div>
    <div class="scroll" :style="{ 'padding-bottom': pageInfo.userInfo ? '1.2rem' : '' }">
      <RankLoad
        :api="api"
        :apiParams="apiParams"
        :frame="false"
        :paddingBottom="'0.2'"
        dialog
        @getPageInfo="getPageInfo"
        :rankIndex="rankIndex"
      >
        <template #card="{ info }">
          <DialogCard class="dialog-card" :info="{ ...info, selDate: rankTempInfo.selDate }" />
        </template>
        <template #empty>
          <div class="empty fcc">
            <span>{{ TOOL_TEXT[731] }}</span>
          </div>
        </template>
      </RankLoad>
    </div>

    <UserInfo
      :info="pageInfo.userInfo"
      :selDate="rankTempInfo.selDate"
      isCardStyle
      v-if="pageInfo.userInfo?.other == 3 && pageInfo.userInfo?.uid"
    />

    <div class="user-info2 fc" v-else-if="pageInfo.userInfo?.other == 1" @click="join">
      <div class="user-info2-img" v-bg="'family/d-f-info'"></div>
      <div class="btn fc">
        <div class="btn-img" v-bg="'family/d-f-info-btn'"></div>
        <span>{{ TOOL_TEXT[102] }}</span>
      </div>
    </div>

    <div class="user-info2 fc" v-else-if="pageInfo.userInfo?.other == 2">
      <div class="user-info2-img" v-bg="'family/d-f-info'"></div>
      <div class="btn fc">
        <div class="btn-img" v-bg="'family/d-f-info-btn'"></div>
        <span>{{ TOOL_TEXT[103] }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="DialogRank">
import injectTool from '@publicComponents/injectTool'
import dayjs from 'dayjs'
import RankLoad from '../../Static/RankLoad.vue'
import { css } from "@publicComponents/shared";

import DialogCard from './DialogCard.vue'
import UserInfo from './UserInfo.vue'

const { TOOL_TEXT, TOOL_BPFunc, TOOL_countryCode, TOOL_httpClient, TOOL_loading, TOOL_toast } =
  injectTool()
const ossUrl = inject('ossUrl')
const activityId = inject('activityId')
const isData = inject('isData')
const homeInfo = inject('homeInfo')
const route = useRoute()

const pageInfo = reactive({
  list: [],
  tab: 0,
  userInfo: {}
})

const optionList = {
  option1: {
    styles: css`
      width: 1.2rem;
      height: 1.045rem;
    `,
    adorns: [
      {
        img: 'a1',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.54rem;
      height: 0.54rem;
      border-radius: 0.15rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  option2: {
    styles: css`
      width: 0.87rem;
      height: 0.96rem;
    `,
    adorns: [
      {
        img: 'family/f-a',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 0.6rem;
      height: 0.6rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  option3: {
    styles: css`
      width: 1.74rem;
      height: 1.74rem;
    `,
    adorns: [
      {
        img: 'fa-avatar3',
        styles: css`
          width: 100%;
          height: 100%;
        `
      }
    ],
    avatar: css`
      width: 1.1rem;
      height: 1.1rem;
      top: 0.4rem;
      border-radius: 0.35rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  option: {
    styles: css`
      width: 0.79rem;
      height: 0.88rem;
    `,
    adorns: [
      {
        img: 'family/f-a',
        styles: css`
          width: 0.79rem;
          height: 0.88rem;
        `
      }
    ],
    avatar: css`
      width: 0.55rem;
      height: 0.55rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.2rem;
      display: none;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  },
  optionSmall: {
    styles: css`
      width: 0.98rem;
      height: 0.98rem;
    `,
    adorns: [
      {
        img: 'fa-card-avatar',
        styles: css`
          width: 0.98rem;
          height: 0.98rem;
        `
      }
    ],
    avatar: css`
      width: 0.72rem;
      height: 0.72rem;
    `,
    live: css`
      width: 0.36rem;
      height: 0.24rem;
      bottom: 0.05rem;
    `,
    liveIcon: css`
      width: 0.29rem;
    `
  }
}

const api = computed(() => {
  return `/api/activity/commonBusiness/${
    rankTempInfo.isDaily ? 'familyMemberDailyRank' : 'familyMemberTotalRank'
  }`
})
const rankTempInfo = inject('rankTempInfo')
const apiParams = computed(() => {
  return Object.assign({
    activityId: 10600,
    date: rankTempInfo.isDaily ? rankTempInfo.selDate : '',
    patriarchId: rankTempInfo.curInfo?.familyInfo?.patriarchId || '204168'
  })
})

const tabList = computed(() => {
  return [TOOL_TEXT[48], TOOL_TEXT[49], TOOL_TEXT[50]]
})

const getPageInfo = (info) => {
  Object.assign(pageInfo, info)
}

const rankIndex = ref(0)
const join = async () => {
  TOOL_BPFunc({
    desc: 'join the family_click',
    action: 'click'
  })
  TOOL_loading()
  let url, params
  url = '/api/activity/commonBusiness/joinFamily'
  params = {
    patriarchId: rankTempInfo.curInfo?.familyInfo?.patriarchId,
    activityId: 10600
  }
  try {
    const res = await TOOL_httpClient({ method: 'get', url, params })
    let { data, errorCode } = res.data
    if (errorCode != 0) throw res
    rankIndex.value++
    TOOL_toast({ text: TOOL_TEXT[103] })
  } catch (error) {
  } finally {
    TOOL_loading(false)
  }
}
</script>

<style lang="scss" scoped>
.dialog-rank {
  width: 7.18rem;
  height: 9.76rem;
  flex-shrink: 0;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  .user-info2 {
    position: absolute;
    left: 50%;
    bottom: 0.5rem;
    z-index: 99;
    transform: translateX(-50%);
    width: 5.97rem;
    height: 1.48rem;

    .user-info2-img {
      width: 100%;
      height: 100%;

      position: absolute;
      top: 0;
      left: 0;
    }

    .btn {
      width: 2.4rem;
      height: 0.8rem;
      flex-shrink: 0;
      position: relative;

      .btn-img {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;
      }

      span {
        color: #fffce1;
        text-align: center;
        font-family: Arial;
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.3rem;
        /* 115.385% */
      }
    }
  }

  .title {
    width: 5.8rem;
    height: 1.56rem;

    margin-top: 1.04rem;
    position: relative;

    padding-top: 0.28rem;

    display: flex;
    align-items: center;

    .title-img {
      width: 100%;
      height: 100%;

      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }

    .left {
    }

    .mid {
      width: 1.81rem;
      color: #ffffb6;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem;
      /* 133.333% */
    }

    .right {
      width: 0.96rem;
      height: 0.96rem;
      position: relative;

      .top {
      }

      .stamp-text {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(-20deg);
        text-align: center;
        color: #ffe44e;
        font-family: 'Archivo Black';
        font-size: 0.2rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.2rem;
        /* 100% */
      }

      .name {
        width: 0.98rem;
        margin-top: 0.05rem;
        color: #fff0cc;

        /* 内文 */
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.26rem;
        /* 108.333% */
        text-align: center;
      }
    }
  }

  .th {
    width: 5.66rem;
    margin-top: 0.16rem;
    margin-bottom: 0.23rem;

    span {
      color: #e67b49;
      text-align: center;
      font-family: Arial;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem;
      /* 133.333% */
    }
  }

  .info-text {
    width: 4.9rem;

    margin: 0 auto;
    margin-top: 0.16rem;
    margin-bottom: 0.26rem;
    color: #ffffb6;
    text-align: center;
    font-family: Arial;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.32rem;
    /* 133.333% */
  }

  .scroll {
    position: relative;

    .dialog-card {
    }

    width: 5.97rem;
    height: 6rem;
    margin-bottom: 0.7rem;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-behavior: smooth;
    transition-duration: 1s;

    &::-webkit-scrollbar {
      display: none;
    }

    .fcc {
    }

    .empty {
      img {
        margin-top: 1.17rem;
        width: 2.11rem;
        height: 1.29rem;
        flex-shrink: 0;
      }

      span {
        margin-top: 1.8rem;
        color: #e6c7a6;
        text-align: center;
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.28rem;
        /* 116.667% */
      }
    }
  }
}

.fcc {
}
</style>
