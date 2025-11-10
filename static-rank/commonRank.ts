// 通用榜单 API 基础路径
const API_BASE = '/api/activity/commonBusiness'

/**
 * 榜单页面配置项类型
 */
export interface RankPageConfig {
  /** 页面描述 */
  description: string
  /** 日榜接口地址 */
  dailyUrl?: string
  /** 总榜接口地址 */
  totalUrl?: string
  /** 日榜第一接口地址 */
  top1Url?: string
  /** 信息文本编号 */
  infoNum?: number
  /** 日榜埋点描述 */
  dailyDesc?: string
  /** 总榜埋点描述 */
  totalDesc?: string
}

// 用户日榜/总榜配置
export const userRankConfig: RankPageConfig = {
  description: '用户日榜/总榜',
  dailyUrl: `${API_BASE}/userDailyRank/includeHonor`,
  totalUrl: `${API_BASE}/userTotalRank/includeHonor`,
  infoNum: 141,
  top1Url: `${API_BASE}/historyTop1?type=1`,
  dailyDesc: 'user_daily_rank_show',
  totalDesc: 'user_total_rank_show'
}

// 主播日榜/总榜配置
export const anchorRankConfig: RankPageConfig = {
  description: '主播日榜/总榜',
  dailyUrl: `${API_BASE}/anchorDailyRank/includeHonor`,
  totalUrl: `${API_BASE}/anchorTotalRank/includeHonor`,
  top1Url: `${API_BASE}/historyTop1?type=2`,
  infoNum: 143,
  dailyDesc: 'anchor_daily_rank_show',
  totalDesc: 'anchor_total_rank_show'
}

// 新人送礼日榜/总榜配置
export const newUserRankConfig: RankPageConfig = {
  description: '新人送礼日榜/总榜',
  dailyUrl: `${API_BASE}/newUserDailyRank/includeHonor`,
  totalUrl: `${API_BASE}/newUserTotalRank/includeHonor`,
  top1Url: `${API_BASE}/historyTop1?type=7`,
  infoNum: 145,
  dailyDesc: 'new_daily_rank_show',
  totalDesc: 'new_total_rank_show'
}

// 公会日榜/总榜配置
export const unionRankConfig: RankPageConfig = {
  description: '公会日榜/总榜',
  dailyUrl: `${API_BASE}/unionDailyRank`,
  totalUrl: `${API_BASE}/unionTotalRank`,
  infoNum: 146,
  dailyDesc: 'union_daily_rank_show',
  totalDesc: 'union_total_rank_show'
}

// CP日榜/总榜配置
export const cpRankConfig: RankPageConfig = {
  description: 'CP日榜/总榜',
  dailyUrl: `${API_BASE}/cpDailyRank`,
  totalUrl: `${API_BASE}/cpTotalRank`,
  top1Url: `${API_BASE}/historyTop1?type=6`,
  infoNum: 25,
  dailyDesc: 'cp_daily_rank_show',
  totalDesc: 'cp_total_rank_show'
}

// 家族日榜/总榜配置
export const familyRankConfig: RankPageConfig = {
  description: '家族日榜/总榜',
  dailyUrl: `${API_BASE}/familyDailyRank`,
  totalUrl: `${API_BASE}/familyTotalRank`,
  infoNum: 119,
  dailyDesc: 'family_daily_rank_show',
  totalDesc: 'family_total_rank_show'
}

// 充值日榜/总榜配置
export const rechargeRankConfig: RankPageConfig = {
  description: '充值日榜/总榜',
  dailyUrl: `${API_BASE}/rechargeDailyRank`,
  totalUrl: `${API_BASE}/rechargeTotalRank`,
  infoNum: 120,
  dailyDesc: 'recharge_daily_rank_show',
  totalDesc: 'recharge_total_rank_show'
}

// 赢取日榜配置
export const page1RankConfig: RankPageConfig = {
  description: '赢取日榜',
  dailyUrl: '/api/activity/anniversaryGameCarnival2025/raiseWinDailyRank'
}

// 赢取总榜配置
export const page3UserRankConfig: RankPageConfig = {
  description: '赢取总榜',
  totalUrl: '/api/activity/anniversaryGameCarnival2025/winTotalRank',
  totalDesc: 'Win List',
  infoNum: 71
}

// 赢取新人总榜配置
export const page3NewRankConfig: RankPageConfig = {
  description: '赢取新人总榜',
  totalUrl: '/api/activity/anniversaryGameCarnival2025/newUserWinTotalRank',
  totalDesc: 'Newuser Win List',
  infoNum: 72
}

/**
 * 榜单类型常量映射（仅用于类型推断，支持 IDE 自动补全）
 */
const RANK_TYPE_MAP = {
  user: '用户日榜/总榜',
  anchor: '主播日榜/总榜',
  newUser: '新人送礼日榜/总榜',
  union: '公会日榜/总榜',
  cp: 'CP日榜/总榜',
  family: '家族日榜/总榜',
  recharge: '充值日榜/总榜',
  page1: '赢取日榜',
  page3User: '赢取总榜',
  page3New: '赢取新人总榜'
} as const

/**
 * 榜单类型枚举 用户、主播、新用户送礼、公会、cp、家族、充值 ...
 * 使用 keyof typeof 确保 IDE 能够提供自动补全提示
 */
export type RankType = keyof typeof RANK_TYPE_MAP

/**
 * 根据榜单类型获取对应的配置
 * 使用函数形式实现按需导入，支持 tree-shaking
 */
export function getRankConfig(rankType: RankType): RankPageConfig {
  switch (rankType) {
    case 'user':
      return userRankConfig
    case 'anchor':
      return anchorRankConfig
    case 'newUser':
      return newUserRankConfig
    case 'union':
      return unionRankConfig
    case 'cp':
      return cpRankConfig
    case 'family':
      return familyRankConfig
    case 'recharge':
      return rechargeRankConfig
    case 'page1':
      return page1RankConfig
    case 'page3User':
      return page3UserRankConfig
    case 'page3New':
      return page3NewRankConfig
    default:
      throw new Error(`未找到榜单页面配置: ${rankType}`)
  }
}
