/**
 * useGiftPanel
 *
 * 封装跳转送礼/直播间的通用逻辑：
 * - getRoomInfo: 拉取推荐直播间信息
 * - toGiftPanel: 根据当前环境跳转至送礼面板或直播间
 *
 * 依赖注入：
 * - injectTool: 业务工具（埋点、Loading、Toast 等）
 *
 * 使用方式：
 * const { getRoomInfo, toGiftPanel } = useGiftPanel()
 */
import { inject } from "vue";
import injectTool from "@publicComponents/injectTool";
import { toAppUrl, isLiveBanner, getRoomList } from "@publicComponents/shared";
import useApi from "@hooks/useApi";

interface LiveRoomInfo {
  uid: string;
  roomId: string;
  [key: string]: any;
}

export default function useGiftPanel() {
  const activityId = inject<any>("activityId");
  const { TOOL_loading, TOOL_BPFunc } = injectTool();

  // 常量：默认埋点文案
  const DEFAULT_BP_DESC = "Send_gift_button_click";

  /**
   * 获取推荐直播间信息
   */
  const getRoomInfo = async (): Promise<LiveRoomInfo | undefined> => {
    const url = "/api/activity/commonBusiness/liveRecommendRooms";
    try {
      const data: any = await useApi(url, { count: 1, activityId });
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
