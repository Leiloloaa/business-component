<template>
  <div class="game-wrap">
    <div class="game-item fc" v-for="(item, idx) in gameList" v-show="idx < 3">
      <img :src="`//image.${domain}.media/activity/202406_midYearGame/icon${item}.png`" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup name="ClickBtn">
import { ref, watch, inject } from 'vue'
import injectTool from '@publicComponents/injectTool'

const { TOOL_httpClient, TOOL_loading } = injectTool()
const domain = inject('domain')

const props = defineProps({
  gameList: {
    type: Array,
    default: () => []
  }
})

// 这个名字需要核对
const gameObj = {
  greedycat: 1,
  slot_frenzy: 2,
  yummy: 3,
  roulette: 4,
  derby: 5,
  teen_patti: 6,
  crash_rocket: 7,
  football_league: 8,
  liger_fight: 9,
  eliminateslot: 10,
  chickCross: 11,
  diceGame: 12,
  texasCowboy: 13,
  multiplayer_fishing: 14,
  pachinko: 15
}
</script>

<style lang="scss" scoped>
.game-wrap {
  display: flex;
  align-items: center;
  .game-item {
    width: 0.66rem;
    height: 0.66rem;
    flex-shrink: 0;

    margin-left: 0.04rem;
    margin-right: 0.04rem;

    border-radius: 50%;
    border: 0.02rem solid #a23e00;

    img {
      width: 0.64rem;
      height: 0.64rem;
      flex-shrink: 0;
      border-radius: 50%;
    }
  }
}
</style>
