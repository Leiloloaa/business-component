# AI -- to do list

## 组件列表

- RouterTab 路由 tab
- GameList 游戏列表
- Progress 进度条
- TextDanmu 文字弹幕
- PoolSwiper 奖池预览

## 任务列表

每个任务中都有 `是否执行此任务`，`[1]` 是执行，`[0]` 不执行；新增的文件都是在当前的路径下；

### 任务1: [修改下列文件中的引用路径，使其符合当前文件目录的结构]
**是否执行此任务**: [1]
**优先级**: [高]
**相关文件**: 
1. useRankPage.ts 文件中的，useAppStore 的引用路径
   ```ts
   import { useAppStore } from '../../../store'
   ```
2. 新增的 RankXXXPage 目录下的 RankXXXPage.vue 中的，这四个路径
   1. import { useRankPage } from '../Static/RankComp/useRankPage'
   2. import RankTemp from '../Static/RankComp/RankTemp.vue'
   3. import DateTab from '../Static/RankComp/DateTab.vue'
   4. import DateAvatar from '../Static/RankComp/DateAvatar.vue'

### 任务2: [引入全局文件]
**是否执行此任务**: [1]
**优先级**: [高]
**相关文件**: 
customRegister.ts，将 customRegister.ts 文件，在 main.ts 文件中全局引入

例如
```ts
import { createApp } from 'vue'
import App from './App.vue'
import developTool from '@publicComponents/developTool_TS/index'
import { Pretreatment } from '@publicJS/activity_pretreatment/index'
import animate from '@publicComponents/Vue3-Animate/index'
import { iosAddViewportFit } from '@publicComponents/shared'
import router from './router/index'
import { List, Sticky, BackTop, CountDown, Lazyload, Toast, NoticeBar } from 'vant'
import 'vant/lib/index.css'
import '@publicComponents/index.scss' // 全局静态样式
import './scss/index.scss'
import { config } from './config'
import { createPinia } from 'pinia'

import pluginToWebp from 'plugin-to-webp'
import components from './common/all.components'
import customRegister from './xxx/customRegister'

// ios终端 添加 viewport-fit
iosAddViewportFit()

// createApp
const app = createApp(App)
const rootDom = document.createElement('div')
document.body.appendChild(rootDom)
const pretreatment = new Pretreatment(app, [
  'EG',
  'TR',
  'IN',
  'PK',
  'BD',
  'MY',
  'FR',
  'ID',
  'VN',
  'TW',
  'IT',
  'TH'
])
pretreatment.init(false, router).then(({ LANG }) => {
  app
    .use(animate)
    .use(router)
    .use(createPinia())
    .use(Toast)
    .use(List)
    .use(Sticky)
    .use(BackTop)
    .use(CountDown)
    .use(NoticeBar)
    .use(Lazyload, {
      lazyComponent: true
    })
    .use(components) // 固定组件与常用组件
    .use(customRegister)
    .use(pluginToWebp, {
      excludesName: ['live'] // 不转换的图片名称
    })
    .use(developTool, { activityId: config.activityId, countryCode: LANG })
    .mount(rootDom)
})

```

### 任务3: [创建榜单路由]
**是否执行此任务**: [0]
**优先级**: [高]
**相关文件**: 
获取当前项目内新增的文件，目录名带 `xxxPage`

**任务描述**:
找到对应的 `xxxPage.vue` 文件，再根据所有目录的层级结构，在 `router/index.ts` 生成对应的路由

**具体要求**:
- 无

### 任务4: [创建功能模块]
**是否执行此任务**: [0]
**相关文件**: 
一个功能模块，创建一个 `.vue`，模板如下，下方的模板创建时，需要将模板的 `xxx` 改为功能的名称；创建功能过程中引用的组件看此文档开头的组件列表，每一个 `.vue` 组件的开头都有使用方法注释，有多种使用方法，默认使用第一种；另外，引用到功能模块后，这些组件 html 片段需要注释，但是相关的变量需要生成。
```vue
<template>
  <div class="xxx-wrap">
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'

const { TOOL_TEXT, TOOL_BPFunc, TOOL_httpClient, TOOL_loading, TOOL_countryCode, TOOL_NUM } = injectTool()
TOOL_BPFunc({ desc: 'xxx', action: 'click' })
</script>

<style lang="scss" scoped>
.xxx-wrap {
}
</style>
```

**任务描述**:
功能一：
xxx
