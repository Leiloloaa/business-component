import {
  ref,
  computed,
  watch,
  inject,
  reactive,
  isReactive,
  isRef,
  type ComputedRef,
} from "vue";
import injectTool from "@publicComponents/injectTool";
import { useAppStore } from "../../../../store";
import { getQueryString } from "@libraryParams/params";

// ========== 榜单配置 ==========

// 通用榜单 API 基础路径
const API_BASE = "/api/activity/commonBusiness";

/**
 * 榜单页面配置项类型
 */
export interface RankPageConfig {
  /** 页面描述 */
  description: string;
  /** 日榜接口地址 */
  dailyUrl?: string;
  /** 总榜接口地址 */
  totalUrl?: string;
  /** 日榜第一接口地址 */
  top1Url?: string;
  /** 日榜埋点描述 */
  dailyDesc?: string;
  /** 总榜埋点描述 */
  totalDesc?: string;
}

// 用户日榜/总榜配置
export const userRankConfig: RankPageConfig = {
  description: "用户日榜/总榜",
  dailyUrl: `${API_BASE}/userDailyRank/includeHonor`,
  totalUrl: `${API_BASE}/userTotalRank/includeHonor`,
  top1Url: `${API_BASE}/historyTop1`,
  dailyDesc: "user_daily_rank_show",
  totalDesc: "user_total_rank_show",
};

// 主播日榜/总榜配置
export const anchorRankConfig: RankPageConfig = {
  description: "主播日榜/总榜",
  dailyUrl: `${API_BASE}/anchorDailyRank/includeHonor`,
  totalUrl: `${API_BASE}/anchorTotalRank/includeHonor`,
  top1Url: `${API_BASE}/historyTop1`,
  dailyDesc: "anchor_daily_rank_show",
  totalDesc: "anchor_total_rank_show",
};

// 新人送礼日榜/总榜配置
export const newUserRankConfig: RankPageConfig = {
  description: "新人送礼日榜/总榜",
  dailyUrl: `${API_BASE}/newUserDailyRank`,
  totalUrl: `${API_BASE}/newUserTotalRank`,
  top1Url: `${API_BASE}/historyTop1`,
  dailyDesc: "new_daily_rank_show",
  totalDesc: "new_total_rank_show",
};

// 公会日榜/总榜配置
export const unionRankConfig: RankPageConfig = {
  description: "公会日榜/总榜",
  dailyUrl: `${API_BASE}/unionDailyRank`,
  totalUrl: `${API_BASE}/unionTotalRank`,
  dailyDesc: "union_daily_rank_show",
  totalDesc: "union_total_rank_show",
};

// CP日榜/总榜配置
export const cpRankConfig: RankPageConfig = {
  description: "CP日榜/总榜",
  dailyUrl: `${API_BASE}/cpDailyRank`,
  totalUrl: `${API_BASE}/cpTotalRank`,
  top1Url: `${API_BASE}/historyTop1`,
  dailyDesc: "cp_daily_rank_show",
  totalDesc: "cp_total_rank_show",
};

// 家族日榜/总榜配置
export const familyRankConfig: RankPageConfig = {
  description: "家族日榜/总榜",
  dailyUrl: `${API_BASE}/familyDailyRank`,
  totalUrl: `${API_BASE}/familyTotalRank`,
  dailyDesc: "family_daily_rank_show",
  totalDesc: "family_total_rank_show",
};

// 充值日榜/总榜配置
export const rechargeRankConfig: RankPageConfig = {
  description: "充值日榜/总榜",
  dailyUrl: `${API_BASE}/rechargeDailyRank`,
  totalUrl: `${API_BASE}/rechargeTotalRank`,
  dailyDesc: "recharge_daily_rank_show",
  totalDesc: "recharge_total_rank_show",
};

/**
 * 榜单类型常量映射（仅用于类型推断，支持 IDE 自动补全）
 */
const RANK_TYPE_MAP = {
  user: "用户日榜/总榜",
  anchor: "主播日榜/总榜",
  newUser: "新人送礼日榜/总榜",
  union: "公会日榜/总榜",
  cp: "CP日榜/总榜",
  family: "家族日榜/总榜",
  recharge: "充值日榜/总榜",
} as const;

/**
 * 榜单类型枚举 用户、主播、新用户送礼、公会、cp、家族、充值 ...
 * 使用 keyof typeof 确保 IDE 能够提供自动补全提示
 */
export type RankType = keyof typeof RANK_TYPE_MAP;

/**
 * 根据榜单类型获取对应的配置
 * 使用函数形式实现按需导入，支持 tree-shaking
 */
export function getRankConfig(rankType: RankType): RankPageConfig {
  switch (rankType) {
    case "user":
      return userRankConfig;
    case "anchor":
      return anchorRankConfig;
    case "newUser":
      return newUserRankConfig;
    case "union":
      return unionRankConfig;
    case "cp":
      return cpRankConfig;
    case "family":
      return familyRankConfig;
    case "recharge":
      return rechargeRankConfig;
    default:
      throw new Error(`未找到榜单页面配置: ${rankType}`);
  }
}

// ========== 榜单页面 Hook ==========

/**
 * 榜单页面通用逻辑
 * @param options 配置选项
 * @param options.rankType 榜单类型，必须是 RankType 中的类型
 * @param options.dayTotal 日榜/总榜标识：0-日榜，1-总榜，如果不传则从 URL 参数 isTotal 获取
 * @param options.selDate 初始化日期
 * @param options.pageBpDesc 页面挂载时的埋点描述，如果传入则自动调用 TOOL_BPFunc
 * @param options.onlyTotal 是否只显示总榜（不显示日榜切换），如果为 true，则强制 dayTotal 为 1 且隐藏 DateTab（默认为 false）
 * @param options.use0TimeZone 是否使用 0 时区时间，默认是 false
 * @param options.infoTextList 自定义 infoText 数组，不传则使用 config.infoNum 计算
 * @param options.params 额外的请求参数，可以是普通对象、响应式对象、计算属性或函数
 */
export const useRankPage = (options: {
  rankType: RankType;
  dayTotal?: 0 | 1;
  selDate?: string;
  pageBpDesc?: string;
  onlyTotal?: boolean;
  use0TimeZone?: boolean;
  infoTextList?: Array<number>;
  params?: object | ComputedRef<object> | (() => object);
}) => {
  const { use0TimeZone = false, onlyTotal = false } = options;
  const activityId = inject("activityId");
  const { TOOL_BPFunc } = injectTool();

  // 按需获取配置，支持 tree-shaking
  const pageConfig = getRankConfig(options.rankType);
  const appStore = useAppStore() as any;

  // 如果 onlyTotal 为 true，强制为总榜；否则获取 isTotal 参数，如果 options.dayTotal 未传入，则从 URL 参数获取
  const isTotal = onlyTotal
    ? 1
    : options.dayTotal ?? Number(getQueryString("isTotal")) ?? 0;

  // 这两个可能都是改变日/总榜的变量
  const dayTotal = ref(isTotal as 0 | 1); // 0日榜/1总榜tab
  const selDate = ref(
    dayTotal.value == 1
      ? "999"
      : options.selDate || (use0TimeZone ? appStore.curTime0 : appStore.curTime)
  ); // 日期

  // DateAvatar 初始化完成标记（响应式）
  // 如果是总榜（dayTotal == 1），则直接为 true，因为不需要 DateAvatar
  const dateReady = ref(dayTotal.value == 1);

  // 将 params 转换为计算属性，支持追踪外部响应式变量的变化
  // 如果传入的是计算属性或函数，直接使用；如果是响应式对象，转换为计算属性；否则创建响应式对象并转换为计算属性
  const params = computed(() => {
    if (!options.params) return {};

    // 如果是计算属性，直接返回其值
    if (isRef(options.params) && "effect" in options.params) {
      return (options.params as ComputedRef<object>).value;
    }

    // 如果是函数，调用函数获取值
    if (typeof options.params === "function") {
      return options.params();
    }

    // 如果是响应式对象，直接返回
    if (isReactive(options.params)) {
      return options.params;
    }

    // 如果是普通对象，返回它（在计算属性中会被追踪）
    return options.params;
  });

  console.info("当前榜单页面配置 ===", { ...pageConfig, use0TimeZone });

  const tempConfig = computed(() => {
    const config = pageConfig as RankPageConfig;
    // 是否显示榜单：日榜需要等 DateAvatar ready，总榜直接显示
    const showRank = dateReady.value || dayTotal.value == 1;
    return {
      rankType: options.rankType,
      onlyTotal,
      dateReady: dateReady.value,
      showRank,
      url: config[
        dayTotal.value == 1 || selDate.value == "999" ? "totalUrl" : "dailyUrl"
      ],
      params: params.value,
      top1Url: dayTotal.value == 0 ? config.top1Url : "",
      infoText: options?.infoTextList
        ? dayTotal.value == 0
          ? options?.infoTextList[0]
          : options?.infoTextList[1]
        : 0,
    };
  });

  // 页面挂载时的埋点
  if (options.pageBpDesc) {
    TOOL_BPFunc({ desc: options.pageBpDesc, action: "show" });
  }

  watch(
    () => dayTotal.value,
    () => {
      const config = pageConfig as RankPageConfig;
      // 如果是总榜，dateReady 直接为 true；如果是日榜，重置为 false，等待 DateAvatar ready
      dateReady.value = dayTotal.value == 1;
      TOOL_BPFunc({
        desc: config[
          dayTotal.value == 1 || selDate.value == "999"
            ? "totalDesc"
            : "dailyDesc"
        ],
        action: "show",
      });
    },
    { immediate: true }
  );

  return {
    dayTotal,
    selDate,
    params,
    tempConfig,
    activityId,
    dateReady, // 保留 dateReady，供外部 @ready 事件修改
  };
};
