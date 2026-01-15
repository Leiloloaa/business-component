<template>
  <div class="slot-date-wrap" v-if="timeRangeDates?.length > 0">
    <div class="day-line" v-bg="'day-line'"></div>

    <div class="day-container scrollX" ref="scrollRef">
      <div class="day-tabs" ref="listItemRef">
        <div
          v-for="(item, index) in timeRangeDates"
          :key="'day-tabs' + index"
          :class="`day-tab ${item == selDate ? 'act' : 'normal'}`"
          @click="switchDate(item)"
        >
          <div class="day-tab-content fc" v-bg="item == selDate ? 'day-act' : 'day'">
            <Outline
              :color="`0.05rem ${item == selDate ? '#720000' : '#720000'}`"
              :text="dayjs(item).format(TOOL_countryCode == 'EG' ? 'DD/MM' : 'MM/DD')"
            />
          </div>

          <div class="avatar-wrap" style="pointer-events: none">
            <OptA
              :data="historyTop1?.[item] || {}"
              :option="{
                styles: css`
                  width: 0.92188rem;
                  height: 0.92188rem;
                  aspect-ratio: 92.19/92.19;
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
                  width: 0.50781rem;
                  height: 0.54688rem;
                `,
                live: css`
                  display: none;
                `
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, reactive, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import injectTool from '@publicComponents/injectTool'
import { css } from '@publicComponents/shared'
import dayjs from 'dayjs'
import { useAppStore } from '../../../../store'

const appStore = useAppStore()
const ossUrl = inject('ossUrl')
const activityId = inject('activityId')
const route: any = useRoute()
const router = useRouter()
const { TOOL_httpClient, TOOL_TEXT, TOOL_BPFunc, TOOL_countryCode } = injectTool()

// ========== getValidDate 逻辑 ==========
/**
 * 处理日期选择逻辑
 * 如果currentDate不存在，则值设置为今天。如果currentDate存在，则值设置为currentDate。
 * 然后判断这个值，如果值早于timeRangeDates第一天，则设置为第一天，如果值晚于timeRangeDates最后一天，则设置为最后一天。
 * @param dates 日期范围数组（格式：YYYYMMDD）
 * @param currentDate 当前日期值
 * @returns 处理后的有效日期（格式：YYYYMMDD）
 */
const getValidDate = (dates: string[], currentDate: string | number | undefined): string => {
  if (dates.length === 0) return ''

  const firstDate = dates[0]
  const lastDate = dates[dates.length - 1]

  // 确定要使用的日期值
  let targetDate: string = !currentDate ? dayjs().format('YYYYMMDD') : String(currentDate)

  // 判断这个值，如果值早于第一天，则设置为第一天
  if (dayjs(targetDate, 'YYYYMMDD').isBefore(dayjs(firstDate, 'YYYYMMDD'))) {
    targetDate = firstDate
  }

  // 如果值晚于最后一天，则设置为最后一天
  if (dayjs(targetDate, 'YYYYMMDD').isAfter(dayjs(lastDate, 'YYYYMMDD'))) {
    targetDate = lastDate
  }

  return targetDate
}

// ========== useTabScroll 逻辑 ==========
const scrollRef = ref<HTMLElement | null>(null)
const listItemRef = ref<HTMLElement | null>(null)

/**
 * 滚动到指定索引
 * @param direction 滚动方向
 * @param targetItemIndex 目标索引
 */
const scrollToIndex = (direction = 'x', targetItemIndex = 0) => {
  const scrollElement = scrollRef.value
  const listItemElements = listItemRef.value

  if (!scrollElement || !listItemElements) return null

  // 获取目标元素
  let targetElement: HTMLElement | null = null
  if (Array.isArray(listItemElements)) {
    targetElement = listItemElements[targetItemIndex]
  } else if (listItemElements.children && listItemElements.children[targetItemIndex]) {
    targetElement = listItemElements.children[targetItemIndex] as HTMLElement
  }

  if (!targetElement) return null

  try {
    // 计算滚动距离
    const scrollRect = scrollElement.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()
    const isHorizontal = direction.includes('x')

    const scrollCenter = isHorizontal
      ? scrollRect.left + scrollRect.width / 2
      : scrollRect.top + scrollRect.height / 2
    const targetCenter = isHorizontal
      ? targetRect.left + targetRect.width / 2
      : targetRect.top + targetRect.height / 2

    const space = targetCenter - scrollCenter

    // 执行滚动
    if (isHorizontal) {
      scrollElement.scrollLeft += space
    } else {
      scrollElement.scrollTop += space
    }

    return { scrollElement, direction, targetItemIndex, space }
  } catch (error) {
    console.error('滚动过程中发生错误:', error)
    return null
  }
}

// 使用 dayjs 获取当前日期，格式统一为 YYYYMMDD
const formatDate = (date: string | null) => date?.replace(/-/g, '') || dayjs().format('YYYYMMDD')

// 判断是否为 TR 大区
const isTRArea = computed(() => TOOL_countryCode === 'TR' && (window as any).PROJECT !== 2)

const props = defineProps({
  modelValue: { type: [Number, String], default: '' },
  api: { type: String, default: '' },
  apiParams: { type: Object, default: {} },
  use0TimeZone: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'change', 'ready'])

// 滚动到索引
const scrollToDateIndex = async (index) => {
  if (index < 0 || index >= timeRangeDates.value.length) return
  await nextTick()
  scrollToIndex('x', index)
}

// 使用计算属性
const selDate = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 只需要监听 props.modelValue 的变化来处理副作用（滚动）
watch(
  () => props.modelValue,
  (newVal) => {
    // 确保数据存在才滚动
    if (timeRangeDates.value.length > 0) {
      scrollToDateIndex(timeRangeDates.value.indexOf(newVal))
    }
  },
  { flush: 'post' }
)

// 历史TOP1
const historyTop1: any = ref({})
const getHistoryTop1 = async () => {
  try {
    const type = props.apiParams?.type
    const res = await TOOL_httpClient({
      method: 'get',
      url: '/api/activity/commonBusiness/historyTop1',
      params: {
        activityId: props.apiParams?.activityId,
        type
      }
    })
    let { data, errorCode } = res.data
    if (errorCode != 0) throw res
    historyTop1.value = data || {}
  } catch (error) {
  } finally {
  }
}

// 接口变化
watch(
  () => [props.api, props.apiParams],
  (newVal, oldVal) => {
    const isEqual = JSON.stringify(newVal) === JSON.stringify(oldVal)
    if (!isEqual) getHistoryTop1()
  }
)

// 活动时间范围日期
const timeRangeDates: any = ref([])
const getActivityTimeRangeDates = async () => {
  let url, params
  url = '/api/activity/commonBusiness/getActivityTimeRangeDates'
  params = { activityId, type: props.apiParams?.type }
  try {
    const res = await TOOL_httpClient({ method: 'get', url, params })
    let { data, errorCode } = res.data
    if (errorCode != 0) throw res
    timeRangeDates.value = data || []
  } catch (error) {
  } finally {
  }
}

// 切换日期
const switchDate = (date) => {
  if (!date) return
  if (timeRangeDates.value.length === 0) return
  let validDate = getValidDate(timeRangeDates.value, date)
  if (selDate.value == validDate) return
  selDate.value = validDate
  scrollToDateIndex(timeRangeDates.value.indexOf(validDate))
}

onMounted(async () => {
  await getActivityTimeRangeDates()
  await getHistoryTop1()

  // 获取当前日期（根据 use0TimeZone 选择时区）
  const today = props.use0TimeZone ? appStore.curTime0 : appStore.curTime

  // 判断当前日期是否在范围内
  if (timeRangeDates.value.length > 0) {
    const startDate = String(timeRangeDates.value[0])
    const endDate = String(timeRangeDates.value[timeRangeDates.value.length - 1])

    let targetDate = today
    if (today < startDate) {
      // 当前日期在范围前，取第一天
      targetDate = startDate
    } else if (today > endDate) {
      // 当前日期在范围后，取最后一天
      targetDate = endDate
    }

    // 设置日期
    const validDate = getValidDate(timeRangeDates.value, targetDate)
    selDate.value = validDate

    // 等待 DOM 更新后滚动到选中日期
    await nextTick()
    scrollToDateIndex(timeRangeDates.value.indexOf(validDate))
  }

  // 确保初始化完成后 emit 一次，让父组件拿到正确的日期
  emit('update:modelValue', selDate.value)
  // 通知父组件初始化完成
  emit('ready')
})
</script>

<style lang="scss" scoped name="Fight">
.slot-date-wrap {
  width: 7.5rem;

  margin: 0 auto;
  margin-top: 0.24rem;
  margin-bottom: 0.08rem;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  .day-line {
    display: block;
    width: 7.18rem;
    height: 0.1rem;
    flex-shrink: 0;

    position: absolute;
    top: 0.25rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .day-container {
    .day-tabs {
      width: fit-content;

      display: flex;
      position: relative;

      .day-tab {
        width: 1.38rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        .day-tab-content {
          width: 1.13rem;
          height: 0.88rem;

          display: flex;
          flex-direction: column;
          align-items: center;

          position: relative;
          z-index: 1;

          span {
            color: #f8a187;
            text-align: center;
            -webkit-text-stroke-width: 2px;
            -webkit-text-stroke-color: #720000;
            font-family: 'SF UI Text';
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;

            position: relative;
            z-index: 10;
          }
        }

        .avatar-wrap {
          position: relative;
          z-index: 10;

          margin-top: -0.16rem;
        }

        &.act {
          margin-top: 0rem;

          .day-tab-content {
            span {
              color: #ffe9bd;
              text-align: center;
              -webkit-text-stroke-width: 2px;
              -webkit-text-stroke-color: #720000;
              font-family: 'SF UI Text';
              font-size: 0.24rem;
              font-style: normal;
              font-weight: 700;
              line-height: normal;
            }
          }

          .avatar-wrap {
          }
        }
      }
    }
  }
}
</style>
