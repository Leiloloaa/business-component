/**
 * 使用示例：
 *
 * import useGiftPanel from '@/static-hooks/useGiftPanel'
 *
 * // 在组件中使用
 * const { getRoomInfo, toGiftPanel } = useGiftPanel()
 *
 * // 方式一：获取推荐直播间信息
 * const roomInfo = await getRoomInfo()
 * if (roomInfo) {
 *   console.log('直播间信息:', roomInfo.uid, roomInfo.roomId)
 * }
 *
 * // 方式二：跳转送礼面板或直播间
 * // 默认跳转（根据 isLiveBanner 自动判断）
 * await toGiftPanel()
 *
 * // 带礼物ID跳转（Banner场景）
 * await toGiftPanel({ giftId: '123' })
 *
 * // 自定义埋点文案
 * await toGiftPanel({ giftId: '123', bp: 'Custom_button_click' })
 *
 * 说明：
 * - 该 hook 封装了跳转送礼面板/直播间的通用逻辑
 * - 自动根据 isLiveBanner 判断跳转场景：
 *   - Banner 场景：跳转到送礼面板（需要 giftId）
 *   - 非 Banner 场景：跳转到推荐直播间
 * - 自动处理 Loading 状态和埋点上报
 * - 需要注入 activityId 依赖
 *
 * 返回值：
 * - getRoomInfo: 获取推荐直播间信息，返回 Promise<LiveRoomInfo | undefined>
 * - toGiftPanel: 跳转送礼面板或直播间，参数可选：
 *   - giftId?: string | number - 礼物ID（Banner场景必需）
 *   - bp?: string - 自定义埋点文案（默认: "Send_gift_button_click"）
 */
import { inject } from "vue";
import injectTool from "@publicComponents/injectTool";
import { toAppUrl, isLiveBanner, getRoomList } from "@publicComponents/shared";

interface LiveRoomInfo {
  uid: string;
  roomId: string;
  [key: string]: any;
}

export default function useGiftPanel() {
  const activityId = inject<any>("activityId");
  const { TOOL_loading, TOOL_BPFunc, TOOL_httpClient } = injectTool();

  // 常量：默认埋点文案
  const DEFAULT_BP_DESC = "Send_gift_button_click";

  /**
   * 获取推荐直播间信息
   */
  const getRoomInfo = async (): Promise<LiveRoomInfo | undefined> => {
    const url = "/api/activity/commonBusiness/liveRecommendRooms";
    try {
      const res = await TOOL_httpClient({
        url: url,
        method: "get",
        params: { count: 1, activityId },
      });
      const { data, errorCode } = res.data;
      if (errorCode != 0) throw res;
      return data?.liveRecommendsList?.[0];
    } catch (error) {
      // 记录错误但不抛出，避免影响主流程
      console.error("[useGiftPanel.getRoomInfo] error:", error);
      return undefined;
    }
  };

  /**
   * 跳转送礼面板 / 直播间
   */
  const toGiftPanel = async ({
    giftId,
    bp,
  }: { giftId?: string | number; bp?: string } = {}) => {
    try {
      console.info("点击 toGiftPanel");
      await TOOL_BPFunc({ desc: bp || DEFAULT_BP_DESC, action: "click" });
      TOOL_loading(true);
      if (isLiveBanner) {
        // Banner 场景：跳送礼
        const roomList = await getRoomList();
        if (!roomList?.length) throw new Error("roomList is empty");
        const roomId = roomList[0];
        if (!giftId) throw new Error("giftId invalid");
        await toAppUrl("gift", { roomId, giftId });
      } else {
        // 非 Banner 场景：跳直播
        const room = await getRoomInfo();
        console.log("room===", room);
        const uid = room?.uid;
        const roomId = room?.roomId;
        if (!uid || !roomId) throw new Error("live room invalid");
        await toAppUrl("live", { uid, roomId });
      }
    } catch (error) {
      console.error("[useGiftPanel.toGiftPanel]", error);
    } finally {
      TOOL_loading(false);
    }
  };

  return {
    getRoomInfo,
    toGiftPanel,
  };
}
