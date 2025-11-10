import { ref, computed, watch, inject } from 'vue'
import injectTool from '@publicComponents/injectTool'
import { getRankConfig, type RankType, type RankPageConfig } from './commonRank'

/**
 * 榜单页面通用逻辑
 * @param options 配置选项
 * @param options.rankType 页面名称，必须是 RankType 中的类型
 * @param options.dayTotal 日榜/总榜标识：0-日榜，1-总榜
 * @param options.selDate 选择的日期
 * @param options.params 额外的请求参数
 * @returns 榜单页面相关的响应式数据和方法
 */
export const useRankPage = (options: {
  rankType: RankType
  /** 日榜/总榜标识：0-日榜，1-总榜 */
  dayTotal?: 0 | 1
  selDate?: string
  params?: object
}) => {
  const activityId = inject('activityId')
  const { TOOL_BPFunc } = injectTool()

  // 按需获取配置，支持 tree-shaking
  const pageConfig = getRankConfig(options.rankType)

  // 这两个可能都是改变日/总榜的变量
  const dayTotal = ref(options.dayTotal ?? 0) // 0日榜/1总榜tab
  const selDate = ref(dayTotal.value == 1 ? '999' : '') // 日期

  console.info('当前榜单页面配置 ===', pageConfig)

  const tempConfig = computed(() => {
    const config = pageConfig as RankPageConfig
    return {
      url: config[dayTotal.value == 1 || selDate.value == '999' ? 'totalUrl' : 'dailyUrl'] ?? '',
      params: options.params,
      top1Url: dayTotal.value == 0 ? config.top1Url ?? '' : '',
      infoText: (config.infoNum ?? 0) + (dayTotal.value == 0 ? 0 : 1)
    }
  })

  watch(
    () => dayTotal.value,
    () => {
      const config = pageConfig as RankPageConfig
      TOOL_BPFunc({
        desc: config[dayTotal.value == 1 || selDate.value == 999 ? 'totalDesc' : 'dailyDesc'] ?? '',
        action: 'show'
      })
    },
    { immediate: true }
  )

  return {
    rankType: options.rankType,
    dayTotal,
    selDate,
    tempConfig,
    activityId
  }
}
