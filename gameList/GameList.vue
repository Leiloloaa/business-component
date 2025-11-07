<template>
  <!-- gift -->
  <div class="game-list">
    <CommonSwiper
      class="swiper-container-wrap"
      :list="list || []"
      :swiper-options="swiperOptions"
      :current-index="currentIndex"
      :arrow-config="{
        'name-start': 'g-arr-',
        'arr-width': 0.64,
        'arr-height': 0.64,
        'arr-top': 0.48,
        'arr-margin': 0.08
      }"
      swiper-id="game-list-swiper"
      :allow-touch-move="true"
      @slide-change="handleSlideChange"
    >
      <template #default="{ item, index }">
        <div class="item fc" @click="jumpGame(item)">
          <OssImg src="rew" class="obg" tag="img"></OssImg>
          <img
            :src="`//image.${keyWord}.media/activity/202406_midYearGame/icon${item}.png`"
            alt=""
            class="icon"
          />
        </div>
      </template>
    </CommonSwiper>
  </div>
</template>

<script lang="ts" setup name="gift">
import injectTool from '@publicComponents/injectTool'
import { openAppWebviewByUrl } from '@publicComponents/shared'
import CommonSwiper from './Components/CommonSwiper.vue'

const { TOOL_httpClient, TOOL_countryCode, TOOL_BPFunc } = injectTool()
const activityId = inject('activityId')

const urlEnum = computed(() => {
  // 基础游戏配置
  const baseGameConfig = {
    1: 'GC/20190225.html', // greedy
    2: 'Slot53/20221101.html', // slot
    3: 'Yummy/20191101.html', // yummy
    4: '202301/roulette/index.html', // roulette
    5: 'horseRace.html', // derby
    6: 'teenPatti.html', // teenpatti
    7: '202404/little-rocket-game/index.html', // rocket
    9: 'tiger-fight-lion.html', // tiger fight lion
    10: '202411/eliminateForFun/index.html', // 消消乐
    11: '202412/chickCross/index.html', // 小鸡快跑
    12: '202502/diceGame/index.html', // Dice Game
    13: '202502/texasCowboy/index.html', // 德州扑克
    14: '202505/multiplayer-fishing/index.html', // 捕鱼游戏
    15: '202508/pachinko/index.html' //小球掉落游戏
  }

  // 不同国家代码的差异配置
  const countryDiffConfig: Record<string, Record<number, string>> = {
    // 默认配置（非TR国家）
    default: {
      8: 'footballLeague.html' //足球游戏（新 EG、ID、TW）
    },
    // TR国家
    TR: {
      8: '202403/footballLeague/index.html' // football
    }
    // 未来如需添加其他国家的差异配置，只需在此添加：
    // TW: {
    //   8: 'xxx/xxx.html'
    // }
  }

  // 根据国家代码获取差异配置，不存在则使用默认配置
  const diffConfig = countryDiffConfig[TOOL_countryCode] || countryDiffConfig.default
  return {
    ...baseGameConfig,
    ...diffConfig
  }
})

const urlEnumHiyoo = {
  1: 'chatchill-mobile/GC/20190225.html', // greedy  https://m.chatchill.media/chatchill-mobile/GC/20190225.html
  2: 'chatchill-mobile/Slot53/20221101.html', // slot https://m.chatchill.media/chatchill-mobile/Slot53/20221101.html#/
  3: 'chatchill-mobile/Yummy/20191101.html', // yummy https://m.chatchill.media/chatchill-mobile/Yummy/20191101.html#/
  4: 'chatchill-mobile/202502/roulette/index.html', // roulette
  5: 'chatchill-mobile/horseRace.html', // derby https://m.chatchill.media/chatchill-mobile/horseRace.html
  6: 'chatchill-mobile/teenPatti.html', // teenpatti https://m.chatchill.media/chatchill-mobile/teenPatti.html#/
  7: 'chatchill-mobile/202412/little-rocket-game/index.html', // rocket
  8: 'chatchill-mobile/202402/footballLeague/index.html', // football https://m.chatchill.media/chatchill-mobile/202402/footballLeague/index.html
  9: 'chatchill-mobile/tiger-fight-lion.html', // tiger fight lion https://m.chatchill.media/chatchill-mobile/tiger-fight-lion.html
  10: 'chatchill-mobile/202412/eliminateForFun/index.html' // 消消乐
}

const keyWord = window.hostConfig?.domain ?? 'yoko'
const domain = `https://m${ENV == 'build' ? '' : '-test'}.${
  String(activityId).startsWith('1') ? 'waka' : 'chatchill'
}.media/`

const list = ref([])
const currentIndex = ref(0)

// Swiper 配置
const swiperOptions = reactive({
  loop: true,
  speed: 1000,
  initialSlide: 0,
  slidesPerView: 4,
  spaceBetween: 0.16,
  autoplay: {
    delay: 3000, // 每3秒自动切换
    disableOnInteraction: false // 用户操作后不停止自动播放
  }
  // navigation: {
  //   nextEl: '.next',
  //   prevEl: '.prev'
  // }
})

const getInfo = () => {
  const url = '/api/activity/commonBusiness/gameList'
  TOOL_httpClient({
    url,
    method: 'get',
    params: {
      activityId
    }
  })
    .then((response) => {
      let {
        data: { data, errorCode }
      } = response
      if (errorCode != 0) throw response
      list.value = data
      console.log('data:', data)
    })
    .catch(() => {})
}
getInfo()

const handleSlideChange = (data: any) => {
  currentIndex.value = data.realIndex
}

const jumpGame = async (idx) => {
  await TOOL_BPFunc({ desc: 'coins_games_tab', action: 'click' })
  console.log(
    'jump game link2:',
    TOOL_countryCode,
    domain + (String(activityId).startsWith('1') ? urlEnum.value[idx] : urlEnumHiyoo[idx])
  )
  openAppWebviewByUrl(
    domain + (String(activityId).startsWith('1') ? urlEnum.value[idx] : urlEnumHiyoo[idx])
  )
}
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
