<template>
  <div class="chart-guide-wrap">
    <img :src="`${ossUrl}/chart-guide-bg.png`" alt="" class="bg" />
    <div class="return fc" v-bg="'rule'" @click="toHome">
      <Outline :color="1 ? '0.05rem #ff6c27' : '0.05rem #581604'" :text="TOOL_TEXT[604]" />
    </div>

    <div class="content">
      <div v-bg="'chart-title'" class="title">
        <div class="title-text1 fc">
          <!-- <img :src="`${ossUrl}/chart-guide-title-icon.png`" alt="" class="title-icon" /> -->
          <Space :val="0.13" />
          <Outline :color="1 ? '0.05rem #AF2300' : '0.05rem #581604'" :text="TOOL_TEXT[25]" />
        </div>
        <!-- <div class="title-text2 fc">
          <Outline :color="1 ? '0.05rem #AF2300' : '0.05rem #581604'" :text="TOOL_TEXT[604]" />
        </div> -->
      </div>

      <!-- <div v-bg="'chart-sub-title'" class="sub-title fc">
        <Outline :color="1 ? '0.05rem #E00407' : '0.05rem #581604'" :text="TOOL_TEXT[1]" />
      </div> -->

      <div class="sw-wrap">
        <!-- PoolSwiper3: 大图轮播 -->
        <!-- <div class="swiper3-wrap" v-if="pageInfo.curStep == 1">
          <Swiper
            class="swiper3"
            :loop="false"
            :speed="300"
            :initialSlide="pageInfo.curIdx"
            :slidesPerView="1"
            :allowTouchMove="pageInfo.curIdx != 0"
            @slideChange="onSwiper3Change"
          >
            <SwiperSlide
              v-for="(fid, idx) in [
                'wakam/d5acb19797042578eddb064d5b9c122c',
                'wakam/409e6f76ed85c33384cc9dcad54948db'
              ]"
              :key="fid"
            >
              <div class="reward-wrap">
                <cdnImg :fid="fid" :compress="false" class="reward-img"></cdnImg>
                <div class="chart-light fc">
                  <span>{{ TOOL_TEXT[pageInfo.isAllLight ? 171 : 172] }}</span>
                </div>
                <OssImg src="chart-opt" class="swiper4-wrap">
                  <Outline
                    :color="1 ? '0.05rem #FFE680' : '0.05rem #581604'"
                    :text="TOOL_TEXT[74]"
                    class="swiper4-title"
                  />
                  <div class="swiper4-wrap" v-if="pageInfo.userlist?.length > 5">
                    <Swiper
                      class="swiper4"
                      :loop="true"
                      :speed="1000"
                      :slidesPerView="5"
                      :autoplay="{ delay: 1800, disableOnInteraction: false }"
                    >
                      <SwiperSlide v-for="(user, uIdx) in pageInfo.userlist" :key="'u' + uIdx">
                        <div class="user-avatar-item fcc">
                          <Avatar
                            :data="user || {}"
                            :pic="{ sofa: 'sofa', frame: 'a', live: 'live' }"
                            :option="{ radius: 1, live: 1, alwaysLive: 0, jump: 1 }"
                            :styleConfig="{
                              frame: { width: '1.1rem', height: '1.1rem' },
                              avatar: { width: '0.78rem', height: '0.78rem' }
                            }"
                          />
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                  <div class="user-avatar-list" v-else>
                    <div
                      class="user-avatar-item fcc"
                      v-for="(user, uIdx) in pageInfo.userlist"
                      :key="'u' + uIdx"
                    >
                      <Avatar
                        :data="user || {}"
                        :pic="{ sofa: 'sofa', frame: 'a', live: 'live' }"
                        :option="{ radius: 1, live: 1, alwaysLive: 0, jump: 1 }"
                        :styleConfig="{
                          frame: { width: '1.1rem', height: '1.1rem' },
                          avatar: { width: '0.78rem', height: '0.78rem' }
                        }"
                      />
                    </div>
                  </div>
                </OssImg>
              </div>
            </SwiperSlide>
          </Swiper>
          <OssImg
            src="lv-arrow-l"
            v-animate
            class="swiper-btn prev3"
            @click="swiper3Prev"
            v-show="pageInfo.curIdx == 1"
          />
          <OssImg
            src="lv-arrow-r"
            v-animate
            class="swiper-btn next3"
            @click="swiper3Next"
            v-show="pageInfo.curIdx == 0"
          />
        </div> -->

        <div class="single-reward">
          <div class="reward-wrap">
            <cdnImg
              :fid="'wakam/d5acb19797042578eddb064d5b9c122c'"
              :compress="false"
              class="reward-img"
            ></cdnImg>
            <div class="chart-light fc">
              <span>{{ TOOL_TEXT[pageInfo.isAllLight ? 171 : 172] }}</span>
            </div>

            <div v-bg="'chart-opt'" class="swiper4-wrap">
              <Outline
                :color="1 ? '0.05rem #E00407' : '0.05rem #581604'"
                :text="TOOL_TEXT[29]"
                class="swiper4-title"
              />
              <!-- PoolSwiper4: 用户头像轮播 -->
              <div class="swiper4-wrap" v-if="pageInfo.userlist?.length > 5">
                <Swiper
                  class="swiper4"
                  :loop="true"
                  :speed="1000"
                  :slidesPerView="5"
                  :autoplay="{ delay: 1800, disableOnInteraction: false }"
                >
                  <SwiperSlide v-for="(user, uIdx) in pageInfo.userlist" :key="'u' + uIdx">
                    <div class="user-avatar-item fcc">
                      <Avatar
                        :data="user || {}"
                        :pic="{ sofa: 'sofa', frame: 'a', live: 'live' }"
                        :option="{ radius: 1, live: 1, alwaysLive: 0, jump: 1 }"
                        :styleConfig="{
                          frame: { width: '1.1rem', height: '1.1rem' },
                          avatar: { width: '0.78rem', height: '0.78rem' }
                        }"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <div class="user-avatar-list" v-else>
                <div
                  class="user-avatar-item fcc"
                  v-for="(user, uIdx) in pageInfo.userlist"
                  :key="'u' + uIdx"
                >
                  <Avatar
                    :data="user || {}"
                    :pic="{ sofa: 'sofa', frame: 'a', live: 'live' }"
                    :option="{ radius: 1, live: 1, alwaysLive: 0, jump: 1 }"
                    :styleConfig="{
                      frame: { width: '1.1rem', height: '1.1rem' },
                      avatar: { width: '0.78rem', height: '0.78rem' }
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tip" @click="toIllGift">{{ TOOL_TEXT[30] }}</div>

      <div class="bottom-wrap">
        <div v-bg="'chart-three-title'" class="three-title fc">
          <Outline :color="1 ? '0.05rem #AF2300' : '0.05rem #581604'" :text="TOOL_TEXT[31]" />
        </div>
        <div class="tip2 fc">
          <span> {{ TOOL_TEXT[32] }}</span>
        </div>

        <!-- PoolSwiper: 奖励轮播 -->
        <div class="swiper-reward-wrap">
          <Swiper
            class="swiper-reward"
            :loop="true"
            :speed="1000"
            :slidesPerView="4"
            :autoplay="{ delay: 1800, disableOnInteraction: false }"
          >
            <SwiperSlide v-for="(item, idx) in pageInfo.list" :key="'r' + idx">
              <div class="reward-item">
                <div v-bg="'rew'" class="rew-img fc">
                  <cdnImg :fid="item.src" :info="item"></cdnImg>
                </div>
                <div v-bg="'chart-coin'" class="coin-wrap fc" v-if="item.coin">
                  <img :src="`${OSS_DOMAIN}/activity/yoho-ui/coin.png`" class="coin-icon" />
                  <span>{{ item.coin }}</span>
                </div>
                <div class="progress-wrap fc">
                  <div v-bg="'chart-progress'" class="progress fc">
                    <div class="progress-inner">
                      <div
                        class="act"
                        :style="{
                          width:
                            (item.progress / item.require < 1
                              ? (item.progress / item.require) * 1.56
                              : 1.56) + 'rem'
                        }"
                      ></div>
                    </div>
                    <div class="score fc">
                      <span>{{ TOOL_NUM(item.progress) }}</span>
                      <span>/{{ TOOL_NUM(item.require) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="FamilyChartGuide">
import injectTool from '@publicComponents/injectTool'
import { toAppUrl } from '@publicComponents/shared'

// Swiper
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Autoplay } from 'swiper'
SwiperCore.use([Navigation, Autoplay])

const { TOOL_TEXT, TOOL_BPFunc, TOOL_countryCode, TOOL_NUM, TOOL_httpClient, TOOL_loading } =
  injectTool()

const activityId = inject('activityId')
const ossUrl = inject('ossUrl')
const OSS_DOMAIN = inject('OSS_DOMAIN')
const router = useRouter()
const route = useRoute()

const toHome = () => {
  router.replace('/')
}

// Swiper3 控制
let swiper3Instance: any = null
const onSwiper3Change = (swiper: any) => {
  swiper3Instance = swiper
  pageInfo.curIdx = swiper.realIndex
  getInfo()
  getUserInfo()
}
const swiper3Prev = () => {
  swiper3Instance?.slidePrev()
}
const swiper3Next = () => {
  swiper3Instance?.slideNext()
}

const pageInfo = reactive<any>({ status: 0, timeLeft: 0 })

TOOL_BPFunc({ desc: 'CP Gift Collection_page', action: 'show' })

const getInfo = async () => {
  TOOL_loading()
  const url = '/api/activity/commonBusiness/illGiftTaskInfo'
  await TOOL_httpClient({
    url,
    method: 'get',
    params: { activityId }
  })
    .then((response) => {
      let {
        data: { data, errorCode }
      } = response
      if (errorCode != 0) throw response
      pageInfo.list = data

      // 是否 list 全是 progress=1？
      pageInfo.isAllLight = data.every((item) => item.progress == 1)
      console.log('pageInfo.isAllLight===', pageInfo.isAllLight)
    })
    .finally(() => {
      TOOL_loading(false)
    })
}

const getUserInfo = async () => {
  const url = '/api/activity/commonBusiness/illAllUser'
  await TOOL_httpClient({
    url,
    method: 'get',
    params: { activityId }
  }).then((response) => {
    let {
      data: { data, errorCode }
    } = response
    if (errorCode != 0) throw response
    pageInfo.userlist = data.list
    if (data.list.length == 0) {
      pageInfo.userlist = [{}, {}, {}, {}, {}]
    }
    console.log('pageInfo.userlist===', pageInfo.userlist)
    pageInfo.userInfo = data.userInfo
  })
}

const toIllGift = async () => {
  if (pageInfo.curIdx == 0) {
    await TOOL_BPFunc({ desc: 'Check Family Collection_page', action: 'click' })
  } else {
    await TOOL_BPFunc({ desc: 'Check King＆Queen Collection_page', action: 'click' })
  }
  toAppUrl('illGift', { uid: pageInfo.userInfo.uid })
}

onMounted(async () => {
  await getInfo()
  await getUserInfo()
})
</script>

<style lang="scss" scoped>
.chart-guide-wrap {
  width: 7.5rem;
  min-height: 19rem;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  .return {
    width: 1.41rem;
    height: 0.56rem;

    position: absolute;
    top: 0.61rem;
    right: 0rem;
    z-index: 20;

    span {
      color: #fff;
      text-align: center;
      -webkit-text-stroke-width: 2px;
      -webkit-text-stroke-color: #ff6c27;
      font-family: 'Geeza Pro';
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 123.077% */
    }
  }

  .bg {
    width: 7.5rem;
    height: 13.44rem;
    aspect-ratio: 125/224;
    position: absolute;
    top: 0;
    left: 0;
  }

  .content {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      width: 5.42rem;
      height: 1.36rem;

      margin-top: 0.73rem;
      padding-top: 0.49rem;
      padding-bottom: 0.27rem;

      display: flex;
      flex-direction: column;
      justify-content: center;

      .title-text1 {
        height: 0.52rem;

        img {
          width: 0.50074rem;
          height: 0.52rem;
        }

        span {
          color: #f4ffbd;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #af2300;
          font-family: 'SF UI Text';
          font-size: 0.3rem;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }

      .title-text2 {
        span {
          color: #f4ffbd;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #af2300;
          font-family: 'SF UI Text';
          font-size: 0.3rem;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }
    }

    .sub-title {
      width: 6.5rem;
      height: 0.56rem;
      margin-top: 0.41rem;
      span {
        color: #fff;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #e00407;
        font-family: 'SF UI Text';
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.32rem; /* 106.667% */
      }
    }

    .reward-title {
      width: 6.5rem;
      height: 0.82rem;
      flex-shrink: 0;

      margin-top: 0.16rem;

      display: flex;
      justify-content: center;
      position: relative;

      .inner-desc {
        width: 7.18rem;
        height: 10.12rem;
        flex-shrink: 0;
        // background: linear-gradient(
        //   270deg,
        //   rgba(255, 123, 0, 0) 0%,
        //   rgba(255, 190, 50, 0.4) 40%,
        //   rgba(255, 190, 50, 0.4) 60%,
        //   rgba(255, 123, 0, 0) 100%
        // );

        background: linear-gradient(
          270deg,
          rgba(17, 0, 255, 0) 0%,
          rgba(204, 50, 255, 0.4) 40%,
          rgba(204, 50, 255, 0.4) 60%,
          rgba(17, 0, 255, 0) 100%
        );

        position: absolute;
        top: 0.26rem;
        left: 50%;
        transform: translateX(-50%);
      }

      span {
        margin-top: 0.35rem;
        color: #e100bc;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #fff1c3;
        font-family: 'SF UI Text';
        font-size: 0.26rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.28rem; /* 107.692% */
      }
    }

    .sw-wrap {
      height: 8.28rem;
      flex-shrink: 0;

      margin: 0.24rem auto;
      margin-top: 0.6rem;

      &::after {
        content: '';
        width: 7.18rem;
        height: 10.12rem;
        background: linear-gradient(
          270deg,
          rgba(172, 0, 43, 0) 0%,
          rgba(118, 4, 6, 0.4) 40%,
          rgba(118, 4, 6, 0.4) 60%,
          rgba(172, 0, 43, 0) 100%
        );

        position: absolute;
        top: 2.5rem;
        left: 50%;
        transform: translateX(-50%);
      }

      // PoolSwiper3: 大图轮播
      .swiper3-wrap {
        position: relative;
        z-index: 2;

        .swiper3 {
          width: 5.4rem;
          height: 8.28rem;
          direction: ltr;
        }

        .swiper-btn {
          width: 0.8rem;
          height: 0.8rem;
          position: absolute;
          top: 3.36rem;
          z-index: 10;

          &.prev3 {
            left: -0.57rem;
          }
          &.next3 {
            right: -0.57rem;
          }
        }
      }

      .single-reward,
      .swiper3-wrap {
        .reward-wrap {
          width: fit-content;
          margin: 0 auto;
          position: relative;

          .chart-light {
            width: 1.73rem;
            height: 0.4rem;
            flex-shrink: 0;
            fill: linear-gradient(
              270deg,
              #ff521e 0.06%,
              rgba(255, 50, 50, 0.46) 79.57%,
              rgba(255, 59, 252, 0) 98.5%
            );

            position: absolute;
            top: 0.17rem;
            right: 0;

            span {
              color: #faf0ff;
              font-family: 'SF UI Text';
              font-size: 0.2rem;
              font-style: normal;
              font-weight: 500;
              line-height: 0.32rem;
            }
          }

          .reward-img {
            width: 5.4rem !important;
            height: 8.28rem !important;
            object-fit: contain;
          }

          .swiper4-wrap {
            width: 5.4rem;
            height: 1.48rem;
            flex-shrink: 0;

            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            padding-top: 0.05rem;

            display: flex;
            flex-direction: column;
            align-items: center;

            .swiper4-title {
              width: 5rem;
              color: #fff;
              text-align: center;
              -webkit-text-stroke-width: 2px;
              -webkit-text-stroke-color: #e00407;
              font-family: 'SF UI Text';
              font-size: 0.26rem;
              font-style: normal;
              font-weight: 700;
              line-height: 0.32rem; /* 123.077% */
            }

            // PoolSwiper4: 用户头像轮播
            .swiper4-wrap {
              width: 5rem;
              height: 1.2rem;

              .swiper4 {
                direction: ltr;
              }
            }

            .user-avatar-list {
              width: 5rem;
              padding: 0 0.1rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .user-avatar-item {
              width: 0.8rem;
              margin-top: -0.04rem;
            }
          }
        }
      }

      .single-reward {
        position: relative;
        z-index: 2;
      }
    }

    .tip {
      width: 6rem;
      position: relative;
      z-index: 2;
      margin-top: 0.24rem;
      color: #ffd28a;
      text-align: center;
      font-family: Arial;
      font-size: 0.26rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.32rem; /* 123.077% */
    }

    .bottom-wrap {
      margin-top: 1.4rem;
      width: 7.18rem;
      height: 5.12rem;
      background: linear-gradient(
        270deg,
        rgba(172, 0, 43, 0) 0%,
        rgba(118, 4, 6, 0.4) 40%,
        rgba(118, 4, 6, 0.4) 60%,
        rgba(172, 0, 43, 0) 100%
      );

      display: flex;
      flex-direction: column;
      align-items: center;

      .three-title {
        width: 6.5rem;
        height: 0.88rem;
        margin: 0 auto;

        span {
          width: 5.38rem;
          margin: 0 auto;
          color: #f4ffbd;
          text-align: center;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #af2300;
          font-family: 'SF UI Text';
          font-size: 0.3rem;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }

      .tip2 {
        width: 5.42rem;
        margin-top: 0.17rem;
        span {
          color: #ffd28a;
          text-align: center;
          font-family: Arial;
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.32rem; /* 133.333% */
        }
      }

      // PoolSwiper: 奖励轮播
      .swiper-reward-wrap {
        width: 7rem;
        height: 3.2rem;
        margin: 0 auto;
        margin-top: 0.24rem;

        .swiper-reward {
          direction: ltr;

          .reward-item {
            width: fit-content;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;

            .rew-img {
              width: 1.6rem;
              height: 1.56322rem;
              aspect-ratio: 160/156.32;

              img {
                width: 1.14286rem;
                height: 1.17073rem;
                object-fit: contain;
              }
            }

            .coin-wrap {
              width: 1.6rem;
              height: 0.4rem;
              margin-top: 0.08rem;

              .coin-icon {
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.04rem;
              }

              span {
                color: #f4ffbd;
                text-align: center;
                font-family: Arial;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 700;
                line-height: 0.32rem; /* 114.286% */
              }
            }

            .progress-wrap {
              margin-top: 0.08rem;

              .progress {
                width: 1.6rem;
                height: 0.4rem;
                position: relative;

                .progress-inner {
                  width: 1.56rem;
                  height: 0.36rem;
                  border-radius: 0.8rem;
                  overflow: hidden;
                  position: relative;

                  .act {
                    height: 0.36rem;
                    border-radius: 0.8rem;
                    background: linear-gradient(270deg, #bf0609 0%, #fba73a 100%);
                    z-index: 1;
                  }
                }

                .score {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  direction: ltr;

                  span {
                    color: #ffd28a;
                    text-align: center;
                    font-family: Arial;
                    font-size: 0.28rem;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 0.32rem; /* 114.286% */
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .sub-title {
  }

  .tip {
  }

  .bottom-wrap {
    .three-title {
    }

    .tip2 {
    }
  }
}
</style>
