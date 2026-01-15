# AI -- to do list

## 任务执行配置

| 任务  | 是否执行 | 描述                                 |
| ----- | -------- | ------------------------------------ |
| 任务1 | 0        | 修改文件中的引用路径                 |
| 任务2 | 0        | 增加并修改 RankTemp.vue 中的引用路径 |
| 任务3 | 0        | 引入全局文件 customRegister.ts       |
| 任务4 | 0        | 创建榜单路由                         |
| 任务5 | 0        | 创建功能模块                         |
| 任务6 | 0        | 检查页面逻辑异常和报错               |

> 说明：`1` 表示执行，`0` 表示不执行

---

## 组件列表

- RouterTab 路由 tab
- GameList 游戏列表
- Progress 进度条
- TextDanmu 文字弹幕
- PoolSwiper 奖池预览

---

## 任务详情

### 任务1: 修改文件中的引用路径

**相关文件**: 
1. `useRankPage.ts` 文件中的 `useAppStore` 引用路径
   ```ts
   import { useAppStore } from '../../../store'
   ```
2. 新增的 `RankXXXPage` 目录下的 `RankXXXPage.vue` 中的四个路径
   ```ts
   import { useRankPage } from '../Static/RankComp/useRankPage'
   import RankTemp from '../Static/RankComp/RankTemp.vue'
   import DateTab from '../Static/RankComp/DateTab.vue'
   import DateAvatar from '../Static/RankComp/DateAvatar.vue'
   ```

---

### 任务2: 增加并修改 RankTemp.vue 中的引用路径

**相关文件**: 
1. 找到 `RankTemp.vue` 文件，修正以下引用：
   ```ts
   // 榜单
   import TopThree from '../RankAnchorPage/RankCard/TopThree.vue'
   import Card from '../RankAnchorPage/RankCard/Card.vue'
   import UserInfo from '../RankAnchorPage/RankCard/UserInfo.vue'
   ```
2. 同时引入新增的 `RankXXXPage` 目录下带 `Card` 目录中的 `TopThree`、`Card`、`UserInfo`
3. 修改 `componentMap` 计算属性，根据榜单类型引入对应组件：
   ```ts
   const componentMap = computed(() => {
     const map = {
       // 根据榜单类型引入对应的 card、userInfo、topThree
       // xx: {
       //   card: XXCard,
       //   userInfo: XXUserInfo,
       //   topThree: XXTopThree
       // },
       default: {
         card: Card,
         userInfo: UserInfo,
         topThree: TopThree
       }
     }
     return map[props.rankType] || map.default
   })
   ```

> 榜单类型在 `RankXXXPage.vue` 的 `useRankPage` 方法中由 `rankType` 字段定义

---

### 任务3: 引入全局文件

**相关文件**: `customRegister.ts`

**任务描述**: 将 `customRegister.ts` 在 `main.ts` 中全局引入

**示例**:
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
import '@publicComponents/index.scss'
import './scss/index.scss'
import { config } from './config'
import { createPinia } from 'pinia'

import pluginToWebp from 'plugin-to-webp'
import components from './common/all.components'
import customRegister from './xxx/customRegister'

iosAddViewportFit()

const app = createApp(App)
const rootDom = document.createElement('div')
document.body.appendChild(rootDom)
const pretreatment = new Pretreatment(app, [
  'EG', 'TR', 'IN', 'PK', 'BD', 'MY', 'FR', 'ID', 'VN', 'TW', 'IT', 'TH'
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
    .use(Lazyload, { lazyComponent: true })
    .use(components)
    .use(customRegister)
    .use(pluginToWebp, { excludesName: ['live'] })
    .use(developTool, { activityId: config.activityId, countryCode: LANG })
    .mount(rootDom)
})
```

---

### 任务4: 创建榜单路由

**相关文件**: 获取目录名带 `xxxPage` 的新增文件

**任务描述**: 找到对应的 `xxxPage.vue` 文件，根据目录层级结构在 `router/index.ts` 生成对应路由

**具体要求**: 路由名称和路径保持一致

---

### 任务5: 创建功能模块

**任务描述**: 创建一个功能模块 `.vue` 文件

**模板**:
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

**注意事项**:
- 创建时将模板中的 `xxx` 改为功能名称
- 引用组件参考文档开头的组件列表
- 每个 `.vue` 组件开头都有使用方法注释，有多种使用方法时默认使用第一种
- 引用到功能模块后，组件 HTML 片段需要注释，但相关变量需要生成

**功能描述**:
功能一：xxx

---

### 任务6: 检查页面逻辑异常和报错

**任务描述**: 检查指定页面的逻辑是否有异常或报错

**检查范围**:
- 变量未定义或未引入
- 组件未引入或引用路径错误
- 类型错误
- 生命周期问题
- 响应式数据使用问题
- 异步逻辑问题
- 其他潜在的运行时错误

**输出格式**:
| 文件    | 问题描述 | 解决方案 |
| ------- | -------- | -------- |
| xxx.vue | 问题内容 | 修复建议 |

**待检查文件**: （在消息框中指定）
