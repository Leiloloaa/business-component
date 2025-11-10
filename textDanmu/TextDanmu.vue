<template>
  <div class="marquee-wrap" v-if="obj.arr && obj.arr.length != 0">
    <ul class="marquee-list" :class="{ 'animate-up': obj.animateUp, EG: TOOL_countryCode == 'EG' }">
      <li v-for="item in obj.arr">
        <div class="marquee-item fc">
          <Rep
            :content="TOOL_TEXT[textMap[TOOL_countryCode == 'EG' ? 'EG' : 'TR'][gameInfo.cur]]"
            :rule="[
              {
                reg: '%s',
                eg: true,
                val: item.userInfo?.name,
                type: 'text',
                options: { color: '#FFE601', fontSize: 0.28, width: 0.8, y: 0.08 },
                className: 'ov'
              },
              {
                reg: '%s',
                eg: true,
                val: getRew(item.reward?.packageSpecificRewards?.[0])?.name,
                type: 'text',
                options: { color: '#FFE601', fontSize: 0.28 }
              }
            ]"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, toRefs } from 'vue'
import injectTool from '@publicComponents/injectTool'
import NoticeBar from '../business/NoticeBar.vue'

const { TOOL_TEXT, TOOL_httpClient, TOOL_countryCode } = injectTool()
let obj = reactive({
  arr: [],
  count: 0,
  animateUp: false
})
const getRew = inject('getRew')

const textMap = {
  TR: {
    0: 133,
    1: 132,
    2: 131
  },
  EG: {
    0: 130,
    1: 129,
    2: 128
  }
}

const gameInfo: any = inject('gameInfo')

let timer: any = null
function scrollAnimate() {
  const { animateUp, arr } = toRefs(obj)
  animateUp.value = true
  setTimeout(() => {
    arr.value.push(arr.value[0])
    arr.value.shift()
    animateUp.value = false
  }, 500)
}

timer = setInterval(scrollAnimate, 5000)

const getDanmu = async () => {
  await TOOL_httpClient({
    url: '/api/activity/commonBusiness/bulletScreenList',
    method: 'GET',
    params: {
      activityId: 20104,
      type: gameInfo.cur
    }
  })
    .then((response) => {
      const {
        data: { data, errorCode }
      } = response
      if (errorCode != 0) throw response
      Object.assign(obj.arr, data)
      console.log(obj.arr)
    })
    .catch((error) => {
      console.log('Requeset Api Error! =====', error)
    })
}

watch(
  () => gameInfo.cur,
  async () => {
    await getDanmu()
  }
)

getDanmu()

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.marquee-wrap {
  width: 6.54rem;
  height: 0.72rem;
  flex-shrink: 0;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 0.16rem;

  display: flex;
  align-items: center;

  position: relative;
  z-index: 2;

  .notice {
    width: 0.42542rem;
    height: 0.35119rem;
    flex-shrink: 0;
    object-fit: contain;
  }

  .marquee-list {
    width: 6.54rem;
    height: 0.72rem;
    margin: 0 auto;

    span {
      color: #ffe89a;

      text-align: center;
      font-family: Arial;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem; /* 128.571% */
    }
    li {
      width: 6.54rem;
      height: 0.72rem;
      list-style: none;
      text-align: center;
      display: flex;
      // justify-content: center;
      align-items: center;
      .marquee-item {
        width: 6.54rem;
        height: 0.72rem;
        margin: 0 auto;
        span {
          color: #ffe89a;

          text-align: center;
          font-family: Arial;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.36rem; /* 128.571% */
        }
      }
    }

    .EG {
      span {
        margin-top: -0.08rem;
      }
    }
  }
  .animate-up {
    transition: all 0.6s ease-in-out;
    transform: translateY(-30px);
  }
}
</style>
