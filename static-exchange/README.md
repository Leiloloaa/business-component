# Exchange 兑换模块

## 功能描述
Exchange 模块提供兑换功能，包括兑换商品展示、排行榜、状态管理等。

## 文件结构
```
Exchange/
├── Exchange.vue              # 兑换主页面
├── ExchangeRank.vue          # 兑换排行榜
├── ExchangeCardBJ.vue        # 北京风格兑换卡片
├── ExchangeCardSZ.vue        # 深圳风格兑换卡片
└── ExchangeDialogStatus.vue  # 兑换状态弹窗
```

## 组件说明

### Exchange.vue
- **功能**: 兑换主页面
- **特性**: 
  - 兑换商品展示
  - 兑换操作
  - 库存管理
  - 状态跟踪
- **Props**:
  - `exchangeData`: 兑换数据
  - `userInfo`: 用户信息
- **Events**:
  - `exchange`: 兑换事件

### ExchangeRank.vue
- **功能**: 兑换排行榜
- **特性**: 
  - 排行榜展示
  - 用户排名
  - 兑换统计
  - 数据更新
- **Props**:
  - `rankData`: 排行榜数据
  - `userRank`: 用户排名

### ExchangeCardBJ.vue
- **功能**: 北京风格兑换卡片
- **特性**: 
  - 北京地区特定样式
  - 商品信息展示
  - 兑换按钮
  - 库存显示
- **Props**:
  - `item`: 商品信息
  - `userPoints`: 用户积分

### ExchangeCardSZ.vue
- **功能**: 深圳风格兑换卡片
- **特性**: 
  - 深圳地区特定样式
  - 商品信息展示
  - 兑换按钮
  - 库存显示
- **Props**:
  - `item`: 商品信息
  - `userPoints`: 用户积分

### ExchangeDialogStatus.vue
- **功能**: 兑换状态弹窗
- **特性**: 
  - 兑换结果展示
  - 状态信息
  - 操作按钮
  - 错误处理
- **Props**:
  - `visible`: 显示状态
  - `status`: 兑换状态
  - `message`: 状态信息

## 使用示例
```vue
<template>
  <!-- 兑换主页面 -->
  <Exchange 
    :exchangeData="exchangeItems" 
    :userInfo="userInfo"
    @exchange="handleExchange"
  />
  
  <!-- 兑换排行榜 -->
  <ExchangeRank 
    :rankData="rankList" 
    :userRank="userRanking"
  />
  
  <!-- 兑换状态弹窗 -->
  <ExchangeDialogStatus 
    v-model="showStatus"
    :status="exchangeStatus"
    :message="statusMessage"
  />
</template>

<script setup>
import Exchange from './Exchange.vue'
import ExchangeRank from './ExchangeRank.vue'
import ExchangeDialogStatus from './ExchangeDialogStatus.vue'
</script>
```

## API 接口

### 兑换相关接口
- **获取兑换列表**: `/api/activity/exchange/list`
- **执行兑换**: `/api/activity/exchange/submit`
- **兑换记录**: `/api/activity/exchange/record`

### 排行榜接口
- **获取排行榜**: `/api/activity/exchange/rank`
- **用户排名**: `/api/activity/exchange/userRank`

## 兑换状态
- `success`: 兑换成功
- `failed`: 兑换失败
- `insufficient`: 积分不足
- `outOfStock`: 库存不足
- `processing`: 处理中

## 商品类型
- **虚拟商品**: 游戏道具、虚拟货币等
- **实物商品**: 实物奖品、周边等
- **服务商品**: 会员服务、特权等
- **限量商品**: 限量版商品

## 功能特性
- 支持多种商品类型
- 实时库存管理
- 积分兑换系统
- 排行榜功能
- 兑换记录查询
- 状态实时更新

## 样式说明
- 商品卡片采用现代化设计
- 支持多种地区样式
- 库存状态清晰显示
- 响应式布局适配移动端
