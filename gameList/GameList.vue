<!--
  组件使用示例：
  <GameList />
-->
<template>
  <div class="game-list" v-if="list.length > 0">
    <SwiperFrame
      class="swiper-container-wrap"
      :list="list || []"
      :swiperOptions="swiperOptions"
      :currentIndex="currentIndex"
      :arrowConfig="{
        'name-start': 'g-arr-',
        'arr-width': 0.64,
        'arr-height': 0.64,
        'arr-top': 0.48,
        'arr-margin': 0.08,
      }"
      swiperId="game-list-swiper"
      :allowTouchMove="true"
      @slideChange="handleSlideChange"
    >
      <template #default="{ item, index }">
        <div class="item fc" @click="jumpGame(item)">
          <div v-bg="`game-rew`" class="obg" tag="img"></div>
          <img
            :src="`${oss}/activity/202406_midYearGame/icon${item}.png`"
            alt=""
            class="icon"
          />
        </div>
      </template>
    </SwiperFrame>
  </div>
</template>

<script lang="ts" setup name="gift">
import injectTool from "@publicComponents/injectTool";
import { openAppWebviewByUrl } from "@publicComponents/shared";
import SwiperFrame from "../static-Static/SwiperFrame.vue";
import { oss } from "../../../store";

const { TOOL_httpClient, TOOL_countryCode, TOOL_BPFunc } = injectTool();
const activityId = inject("activityId");

const urlEnum = computed(() => {
  // 路径前缀（hiyoo/chatchill 时使用）
  const prefix = "chatchill-mobile/";

  // yoho 的基础游戏配置
  const baseGameConfigYoho = {
    1: "GC/20190225.html", // greedy
    2: "Slot53/20221101.html", // slot
    3: "Yummy/20191101.html", // yummy
    4: "202301/roulette/index.html", // roulette
    5: "horseRace.html", // derby
    6: "teenPatti.html", // teenpatti
    7: "202404/little-rocket-game/index.html", // rocket
    8: "footballLeague.html", //足球游戏（新 EG、ID、TW）
    9: "tiger-fight-lion.html", // tiger fight lion
    10: "202411/eliminateForFun/index.html", // 消消乐
    11: "202412/chickCross/index.html", // 小鸡快跑
    12: "202502/diceGame/index.html", // Dice Game
    13: "202502/texasCowboy/index.html", // 德州扑克
    14: "202505/multiplayer-fishing/index.html", // 捕鱼游戏
    15: "202508/pachinko/index.html", //小球掉落游戏
  };

  // hiyoo/chatchill 的基础游戏配置
  const baseGameConfigHiyoo = {
    1: "GC/20190225.html", // greedy
    2: "Slot53/20221101.html", // slot
    3: "Yummy/20191101.html", // yummy
    4: "202502/roulette/index.html", // roulette
    5: "horseRace.html", // derby
    6: "teenPatti.html", // teenpatti
    7: "202412/little-rocket-game/index.html", // rocket
    8: "202402/footballLeague/index.html", // football
    9: "tiger-fight-lion.html", // tiger fight lion
    10: "202412/eliminateForFun/index.html", // 消消乐
    14: "202506/multiplayer-fishing/index.html", // 捕鱼游戏
    15: "202509/pachinko/index.html", // 小球掉落游戏
  };

  // 不同国家代码的差异配置
  const countryDiffConfig: Record<string, Record<number, string>> = {
    // 默认配置（非TR国家）
    default: {},
    // 未来如需添加其他国家的差异配置，只需在此添加：
    // TR: {
    // }
  };

  // 根据国家代码获取差异配置，不存在则使用默认配置
  const diffConfig =
    countryDiffConfig[TOOL_countryCode] || countryDiffConfig.default;

  // 根据 isHiyoo 选择基础配置
  const baseConfig = isHiyoo ? baseGameConfigHiyoo : baseGameConfigYoho;
  const config = {
    ...baseConfig,
    ...diffConfig,
  };

  // hiyoo/chatchill 时需要添加前缀
  if (isHiyoo) {
    const result: Record<number, string> = {};
    for (const key in config) {
      result[key] = prefix + config[key];
    }
    return result;
  }

  return config;
});

const list = ref([]);
const currentIndex = ref(0);

// Swiper 配置
const swiperOptions = reactive({
  loop: true,
  speed: 3000,
  initialSlide: 0,
  slidesPerView: 4,
  spaceBetween: 0.16,
  autoplay: {
    delay: 3000, // 每3秒自动切换
    disableOnInteraction: false, // 用户操作后不停止自动播放
  },
});

const getInfo = () => {
  const url = "/api/activity/commonBusiness/gameListNew";
  TOOL_httpClient({
    url,
    method: "get",
    params: {
      activityId,
    },
  })
    .then((response) => {
      let {
        data: { data, errorCode },
      } = response;
      if (errorCode != 0) throw response;
      list.value = data;
      console.log("data:", data);
    })
    .catch(() => {});
};
getInfo();

const handleSlideChange = (data: any) => {
  currentIndex.value = data.realIndex;
};

const jumpGame = async (idx) => {
  await TOOL_BPFunc({
    desc: "Play Games_button_click",
    action: "click",
  });
  const _url =
    `https://m${ENV == "build" ? "" : "-test"}.${secondDomain}.media/` +
    urlEnum.value[idx];
  console.log("jump game link:", TOOL_countryCode, _url);
  openAppWebviewByUrl(_url);
};
</script>

<style lang="scss" scoped>
.game-list {
  width: 7rem;
  margin: 0 auto;
  border-radius: 0.1rem;
  margin-bottom: 0.16rem;
  position: relative;

  .swiper-container-wrap {
    width: 100%;
    height: 1.6rem;
    position: relative;

    .item {
      width: 1.6rem;
      height: 1.6rem;
      flex-shrink: 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        display: block;
        width: 1.22rem;
        height: 1.22rem;
        flex-shrink: 0;
        object-fit: contain;
      }
    }
  }
}
</style>
