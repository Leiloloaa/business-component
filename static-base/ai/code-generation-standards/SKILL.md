---
name: code-generation-standards
description: 约束 Vue 3、TypeScript、JavaScript、CSS/SCSS 代码的生成、补充、修改和重构。任何需要写代码的任务都必须先执行，确保代码简洁、接口数据直接合入、父子组件使用 provide/inject、中东定位镜像、日期格式、数量千分位（TOOL_NUM）、等级最高级判断及双向文案占位符适配。
---

# 代码生成规范

## 强制触发

任何创建、生成、补充、修改或重构 Vue、TypeScript、JavaScript、CSS、SCSS 代码的任务，都必须先读取并执行本 Skill。

回复中必须输出：

```text
🎯 已触发 Skill：code-generation-standards
```

## 用户硬性要求

1. 生成的代码必须简洁，减少不必要的字段初始化和层级嵌套
2. 对于接口返回的字段，直接 Object.assign pageInfo reactive 对象即可
3. 父子组件传值，使用 provide 和 inject 即可；避免使用 store，影响代码的整洁度
4. 生成的样式，父元素使用相对定位，子元素使用绝对定位时；需要同时加载 EG 类，left 和 right 调换
5. 中东地区日期需要展示为 DD/MM/YYYY 或 DD/MM
6. css 在代码不超过 200 行时不用外置
7. 使用 replace 替换 `%s` 时，必须同时支持 `s%`，并抽离成单独函数
8. 领取相关接口必须使用统一的业务码处理格式（见第八节）
9. 涉及等级展示的 UI，必须判断最高等级是否已完成（见第九节）
10. 向用户展示的数量必须使用 `TOOL_NUM` 包裹（见第十节）

## 一、保持代码简洁

- 不为接口字段逐项创建默认对象、默认数组或格式化映射。
- `pageInfo` 只初始化首屏渲染前确实需要的本地状态；接口字段使用可选链和空值兜底。
- 能由一个 `computed` 返回的关联数据，不拆成多个仅转发字段的 `computed`。
- 不创建只调用一次、且不提升可读性的包装函数。
- 不增加无业务价值的 DOM 层级。
- 删除未使用的字段、变量、import、空样式块和调试日志。

推荐：

```ts
interface IPageInfo extends Partial<IResponseData> {
  showPanel: boolean
}

const pageInfo = reactive<IPageInfo>({
  showPanel: false
})

const stageView = computed(() => {
  const stage = pageInfo.currentStage === 2 ? 2 : 1
  const info = stage === 1 ? pageInfo.stage1 : pageInfo.stage2
  return {
    stage,
    info,
    hasDot: Boolean(pageInfo.challengeRedDot?.[`stage${stage}`])
  }
})
```

避免：

```ts
const defaultStage1 = () => ({ progress: 0, levels: [], dates: [] })
const defaultStage2 = () => ({ gap: 0, levels: [], dates: [] })
const currentStage = computed(() => ...)
const otherStage = computed(() => ...)
const currentStageDateText = computed(() => ...)
const otherStageDateText = computed(() => ...)
```

## 二、接口数据直接合入

接口成功后直接合入响应对象：

```ts
const { data, errorCode } = res?.data || {}
if (errorCode != 0) throw res
if (!data || typeof data === 'number') return
Object.assign(pageInfo, data)
```

禁止为了复制同名字段增加 `formatInfoData`、逐字段赋值或完整默认对象。

仅以下情况允许转换：

- 接口字段与视图字段语义不同。
- 必须排序、过滤、聚合或格式转换。
- 需要保留不会由接口返回的本地 UI 状态。

转换优先使用 `computed`，不要修改原始接口数据。

## 三、父子组件通信

- 祖先向后代共享数据或方法时，优先 `provide` / `inject`。
- 不为单个页面组件树创建 Pinia store。
- `provide` 的 key 使用语义化常量或明确字符串。
- `inject` 必须提供类型，并在使用前判空。
- 只有跨路由、无共同祖先或确需全局持久化的状态，才允许使用 store；使用前先说明必要性。

```ts
// 父组件
provide('challengeInfo', pageInfo)

// 子组件
const challengeInfo = inject<IPageInfo>('challengeInfo')
```

## 四、EG 定位镜像

当父元素为相对定位、子元素为绝对定位且使用 `left` 或 `right` 时：

1. 根容器必须加载 `EG` 类。
2. 默认样式写普通方向。
3. `.EG` 下交换对应的 `left` / `right`，并清空原方向。
4. 纯居中定位 `left: 50% + transform` 不需要镜像。

```vue
<div class="card" :class="{ EG: TOOL_countryCode === 'EG' }">
  <i class="dot"></i>
</div>
```

```scss
.card {
  position: relative !important;

  .dot {
    position: absolute !important;
    right: 0.08rem;
  }

  &.EG {
    .dot {
      right: auto;
      left: 0.08rem;
    }
  }
}
```

## 五、样式文件组织

- CSS/SCSS 代码不超过 200 行时，保留在当前 Vue 文件的 `<style scoped>` 中，不得外置。
- 超过 200 行时，才根据复用性和可维护性判断是否拆分样式文件。
- 不得仅为了缩短 Vue 文件行数而外置短样式。

## 六、中东日期格式

- 中东地区按项目约定使用 `TOOL_countryCode === 'EG'` 判断。
- 中东地区单个日期显示为 `DD/MM/YYYY`，省略年份时显示为 `DD/MM`。
- 非中东地区保持项目原有的 `MM/DD/YYYY` 或 `MM/DD` 顺序。
- 日期区间始终保持 `开始-结束`，不得在 EG 地区交换开始日期和结束日期。
- 日期区间使用数组第一个和最后一个日期。
- 当前阶段切换后必须重新基于对应阶段的 `dates` 计算。

```ts
const formatDate = (date: string, showYear = false) => {
  const year = date.slice(0, 4)
  const month = date.slice(4, 6)
  const day = date.slice(6, 8)
  const parts = TOOL_countryCode === 'EG' ? [day, month] : [month, day]
  if (showYear) parts.push(year)
  return parts.join('/')
}

const formatDateRange = (dates: string[] = [], showYear = false) => {
  if (!dates.length) return ''
  const start = formatDate(dates[0], showYear)
  const end = formatDate(dates[dates.length - 1], showYear)
  return `${start}-${end}`
}
```

## 七、文案占位符替换

- 文案中的 `%s` 在中东语言环境可能显示为 `s%`，两种写法必须同时支持。
- 禁止在多个业务字段上重复调用 `.replace('%s', value)`。
- 抽离统一函数，并使用全局、大小写不敏感的正则替换全部占位符。

```ts
const replaceText = (text: string | undefined, value: string | number) =>
  (text || '').replace(/%s|s%/gi, String(value))
```

## 八、领取接口状态码处理

凡 `/claim` 领取接口，或返回体含 `code` 业务码的领取场景，禁止抽离 `handleClaimResponse` 等包装函数，必须在接口回调处按以下格式内联书写：

```ts
const { data, errorCode } = res?.data || {}
if (errorCode != 0) throw res
const claimData = typeof data === 'number' ? { code: data } : data
if (!claimData) return
const _key = claimData.code
const messages = {
  401: TOOL_TEXT[608],
  402: TOOL_TEXT[609],
  403: TOOL_TEXT[70],
  420: '',
  504: TOOL_TEXT[70],
  default: TOOL_TEXT[627]
}
const message = messages[_key] || messages.default
if (_key == 200) {
  // 成功：弹奖励（如有）+ 刷新页面数据
  await getInfo()
} else {
  TOOL_toast({ text: message })
}
```

规则：

- `messages` 映射表必须在调用处内联声明，不得提到组件外部复用。
- `_key == 200` 时刷新当前页数据。
- 其余状态码走 `TOOL_toast`。
- **`messages` 里的状态码 → `TOOL_TEXT` 索引映射，不得跨活动直接照抄**：不同活动的文案配置表（`TOOL_TEXT` 数组）索引不同，同一业务码在不同活动下对应的文案序号会变化。每次在新的活动/页面生成该片段时，必须先按 `apifox-api-lookup` 或活动文案配置表重新确认每个状态码实际要展示的文案及其正确索引，再填入 `messages`，不得直接复用示例中的 `608/609/70/627` 等具体数值。

## 九、等级最高级判断

凡展示等级相关 UI（如左右 `Lv.` 标签、等级区间、距下一等级提示等），必须判断当前阶段最高等级是否已完成；若已完成，则隐藏已无业务意义的等级展示。

### 判定规则

- 取当前阶段 `levels` 数组**最后一个元素**的 `finished` 字段作为最高级完成态。
- 多阶段场景（如 `stage1` / `stage2`）须基于当前激活阶段的 `levels` 计算，阶段切换后自动跟随。
- `levels` 为空时不视为已完成，避免越界。

### 推荐写法

```ts
const isLastLevelFinished = computed(() => {
  const levels = stageData.value?.levels || []
  return levels.length > 0 && Boolean(levels[levels.length - 1].finished)
})
```

```vue
<Outline
  v-if="!isLastLevelFinished"
  class="level-text level-left"
  :text="`Lv.${challengeView.leftLevel}`"
/>
<Outline
  v-if="!isLastLevelFinished"
  class="level-text level-right"
  :text="`Lv.${challengeView.rightLevel}`"
/>
```

### 注意事项

- 最高级完成后，`currentLevelInfo` 通常会回退到最后一档，此时左右等级标签语义重复，应整体隐藏而非仅隐藏一侧。
- 「距下一等级还差 xxx」等提示文案，最高级完成后同样应隐藏或替换为完成态文案，按产品需求处理。
- 进度条、奖励预览等与等级强关联的区域，需结合产品确认是否同步调整；本规则至少覆盖显式等级标识（`Lv.` 等）。

## 十、数量展示（TOOL_NUM）

凡向用户**可见**的数量（积分、金币、进度、分数、排名、任务目标、Gap 差值等），必须使用 `TOOL_NUM` 包裹，才能按地区正确加上千分位分隔符。

### 规则

- 从 `injectTool()` 解构 `TOOL_NUM`，在模板或 `computed` 展示层调用。
- 仅用于内部计算（进度条 `width` 百分比、排序、比较大小等）的原始数值，**不得**提前 `TOOL_NUM`；展示时再格式化。
- 文案占位符 `%s` / `s%` 替换为数字时，替换值须为 `TOOL_NUM(value)`（可写在 `replaceText` 调用处或专用 computed 内）。
- 禁止直接 `{{ score }}`、`String(required)`、`toLocaleString` 自实现等绕过 `TOOL_NUM` 的写法。

### 推荐写法

```ts
const { TOOL_TEXT, TOOL_NUM } = injectTool()

const progressText = computed(() => TOOL_NUM(pageInfo.stage1?.progress ?? 0))
const gapValue = computed(() => TOOL_NUM(Math.max(0, target - progress)))

const replaceText = (text: string | undefined, value: string | number) =>
  (text || '').replace(/%s|s%/gi, String(value))

// 文案占位符为数量时
replaceText(TOOL_TEXT[76], TOOL_NUM(gap))
```

```vue
<strong>{{ TOOL_NUM(pageInfo.stage2?.stage1Score) }}</strong>
<span>{{ TOOL_NUM(fragment?.progress ?? 0) }}/{{ TOOL_NUM(fragment?.required ?? 0) }}</span>
```

### 避免

```vue
<!-- 错误：无千分位 -->
<span>{{ info.score }}</span>
<span>{{ String(fragment?.required ?? '') }}</span>
```

## 执行流程

1. 修改前读取目标文件及直接相关组件、类型和工具。
2. 先删除可避免的默认字段、重复 computed、格式化中间层和 DOM 嵌套。
3. 接口数据优先直接 `Object.assign(pageInfo, data)`。
4. 检查父子通信是否可用 `provide/inject`，避免新增 store。
5. 检查所有相对定位父元素与绝对定位子元素，补齐 EG 镜像。
6. CSS/SCSS 不超过 200 行时保留在当前 Vue 文件。
7. 检查所有日期，确保 EG 使用 `DD/MM/YYYY` 或 `DD/MM`。
8. 检查文案 `%s` 替换是否同时支持 `s%`，并使用统一函数。
9. 领取接口是否按第八节内联 `_key` + `messages` 格式处理，且 `messages` 索引已按当前活动文案表重新核对。
10. 等级相关 UI 是否已按第九节判断最高级完成态并隐藏无意义展示。
11. 所有面向用户的数量展示是否已用 `TOOL_NUM` 包裹，计算逻辑仍用原始数值。
12. 执行 Linter，修复本次新增问题。

## 完成前自检

- [ ] 是否存在可删除的默认接口字段初始化？
- [ ] 是否存在只做同名字段复制的格式化函数？
- [ ] 是否直接使用 `Object.assign(pageInfo, data)`？
- [ ] 父子组件是否避免了不必要的 store？
- [ ] `left/right` 绝对定位是否补齐 EG 镜像？
- [ ] CSS/SCSS 不超过 200 行时是否保留在当前 Vue 文件？
- [ ] EG 日期是否使用 `DD/MM/YYYY` 或 `DD/MM`，并保持区间起止顺序？
- [ ] `%s` 与 `s%` 是否通过统一函数完成替换？
- [ ] 领取接口是否内联 `messages` 映射，未抽离包装函数？
- [ ] `messages` 状态码文案索引是否按当前活动重新核对，未直接照抄其它活动的索引？
- [ ] 等级相关 UI 是否已判断最高级完成态（`levels` 末位 `finished`）并隐藏无意义展示？
- [ ] 面向用户的数量展示是否均已 `TOOL_NUM` 包裹，计算逻辑未误格式化？
- [ ] 是否清理未使用代码并通过 Linter？
