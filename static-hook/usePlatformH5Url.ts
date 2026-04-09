/**
 * 使用示例：
 *
 * import { usePlatformH5Url } from '@/static-hooks/usePlatformH5Url'
 *
 * // 在组件中使用
 * const { getPlatformH5Url, navigateToPlatformH5 } = usePlatformH5Url()
 *
 * // 方式一：获取 URL 后自行处理
 * const gameBoxUrl = getPlatformH5Url('gameBox')
 * console.log(gameBoxUrl) // 输出完整的 URL
 *
 * // 方式二：直接跳转
 * navigateToPlatformH5('gameCenter')
 *
 * 说明：
 * - 该 hook 用于获取和跳转平台 H5 页面
 * - 支持的类型：'gameBox' | 'gameCenter'
 * - 自动根据 PROJECT 判断使用 yoho 或 chatchill 路径
 * - 自动根据 ENV 判断使用测试环境或生产环境域名
 * - 需要在组件中注入 'domain' 依赖（yoho 项目使用）
 *
 * 支持的页面类型：
 * - gameBox: 游戏盒子页面
 * - gameCenter: 游戏中心页面
 */
import { inject } from "vue";

/**
 * 平台 H5 页面类型
 */
export type PlatformH5Type = "gameBox" | "gameCenter";

/**
 * 路径配置接口
 */
interface PathConfig {
  // project == 1 (yoho) 时的路径
  yoho: string;
  // project == 2 (chatchill) 时的路径
  chatchill: string;
}

/**
 * 路径配置映射表
 * 在这里维护所有平台 H5 页面的路径
 */
const PATH_CONFIG_MAP: Record<PlatformH5Type, PathConfig> = {
  gameBox: {
    yoho: "202506/gameBox/index.html?game_id=2",
    chatchill: "chatchill-mobile/202505/gameBox/index.html?game_id=99",
  },
  gameCenter: {
    yoho: "202502/gameCenter/index.html?webViewStyle=1",
    chatchill: "chatchill-mobile/202405/GameCenter/index.html",
  },
};

/**
 * 获取平台 H5 URL 的 hook
 * @returns 返回获取 URL 和跳转的函数
 */
export function usePlatformH5Url() {
  /**
   * 获取平台 H5 URL
   * @param type 页面类型
   * @param customDomain 自定义域名（可选，默认为 yoho）
   * @returns 返回完整的 URL
   */
  const getPlatformH5Url = (type: PlatformH5Type) => {
    const domain = inject("domain") as string;
    const pathConfig = PATH_CONFIG_MAP[type];

    if (!pathConfig) {
      console.warn(`未找到类型 ${type} 的路径配置`);
      return "";
    }

    // yoho、chatchill 路径相同
    const baseUrl = `https://m${ENV == "build" ? "" : "-test"}`;

    switch (Number(PROJECT)) {
      case 1:
        // yoho 项目
        return `${baseUrl}.${domain}.media/${pathConfig.yoho}`;
      case 2:
        // chatchill 项目
        return `${baseUrl}.chatchill.media/${pathConfig.chatchill}`;
      default:
        return "";
    }
  };

  /**
   * 跳转到平台 H5 页面
   * @param type 页面类型
   */
  const navigateToPlatformH5 = (type: PlatformH5Type) => {
    const url = getPlatformH5Url(type);
    if (url) {
      window.location.href = url;
    }
  };

  return {
    getPlatformH5Url,
    navigateToPlatformH5,
  };
}
