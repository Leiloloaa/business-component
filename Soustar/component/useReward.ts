import { fnGetInjectInfo } from "@components/developTool_TS";

// 直接传入奖励对象，返回显示文本（数量/天数/小时）
export const useRewardNum = (
  reward: any,
  {
    showSymbol = false,
    day = 1,
    days = 2,
    hours = 3,
  }: {
    showSymbol?: boolean;
    day?: number;
    days?: number;
    hours?: number;
  } = {}
): string => {
  const { TOOL_TEXT } = fnGetInjectInfo();
  // 使用数量(count)的礼物类型，其他类型使用天数或小时
  const useCountType = ["exp", "vipExp", "gold", "gameCoins", "giftBag"];
  const type = reward.goodsType || reward.type || "";
  const prefix = showSymbol ? "" : "";

  // 如果是数量类型，显示 count
  if (useCountType.includes(type)) {
    const count = reward.count || reward.rewardCount || 0;
    return `${prefix}${count}`;
  }

  // 其他类型显示天数或小时
  const rewardDays = reward.days;
  const rewardHours = reward.hours;

  // 如果 days 有值，显示天数
  if (rewardDays) {
    const dayIndex = rewardDays > 1 ? 'days' : 'day';
    return `${prefix}${rewardDays}${dayIndex}`;
  }

  // 如果 hours 有值，显示小时
  if (rewardHours) {
    return `${prefix}${rewardHours}${'hours'}`;
  }

  // 兜底：显示 count
  const count = reward.count || reward.rewardCount || 0;
  return `${prefix}${count}`;
};

/**
 * 将下面复制给 cursor，然后截图文案行数表，TextConfig 维护流程：
 * 1. 根据枚举提取 goodsType 和中文 desc，生成 { text: 0, desc, goodsType } 对象
 *    格式：OT_Avatar(1, "avatar"),//头像框 → { text: 0, desc: "头像框", goodsType: "avatar" }
 * 2. 截图多语言后台的编号-文案对照表，匹配 desc 填入对应 text 编号，未匹配的保持 text: 0
 * 3. 排序：有 text 的按编号升序排前面，text 为 0 的排后面
 */
const TextConfig = [
  // 有 text 的，按图中编号 66~77 排序
  { text: 66, desc: "金币", goodsType: "gold" },
  { text: 67, desc: "座驾", goodsType: "car" },
  { text: 68, desc: "头像框", goodsType: "avatar" },
  { text: 69, desc: "聊天气泡", goodsType: "bubble" },
  { text: 70, desc: "勋章", goodsType: "medal" },
  { text: 71, desc: "AAAA-ID", goodsType: "c1" },
  { text: 72, desc: "开屏", goodsType: "c2" },
  { text: 73, desc: "房间麦位皮肤", goodsType: "MicSkin" },
  { text: 74, desc: "荣誉称号", goodsType: "honorTitle" },
  { text: 75, desc: "发言波纹", goodsType: "waves" },
  { text: 76, desc: "游戏币", goodsType: "gameCoins" },
  { text: 77, desc: "经验值", goodsType: "exp" },
  // 无 text 的
  { text: 0, desc: "Unknown", goodsType: "unknown" },
  { text: 0, desc: "进场特效", goodsType: "enterEffects" },
  { text: 0, desc: "房间名片", goodsType: "roomCard" },
  { text: 0, desc: "直播封面装扮", goodsType: "roomCoverFrame" },
  { text: 0, desc: "房间背景", goodsType: "roomBg" },
  { text: 0, desc: "房间封面背景", goodsType: "roomCoverBg" },
  { text: 0, desc: "动态背景", goodsType: "momentBg" },
  { text: 0, desc: "主页飘屏", goodsType: "homepageShow" },
  { text: 0, desc: "个人资料卡背景", goodsType: "miniProfileBg" },
  { text: 0, desc: "等级框", goodsType: "levelFrame" },
  { text: 0, desc: "房间资料皮肤", goodsType: "RoomInfoSkin" },
  { text: 0, desc: "房间封面装扮", goodsType: "RoomCoverOrn" },
  { text: 0, desc: "房间等级勋章", goodsType: "RoomLevelMedal" },
  { text: 0, desc: "靓号ID", goodsType: "NiceId" },
  { text: 0, desc: "房间麦位底部皮肤", goodsType: "MicBottomSkin" },
  { text: 0, desc: "cp戒指", goodsType: "cpRing" },
  { text: 0, desc: "用户权益", goodsType: "userRight" },
  { text: 0, desc: "礼包", goodsType: "giftBag" },
  { text: 0, desc: "vip经验值", goodsType: "vipExp" },
  { text: 0, desc: "背包礼物", goodsType: "bagGift" },
];

export const useRewardName = (reward: any): string => {
  const { TOOL_TEXT } = fnGetInjectInfo();

  // 拿到 reward.goodsType 去找 TextConfig 中的 text 值，如果找不到或为 0，返回 '--'
  const text = TextConfig.find((item) => item.goodsType === reward.goodsType);
  const textIndex = text?.text ?? 0;
  if (textIndex === 0) {
    console.warn("[useRewardName] goodsType not found:", reward.goodsType);
    return "--";
  }
  return TOOL_TEXT[textIndex - 1] || "--";
};
