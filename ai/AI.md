# AI -- to do list

## 任务列表

每个任务中都有 `是否执行此任务`，`[1]` 是执行，`[0]` 不执行；新增的文件都是在当前的路径下；

### 任务1: [创建榜单路由]
**是否执行此任务**: [0]
**优先级**: [高]
**相关文件**: 
获取当前项目内新增的文件，目录名带 `xxxPage`

**任务描述**:
找到对应的 `xxxPage.vue` 文件，再根据所有目录的层级结构，在 `router/index.ts` 生成对应的路由

**具体要求**:
- 无

### 任务2: [创建功能模块]
**是否执行此任务**: [1]
**相关文件**: 
一个功能模块，创建一个 `.vue`，模板如下，下方的模板创建时，需要将模板的 `xxx` 改为功能的名称
```vue
<template>
  <div class="xxx-wrap">
  </div>
</template>

<script lang="ts" setup>
import injectTool from '@publicComponents/injectTool'

const { TOOL_TEXT, TOOL_BPFunc, TOOL_httpClient, TOOL_loading, TOOL_countryCode } = injectTool()
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
