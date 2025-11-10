<template>
  <!-- 使用 -->
  <!-- import DrawBtn from '../business/DrawGroup/DrawBtn.vue' -->
  <!-- 使用界面 provide('groupInfo',pageInfo) -->
  <div class="draw-btn-wrap fc">
    <OssImg
      v-for="(item, idx) in [1, 10, 100]"
      :src="`g-btn${idx == 2 ? '-act' : ''}`"
      class="btn fc"
      v-animate
      :class="`btn-${idx + 1}`"
      @click="toDraw(item)"
    >
      <Outline
        :color="1 ? '0.05rem #581604' : '0.05rem #581604'"
        :text="TOOL_TEXT[30 + idx]"
        noColor
      />
    </OssImg>
  </div>

  <Dialog v-model="pageInfo.showDialogStatus" :frame="false">
    <!-- <DialogStatus
      :type="pageInfo.popType"
      :rewardList="pageInfo.rewardList"
      @hide="pageInfo.showDialogStatus = false"
      @confirm="confirm"
    /> -->
    <MICOReward
      :rewardList="pageInfo.rewardList"
      @hide="pageInfo.showDialogStatus = false"
      @confirm="confirm"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'
import useApi from '@hooks/useApi'
import DialogStatus from './DialogStatus.vue'
import MICOReward from './MICOReward.vue'

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_httpClient, TOOL_loading, TOOL_toast } =
  injectTool()

const ossUrl = inject('ossUrl')
const getRew = inject('getRew')
const activityId = inject('activityId')

const groupInfo: any = inject('groupInfo')
const pageInfo = reactive({
  showDialogStatus: false,
  popType: 1, // 1: 勾选下次不在提示弹框 2: 单个奖励弹框 3: 多个奖励弹框 4: 错误提示 5: 次数不足
  times: 1, // 1: 1次抽奖 10: 10次抽奖 100: 100次抽奖
  rewardList: [] // 奖励列表 如果包了很多层 需要先处理
})

const confirm = async (info) => {
  TOOL_loading()
  if (pageInfo.popType == 1) {
    // 勾选下次不在提示弹框
    const url = `/api/activity/commonBusiness/popUp?activityId=${activityId}&notTips=${info.isSelect}`
    const data = await useApi(url, {})
    toDraw(pageInfo.times)
  }
  pageInfo.showDialogStatus = false
  TOOL_loading(false)
}

// 是否弹出确认弹框
const popType1 = async () => {
  const url = `/api/activity/commonBusiness/popUp?activityId=${activityId}&notTips=false`
  const data = await useApi(url, {})
  return data.isFirst
}

const toDraw = async (times = 1) => {
  console.log('toDraw', times)
  if (groupInfo.status == -1) {
    TOOL_toast({ text: TOOL_TEXT[608] })
    return
  } else if (groupInfo.status == 0) {
    TOOL_toast({ text: TOOL_TEXT[609] })
    return
  }
  TOOL_BPFunc({
    desc: `Landmark 1/2/3/4 Present flowers ${times} time_click`,
    action: 'click'
  })

  const openPop = false
  // 100次抽奖
  if (openPop && times == 100) {
    const isFirst = await popType1()
    if (isFirst) {
      pageInfo.popType = 1
      pageInfo.showDialogStatus = true
      return
    }
  }

  TOOL_loading()
  const url =
    '/api/activity/trVictoryDay/lottery?count=' + times + '&number=' + Number(groupInfo.curIdx + 1)
  const data = await useApi(
    url,
    {
      count: times,
      number: Number(groupInfo.curIdx + 1)
    },
    'POST'
  )
  TOOL_loading(false)

  const _key = data['code']
  const messages = {
    401: TOOL_TEXT[608], // coming
    402: TOOL_TEXT[609], // end
    403: TOOL_TEXT[84], // 次数不足
    420: '', // 长度不符合
    504: TOOL_TEXT[84], // 次数已达上线
    default: TOOL_TEXT[627] // 网络异常
  }
  const message = messages[_key] || messages.default
  if (_key == 200) {
    pageInfo.rewardList = data.data
    pageInfo.popType = 2
    pageInfo.showDialogStatus = true
  } else {
    TOOL_toast({ text: message })
  }

  // 刷新页面
  TOOL_loading()
  await groupInfo.getInfo()
  TOOL_loading(false)
}
</script>

<style lang="scss" scoped>
.draw-btn-wrap {
  margin-top: 0.08rem;
  position: relative;
  z-index: 20;
  margin-bottom: 0.54rem;

  .btn {
    width: 1.96rem;
    height: 0.98rem;
    flex-shrink: 0;
    margin-left: 0.08rem;
    margin-right: 0.08rem;

    span {
      width: 1.49rem;
      margin-top: 0.22rem;
    }
  }

  .btn-1 {
    span {
      color: #6e0000;

      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.28rem; /* 116.667% */
    }
  }

  .btn-2 {
    span {
      color: #6e0000;

      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.28rem; /* 116.667% */
    }
  }

  .btn-3 {
    span {
      color: #6e0000;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.28rem; /* 116.667% */
    }
  }
}
</style>
