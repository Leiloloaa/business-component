<template>
  <OssImg src="family/d-save" class="save-dialog">
    <div class="title">
      {{ TOOL_TEXT[88] }}
    </div>
    <OssImg src="family/f-save-bg" class="content" id="downloadXXX">
      <OssImg
        :src="`family/f-fire-${taskInfos.curIdx + 1}-1`"
        class="center-img"
        tag="img"
      ></OssImg>
      <FamilyAvatar />
    </OssImg>
    <div class="btn-list fc">
      <OssImg src="family/d-save-btn" class="btn confirm fc" v-animate @click="saveFun(1)">
        <Outline
          :color="1 ? '0.05rem #581604' : '0.05rem #581604'"
          :text="TOOL_TEXT[635]"
          noColor
        />
      </OssImg>
      <Space :val="0.24" />
      <OssImg src="family/d-share-btn" class="btn cancel fc" v-animate @click="saveFun(2)">
        <Outline
          :color="1 ? '0.05rem #581604' : '0.05rem #581604'"
          :text="TOOL_TEXT[636]"
          noColor
        />
      </OssImg>
    </div>
  </OssImg>
</template>

<script lang="ts" setup name="">
import injectTool from '@publicComponents/injectTool'
import html2canvas from 'html2canvas'
import { captureScreenshot, upLoadImg, useSysSave, shareToMoment } from '@saveImage'
import useRequest from '@hooks/useRequest'
import FamilyAvatar from './FamilyAvatar.vue'

const { TOOL_BPFunc, TOOL_countryCode, TOOL_TEXT, TOOL_loading, TOOL_httpClient, TOOL_toast } =
  injectTool()
const activityId = inject('activityId')
const ossUrl = inject('ossUrl')
const taskInfos: any = inject('taskInfos')

const saveFun = async (type) => {
  // type == 1 保存图片 type == 2 分享
  TOOL_loading()
  await toImage(type)
  TOOL_loading(false)
}

const toImage = async (type) => {
  const download: any = document.getElementById(`downloadXXX`)
  console.log('下载:', download)
  const base64 = await domToBase64(download)
  console.log('base64', base64)
  const fid = await upLoadImg(activityId, base64)
  console.info('图片上传成功:', 'https://cdn-test.waka.media/' + fid)
  type == 1 ? await useSysSave(fid) : await toShare(fid)
  TOOL_BPFunc({
    desc: type == 1 ? 'Save Family Rocket_button_click' : 'Share Family Rocket_button_click',
    action: 'click'
  })
  if (type == 1) {
    taskInfos.showSaveDialog = false
    TOOL_toast({ text: TOOL_TEXT[91] })
  }

  //   return captureScreenshot(download, 'jpeg')
  //     .then(async (url) => {
  //       const fid = await upLoadImg(activityId, url)
  //       console.info('fid===', `https://cdn${ENV === 'build' ? '' : '-test'}.waka.media/` + fid)
  //       type == 1 ? useSysSave(fid) : await toShare(fid)

  //     })
  //     .catch((error) => {
  //       console.warn('转换图片失败:', error)
  //     })
  //     .finally(() => {})
}

const domToBase64 = async (element: HTMLElement, quality: number = 0.8): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: window.devicePixelRatio,
      backgroundColor: null,
      logging: false
    })

    // 获取base64字符串并去掉前缀
    const base64Image = canvas
      .toDataURL('image/jpeg', quality)
      .replace(/^data:image\/jpeg;base64,/, '')

    return base64Image
  } catch (error) {
    console.error('截图失败:', error)
    throw error
  }
}

const toShare = async (fid) => {
  // type == 1 直接分享 type == 2 通过接口分享
  const type = 2
  await TOOL_BPFunc({ desc: 'Share to the moments_button_click', action: 'click' })
  if (type == 1) {
    shareToMoment({
      title: TOOL_TEXT[128],
      content: TOOL_TEXT[129],
      url: `https://activity-h5${ENV === 'build' ? '' : '-test'}.yoho.media/act_v_${
        ossUrl.split('/')?.[4]
      }/index.html?lang=${TOOL_countryCode}`,
      image: 'wakam/bfe8aec44eafa4b641212bb7bc4a1fa4',
      imageType: 'png'
    }).catch((res) => {
      TOOL_toast({ text: res })
    })
  } else {
    const url = '/api/activity/commonBusiness/share'
    const data = await useRequest(
      url,
      {
        activityId: 10600,
        imgFids: [fid],
        link: `https://activity-h5${ENV === 'build' ? '' : '-test'}.yoho.media/act_v_${
          ossUrl.split('/')?.[4]
        }/index.html?isData=1&lang=${TOOL_countryCode}`,
        content: `#年中巅峰家族#我的家族火箭升级至Lv.${
          taskInfos.curIdx + 1
        }，我们家族即将遨游太空。”查看详情>>`
      },
      'POST'
    )
    const _key = data['code']
    const messages = {
      401: TOOL_TEXT[608], // coming
      402: TOOL_TEXT[609], // end
      403: TOOL_TEXT[92], // 次数不足
      420: '', // 长度不符合
      504: TOOL_TEXT[92], // 次数已达上线
      default: TOOL_TEXT[627] // 网络异常
    }
    const message = messages[_key] || messages.default
    taskInfos.showSaveDialog = false
    if (_key == 200) {
      // 成功 刷新页面
      TOOL_toast({ text: TOOL_TEXT[94] })
    } else {
      TOOL_toast({ text: message })
    }
  }
}
</script>

<style lang="scss" scoped>
.save-dialog {
  width: 7.18rem;
  height: 9.76rem;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 5.42rem;

    margin-top: 0.96rem;
    color: #ffffb6;
    text-align: center;
    font-family: Arial;
    font-size: 0.26rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.34rem;
    /* 130.769% */
  }

  .content {
    width: 4.94rem;
    height: 6.08rem;

    margin-top: 0.24rem;

    .center-img {
      width: 4.4rem;
      height: 4.4rem;

      display: block;
      margin: 0 auto;
      margin-top: 0.4rem;
    }
  }

  .btn-list {
    .btn {
      width: 2.32rem;
      height: 0.72rem;
    }

    .confirm {
      span {
        color: #fffdd0;
        text-align: center;
        text-shadow: 0px 0px 0.1rem #ff6200;
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.24rem;
        /* 100% */
      }
    }

    .fc {
    }

    .cancel {
      span {
        color: #fffdd0;
        text-align: center;
        text-shadow: 0px 0px 0.1rem #e44d00;
        font-family: Arial;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.24rem;
        /* 100% */
      }
    }
  }

  .fc {
  }
}
</style>
