<template>
  <div class="bar-wrap">
    <!-- 进度条 绝对定位 -->
    <div v-bg="`p1-bar`" class="bar-bg" :class="TOOL_countryCode">
      <div class="bar-inner" :class="TOOL_countryCode">
        <!-- width/height -->
        <div class="act" :style="{ height: barLength + 'rem' }"></div>
      </div>
    </div>

    <template v-for="(item, idx) in taskList" :key="idx">
      <div class="bar-lv-info">
        <Space :val="0.5" :h="0" />
        <div
          class="icon fc"
          :ref="(el) => setIconRef(el, idx)"
          :class="currentLevel >= idx + 1 ? `act` : ``"
          v-bg="currentLevel >= idx + 1 ? `bar-icon-act` : `bar-icon`"
        >
          <Outline
            :color="currentLevel >= idx + 1 ? '0.05rem #DF0466' : '0.05rem #85083F'"
            :text="'Lv.' + (idx + 1)"
          />
        </div>

        <div class="info" v-bg="`bar-card`">
          <div class="info-top">
            <!-- 等级宝箱图（点击 = 领取） -->
            <!-- 
            /**
            *  5 没奖励库存
            */
            public static final int not_stock = 5;
            /**
            *  3 未完成（去完成）
            */
            public static final int not_finished = 3;
            /**
            *  1 未领取（完成了但没有手动领取）
            */
            public static final int not_received = 1;
            /**
            *  2 已领取
            */
            public static final int received = 2;
            -->
            <div class="box" @click="obtainReward(item, idx)">
              <img
                :src="`${ossUrl}/lv${idx + 1}${item.status == 2 ? '-act' : ''}.png`"
                :style="{ opacity: [-1, 0, 3, 5].includes(item.status) ? 0.5 : 1 }"
                alt=""
                class="box-img"
              />
              <img
                :src="`${ossUrl}/lock.png`"
                alt=""
                class="lock-img"
                v-if="[-1, 0, 3].includes(item.status)"
              />
              <img
                :src="`${ossUrl}/handle.png`"
                alt=""
                class="handle-img shake"
                v-if="item.status == 1"
              />
            </div>

            <div class="text-wrap">
              <Rep
                :content="TOOL_TEXT[35]"
                :rule="[
                  {
                    reg: '%s',
                    eg: true,
                    val: TOOL_NUM(item.required),
                    type: 'text',
                    options: { color: '#FFDA0A', fontSize: 0.26, gap: 0.02 }
                  }
                ]"
              />
              <Rep
                :content="TOOL_TEXT[36]"
                :rule="[
                  {
                    reg: '%s',
                    eg: true,
                    val: TOOL_NUM(item.rewardRemainingStock),
                    type: 'text',
                    options: { color: '#FFDA0A', fontSize: 0.26, gap: 0.02 }
                  }
                ]"
              />
            </div>
          </div>
          <div class="info-bottom" v-if="item.other1?.name">
            <OptA
              :data="item?.other1 || {}"
              :option="{
                styles: css`
                  width: 1.04rem;
                  height: 1.04rem;
                `,
                img: 'a',
                avatar: css`
                  width: 0.77653rem;
                  height: 0.77653rem;
                `,
                live: css`
                  width: 0.41rem;
                  height: 0.24rem;
                  bottom: 0.2rem;
                `,
                liveIcon: css`
                  width: 0.18rem;
                `
              }"
            />
            <Space :val="0.16" :h="0" />
            <Rep
              class="text"
              :content="TOOL_TEXT[37]"
              :rule="[
                {
                  reg: '%s',
                  eg: true,
                  val: item.other1?.name || '--',
                  type: 'text',
                  className: 'ov',
                  options: {
                    color: '#FFF760',
                    fontSize: 0.24,
                    gap: 0.02,
                    'max-width': '1.5rem',
                    y: 0.07
                  }
                },
                {
                  reg: '%d',
                  eg: true,
                  val: TOOL_NUM(item.other?.[0]?.rewards?.[0]?.count),
                  type: 'text',
                  options: { color: '#FFF760', fontSize: 0.24, gap: 0.02 }
                }
              ]"
            />
          </div>
          <div class="info-bottom" v-else>
            <div class="rew" v-for="(k, kIdx) in item.other" :key="k?.start ?? kIdx">
              <cdnImg :info="k?.rewards?.[0]"></cdnImg>
              <div class="count fc" v-bg="`bar-rew-count`">
                <span>{{ TOOL_NUM(k?.rewards?.[0]?.count, true) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <!-- 领取奖励弹框 -->
  <Dialog v-model="rewardDialog" :frame="false">
    <!-- <MICOReward :rewardArray="rewardArray" /> -->
    <div class="reward-success-wrap" v-bg="`d-bg`">
      <!-- 大奖 -->
      <div class="big-title fc" v-if="rewardInfo.isBigPrize">
        <Outline :color="'0.05rem #FFE434'" :text="TOOL_TEXT[41]" :noColor="true" />
      </div>
      <div class="title fc" v-else>
        <Outline :color="'0.05rem #FFE434'" :text="TOOL_TEXT[7]" :noColor="true" />
      </div>

      <cdnImg :info="rewardInfo.reward?.packageSpecificRewards?.[0]" class="rew"></cdnImg>

      <div class="count fc" v-if="rewardInfo.isBigPrize" v-bg="`d-bar-rew-count`">
        <span>{{ getRew(rewardInfo.reward?.packageSpecificRewards?.[0])?.num }}</span>
      </div>

      <div class="count-num" v-else>
        <Rep
          :content="TOOL_TEXT[42]"
          :rule="[
            {
              reg: /\*/,
              eg: false,
              val: '',
              type: 'text',
              options: { color: '#a7fbff', fontSize: 0.26, gap: 0.02 }
            },
            {
              reg: '%AA',
              eg: true,
              val: getRew(rewardInfo.reward?.packageSpecificRewards?.[0])?.name,
              type: 'text',
              options: { color: '#a7fbff', fontSize: 0.26, gap: 0.02 }
            },
            {
              reg: '%BB',
              eg: true,
              val: getRew(rewardInfo.reward?.packageSpecificRewards?.[0])?.num,
              type: 'text',
              options: { color: '#a7fbff', fontSize: 0.26, gap: 0.02 }
            }
          ]"
        />
      </div>
      <div class="d-btn fc" v-bg="'d-btn'" @click="rewardDialog = false">
        <Outline :color="'0.05rem #FFE434'" :text="TOOL_TEXT[618]" :noColor="false" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup name="puzzleTask">
import injectTool from '@publicComponents/injectTool'
import { toAppUrl, css } from '@publicComponents/shared'
import type { IBigWinMeterTask } from '../../utils/type'
import MICOReward from './MICOReward.vue'

// 接口实际返回带进度字段，类型定义未声明，这里本地补全
type IBarTask = IBigWinMeterTask & {
  progress: number
  required: number
}

const getRew: any = inject('getRew')

const {
  TOOL_toast,
  TOOL_BPFunc,
  TOOL_httpClient,
  TOOL_countryCode,
  TOOL_TEXT,
  TOOL_loading,
  TOOL_NUM
} = injectTool()
const ossUrl = inject('ossUrl')
const groupInfo: any = inject('groupInfo')
const page2RankIndex: any = inject('page2RankIndex')

const rewardDialog = ref(false)
const rewardInfo = reactive({})

const obtainReward = async (item, idx: number) => {
  if (item.status != 1) return

  TOOL_BPFunc({ desc: 'open_button_click', action: 'click' })

  try {
    TOOL_loading()
    const params = { index: idx + 1 }
    const res = await TOOL_httpClient({
      url: '/api/activity/gamerLuckyDrop/bigWinMeterReward',
      method: 'get',
      params
    })
    const { data, errorCode } = res?.data || {}
    if (errorCode != 0) {
      return
    }

    const _key = data['code']
    const messages = {
      401: TOOL_TEXT[608], // coming
      402: TOOL_TEXT[609], // end
      403: TOOL_TEXT[70], // 次数不足
      420: '', // 长度不符合
      504: TOOL_TEXT[70], // 次数已达上线
      default: TOOL_TEXT[627] // 网络异常
    }
    const message = messages[_key] || messages.default
    if (_key == 200) {
      Object.assign(rewardInfo, data)
      rewardDialog.value = true
      if (page2RankIndex) page2RankIndex.value++
    } else {
      TOOL_toast({ text: message })
    }
    groupInfo.getInfo()
  } catch (error) {
    console.error('领取宝箱失败', error)
  } finally {
    TOOL_loading(false)
  }
}

const taskList = computed(() => {
  const isReverse = false // 是否倒序显示
  console.log('groupInfo.tasks===', groupInfo.tasks)
  const data = unref(groupInfo.tasks)
  if (Array.isArray(data)) {
    return isReverse ? [...data]?.reverse() : data
  } else {
    return []
  }
})

// 进度条配置（垂直方向）
// 段长按"相邻 icon 行间距"推算：
//  - 第 0 段：固定 firstLength（可为 0 或自定义值）
//  - 中间段：rowHeight - iconHeight（相邻 icon 之间的真实空隙，DOM 测量）
//  - 最后一段：total - 前面所有段（兜底，确保总长精确等于 total）
// 改 total 即可，.bar-inner 的 height 通过 v-bind 自动跟随
const progressInfo = {
  progressBar: {
    total: 12.6, // 进度条总可填长度
    firstLength: 0 // 第 0 段固定长度
  }
}

// 给 SCSS v-bind 用：把 total 转成 rem 字符串
const barInnerHeight = computed(() => `${progressInfo.progressBar.total}rem`)

/* DOM 测量：相邻 icon 顶部距离 + icon 自身高度（单位 rem） */
const iconEls = ref<HTMLElement[]>([])
const rowHeight = ref(0)
const iconHeight = ref(0)

const setIconRef = (el: any, idx: number) => {
  if (el instanceof HTMLElement) iconEls.value[idx] = el
}

const measureIcons = async () => {
  await nextTick()
  const els = iconEls.value.filter(Boolean)
  if (!els.length) return
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100
  iconHeight.value = els[0].getBoundingClientRect().height / fontSize
  if (els.length >= 2) {
    const r0 = els[0].getBoundingClientRect()
    const r1 = els[1].getBoundingClientRect()
    rowHeight.value = (r1.top - r0.top) / fontSize
  }
}

onMounted(measureIcons)
watch(
  () => taskList.value?.length,
  () => {
    iconEls.value = []
    measureIcons()
  }
)

// 构建进度条的基本数据
const getProgressInfo = (msg: typeof progressInfo, tasks: IBarTask[] = []) => {
  const len = tasks.length
  const { total, firstLength } = msg.progressBar

  // 中间段 = 相邻 icon 顶部距离 - 一个 icon 高度，即两 icon 之间的真实空隙
  const middleLen = Math.max(0, rowHeight.value - iconHeight.value)

  const lengthArray = tasks.map((_, i) => {
    if (i === 0) return firstLength
    if (i === len - 1) {
      return Math.max(0, total - firstLength - middleLen * (len - 2))
    }
    return middleLen
  })

  return { lengthArray }
}

// 获取当前等级的 progress、required
const getCurLevelInfo = (item: IBarTask) => ({
  progress: item.progress,
  required: item.required
})

// 通过 progress、required，以及本等级对应的进度条长度，计算实际进度条的长度
const getProgressLength = (progress: number, required: number, levelLength: number) => {
  if (!required) return 0
  return (progress / required) * levelLength
}

// 当前已完成的等级数
const currentLevel = computed(() => {
  const tasks = taskList.value as IBarTask[]
  if (!Array.isArray(tasks)) return 0
  let lv = 0
  tasks.forEach((item) => {
    if (item.progress >= item.required) lv++
  })
  return lv
})

// 计算整个进度条的长度
const barLength = computed(() => {
  const tasks = taskList.value as IBarTask[]
  if (!Array.isArray(tasks) || !tasks.length) return 0
  // 首帧 DOM 还没测量时返回 0，避免最后一段误填满 total
  if (rowHeight.value === 0 && tasks.length > 1) return 0

  const { lengthArray } = getProgressInfo(progressInfo, tasks)
  let total = 0
  console.groupCollapsed('[VBar] 等级进度拆解')

  tasks.forEach((item, index) => {
    const levelLength = lengthArray[index] ?? 0
    const { progress, required } = getCurLevelInfo(item)
    const done = progress >= required
    const len = done ? levelLength : getProgressLength(progress, required, levelLength)
    const prevTotal = total
    total += len
    console.log(
      `[Lv${index}]`,
      `progress=${progress}`,
      `required=${required}`,
      `段长=${levelLength.toFixed(4)}`,
      done ? '✓满段' : `${((progress / required) * 100).toFixed(1)}%`,
      `累计=${prevTotal.toFixed(4)} + ${len.toFixed(4)} = ${total.toFixed(4)}`
    )
  })
  console.groupEnd()
  return total
})
</script>

<style lang="scss" scoped>
.bar-wrap {
  width: 7.5rem;
  min-height: 6rem;
  position: relative;

  margin-top: 0.47rem;
  margin-bottom: 1.09rem;

  display: flex;
  flex-direction: column;

  .bar-bg {
    width: 0.36rem;
    height: 12.77rem;

    position: absolute;
    top: 0.59rem;
    left: 0.82rem;

    &.EG {
      left: unset;
      right: 0.82rem;
    }

    .bar-inner {
      width: 0.36rem;
      height: v-bind(barInnerHeight);

      position: absolute;
      top: 0.02rem;
      left: 0.065rem;
      border-radius: 0.8rem;

      .act {
        width: 0.22rem;

        border-radius: 0.8rem;
        background: linear-gradient(270deg, #fb8dff 0%, #aa0dff 50%, #ff2adc 100%);
        position: relative;
      }
    }
  }

  .bar-lv-info {
    display: flex;

    position: relative;
    z-index: 2;

    /* 左侧进度点 / 宝箱小图（点击 = 领取） */
    .icon {
      width: 1.02rem;
      height: 0.94rem;
      flex-shrink: 0;
      cursor: pointer;

      &.act {
        span {
          color: #fff06e;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #df0466;
          font-family: 'SF UI Text';
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 700;
          line-height: 0.28rem; /* 87.5% */
        }
      }

      span {
        color: #c581d3;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #85083f;
        font-family: 'SF UI Text';
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem; /* 87.5% */
      }
    }
    .fc {
    }

    /* 右侧紫色信息卡片（v-bg 注入背景） */
    .info {
      width: 5.32rem;
      height: 3.12rem;
      flex-shrink: 0;
      position: relative !important;
      z-index: 3;
      box-sizing: border-box;

      margin-top: 0.2rem;
      margin-bottom: 0.06rem;

      /* 上半区：等级标 + 双行文字 */
      .info-top {
        display: flex;
        align-items: flex-start;
        gap: 0.15rem;

        /* 等级标（v-bg='lv1' / 'lv1-act'） */
        .box {
          width: 2.2rem;
          height: 2.2rem;
          margin-top: -0.2rem;
          position: relative;

          .box-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .lock-img {
            width: 0.63rem;
            height: 0.8rem;
            aspect-ratio: 63/80;

            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .handle-img {
            width: 0.8rem;
            height: 0.8rem;
            aspect-ratio: 1/1;

            position: absolute;
            top: 1.04rem;
            right: -0.12rem;
          }
          .shake {
          }
        }

        /* 文字双行容器：每行一个 <Rep> */
        .text-wrap {
          width: 2.76rem;
          gap: 0.02rem;
          margin-top: 0.39rem;

          display: flex;
          flex-direction: column;

          span {
            color: #fff;
            font-family: 'SF UI Text';
            font-size: 0.26rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.34rem; /* 130.769% */
          }
        }
      }

      /* 下半区：4 等分奖励格子 */
      .info-bottom {
        width: 5.32rem;
        height: 1.28rem;

        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: -0.18rem;

        padding-left: 0.4rem;
        padding-right: 0.4rem;

        .rew {
          width: 1.04rem;

          display: flex;
          flex-direction: column;
          align-items: center;

          img {
            width: 0.7rem;
            height: 0.7rem;
            object-fit: contain;
          }
          .fc {
          }

          /* 数量角标（v-bg='bar-rew-count'，覆盖在右下） */
          .count {
            width: 1.04rem;
            height: 0.3rem;
            margin-top: -0.15rem;

            position: relative;

            span {
              color: #fff;
              text-align: center;
              font-family: 'SF UI Text';
              font-size: 0.22rem;
              font-style: normal;
              font-weight: 700;
              line-height: 0.32rem; /* 145.455% */
            }
          }
        }

        .text {
          width: 3.83rem;

          color: #fff;
          font-family: 'SF UI Text';
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.34rem;
        }
      }
    }
  }
}
.reward-success-wrap {
  width: 6.4rem;
  height: 8.18rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .big-title {
    width: 5.26rem;
    margin-top: 0.68rem;
    margin-bottom: 0.28rem;
    color: #a7fbff;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.34rem; /* 121.429% */
  }
  .title {
    margin-top: 0.68rem;
    color: #fff;
    text-align: center;
    font-family: 'SF UI Text';
    font-size: 0.32rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.44rem; /* 137.5% */
  }
  .rew {
    width: 2.66417rem;
    height: 2.66417rem;
    object-fit: contain;
  }
  .count {
    width: 3.18rem;
    height: 0.56rem;
    margin-top: -0.56rem;
    span {
      color: #fff;
      font-family: 'SF UI Text';
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.3rem; /* 93.75% */
    }
  }
  .count-num {
    width: 4.96rem;
    span {
      color: #a7fbff;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.34rem; /* 130.769% */
    }
  }
  .d-btn {
    width: 3.2rem;
    height: 0.84rem;
    aspect-ratio: 80/21;
    margin-top: 0.7rem;

    span {
      color: #bc1f00;
      text-align: center;
      font-family: 'SF UI Text';
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.28rem; /* 100% */
    }
  }
}
</style>
