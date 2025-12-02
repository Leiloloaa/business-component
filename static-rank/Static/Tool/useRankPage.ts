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
import {
  getRankConfig,
  type RankType,
  type RankPageConfig,
} from "./rankUrlConfig";

/**
 * 榜单页面通用逻辑
 * @param options 配置选项
 * @param options.rankType 页面名称，必须是 RankType 中的类型
 * @param options.dayTotal 日榜/总榜标识：0-日榜，1-总榜
 * @param options.selDate 选择的日期
 * @param options.params 额外的请求参数，可以是普通对象、响应式对象、计算属性或函数
 * @returns 榜单页面相关的响应式数据和方法
 */
export const useRankPage = (options: {
  rankType: RankType;
  // 日榜/总榜标识：0-日榜，1-总榜
  dayTotal?: 0 | 1;
  // 初始化日期
  selDate?: string;
  // 是否使用 0 时区时间 默认是 false
  use0TimeZone?: boolean;
  params?: object | ComputedRef<object> | (() => object);
}) => {
  const { use0TimeZone = false } = options;
  const activityId = inject("activityId");
  const { TOOL_BPFunc } = injectTool();

  // 按需获取配置，支持 tree-shaking
  const pageConfig = getRankConfig(options.rankType);
  const appInfo = inject("appInfo") as any;

  // 这两个可能都是改变日/总榜的变量
  const dayTotal = ref(options.dayTotal ?? 0); // 0日榜/1总榜tab
  const selDate = ref(
    dayTotal.value == 1
      ? "999"
      : options.selDate || (use0TimeZone ? appInfo.curTime0 : appInfo.curTime)
  ); // 日期

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
    return {
      url:
        config[
          dayTotal.value == 1 || selDate.value == "999"
            ? "totalUrl"
            : "dailyUrl"
        ] ?? "",
      params: params.value,
      top1Url: dayTotal.value == 0 ? config.top1Url ?? "" : "",
      infoText: (config.infoNum ?? 0) + (dayTotal.value == 0 ? 0 : 1),
    };
  });

  watch(
    () => dayTotal.value,
    () => {
      const config = pageConfig as RankPageConfig;
      TOOL_BPFunc({
        desc:
          config[
            dayTotal.value == 1 || selDate.value == "999"
              ? "totalDesc"
              : "dailyDesc"
          ] ?? "",
        action: "show",
      });
    },
    { immediate: true }
  );

  return {
    rankType: options.rankType,
    dayTotal,
    selDate,
    params,
    tempConfig,
    activityId,
  };
};
