# Tabbar 组件

> 🚀 高度可配置的 Uni-app 底部导航栏组件

## 📑 目录

- [快速开始](#-快速开始)
- [Tabbar 策略](#-tabbar-策略)
- [使用方式](#-使用方式)
- [配置选项](#-配置选项)
- [图标类型](#-图标类型)
- [高级功能](#-高级功能)
- [最佳实践](#-最佳实践)
- [常见问题](#-常见问题)

## 🚀 快速开始

### 安装

```bash
# 组件已内置在 @jh-app/app 中
import { Tabbar } from '@jh-app/app'
```

### 基础使用

```vue
<template>
  <Tabbar />
</template>

<script setup>
import { Tabbar } from '@jh-app/app'
</script>
```

### 自定义配置

```vue
<template>
  <Tabbar :config="tabbarConfig" />
</template>

<script setup>
import { Tabbar, createTabbarConfig } from '@jh-app/app'

const tabbarConfig = createTabbarConfig({
  items: [
    { text: '首页', pagePath: '/pages/home', iconType: 'unocss', icon: 'i-carbon-home' },
    { text: '消息', pagePath: '/pages/message', iconType: 'unocss', icon: 'i-carbon-chat' },
    { text: '我的', pagePath: '/pages/user', iconType: 'unocss', icon: 'i-carbon-user' },
  ]
})
</script>
```

## 🎯 Tabbar 策略

| 策略 | 模式 | 说明 | 优势 | 劣势 |
|------|------|------|------|------|
| 0 | 无 tabbar | 单页面应用，无底部导航 | 简单快速 | 功能有限 |
| 1 | 原生 tabbar | 系统原生，有缓存 | 性能最佳，渲染最快 | 只支持图片，样式受限 |
| 2 | 自定义 tabbar（有缓存） | 自定义UI，有缓存 | 样式灵活，功能丰富 | 首次点击会闪烁 |
| 3 | 自定义 tabbar（无缓存） | 自定义UI，无缓存 | 样式灵活，功能丰富 | 首次闪烁，无缓存 |

> 💡 **推荐**：新项目建议使用策略 2，平衡了性能和灵活性。

## 🛠️ 使用方式

### 方式一：基础使用

```vue
<template>
  <Tabbar />
</template>
```

### 方式二：配置化使用 ⭐

```vue
<template>
  <Tabbar :config="tabbarConfig" :hooks="tabbarHooks" />
</template>

<script setup>
import { Tabbar, createTabbarConfig, createTabbarHooks } from '@jh-app/app'

const tabbarConfig = createTabbarConfig({
  items: [
    { text: '工作台', pagePath: '/pages/workspace', iconType: 'unocss', icon: 'i-carbon-dashboard' },
    { text: '消息', pagePath: '/pages/message', iconType: 'unocss', icon: 'i-carbon-chat', badge: 'dot' },
    { text: '我的', pagePath: '/pages/user', iconType: 'unocss', icon: 'i-carbon-user' },
  ],
  theme: { activeColor: '#007aff', inactiveColor: '#8e8e93' },
  features: { bulge: false, badge: true, cache: true }
})

const tabbarHooks = createTabbarHooks({
  beforeNavigate: async (index, item) => {
    // 权限检查
    if (item.pagePath === '/pages/admin' && !isAdmin()) {
      uni.showToast({ title: '需要管理员权限' })
      return false
    }
    return true
  }
})
</script>
```

### 方式三：状态管理

```vue
<script setup>
import { tabbarStore, createTabbarStore } from '@jh-app/app'

// 全局状态
const { curIdx, setCurIdx } = tabbarStore

// 自定义状态
const { tabbarList, tabbarStore: customStore } = createTabbarStore(customItems)
</script>
```

### 方式四：完全自定义

```vue
<template>
  <view class="custom-tabbar">
    <view v-for="(item, index) in tabbarList" :key="index" @click="handleClick(index)">
      <text>{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { createTabbarStore } from '@jh-app/app'
const { tabbarList, tabbarStore } = createTabbarStore(customItems)
</script>
```

## 📋 配置选项

### TabbarConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `strategy` | `number` | `2` | Tabbar 策略 (0-3) |
| `items` | `TabBarItem[]` | `[]` | Tabbar 项目列表 |
| `theme` | `ThemeConfig` | `{}` | 主题配置 |
| `features` | `FeatureConfig` | `{}` | 功能配置 |

### ThemeConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `activeColor` | `string` | `#007aff` | 选中颜色 |
| `inactiveColor` | `string` | `#8e8e93` | 未选中颜色 |
| `backgroundColor` | `string` | `#ffffff` | 背景颜色 |

### FeatureConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bulge` | `boolean` | `false` | 是否启用鼓包 |
| `badge` | `boolean` | `true` | 是否显示角标 |
| `cache` | `boolean` | `true` | 是否启用缓存 |

### TabBarItem

| 属性 | 类型 | 说明 |
|------|------|------|
| `text` | `string` | 显示文字 |
| `pagePath` | `string` | 页面路径 |
| `iconType` | `'unocss' \| 'uiLib' \| 'iconfont' \| 'image'` | 图标类型 |
| `icon` | `string` | 图标内容 |
| `badge` | `number \| string \| 'dot'` | 角标内容 |

## 🎨 图标类型

### UnoCSS 图标 ⭐

```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'unocss',
  icon: 'i-carbon-home'
}
```

### UI 库图标

```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'uiLib',
  icon: 'home'  // wot-design-uni 图标名
}
```

### Iconfont 图标

```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'iconfont',
  icon: 'iconfont icon-home'
}
```

### 图片图标

```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'image',
  icon: '/static/tabbar/home.png',
  iconActive: '/static/tabbar/home-active.png'
}
```

## 🔧 高级功能

### 钩子函数

```typescript
const tabbarHooks = createTabbarHooks({
  // 导航前钩子
  beforeNavigate: async (index, item) => {
    // 权限检查、登录验证等
    return true
  },
  
  // 鼓包点击钩子
  onBulgeClick: () => {
    uni.navigateTo({ url: '/pages/scan' })
  },
  
  // 角标计算钩子
  getBadge: (item) => {
    if (item.badge === 'messageCount') {
      return getMessageCount()
    }
    return item.badge
  }
})
```

### 动态角标

```typescript
// 数字角标
{ badge: 5 }

// 小红点
{ badge: 'dot' }

// 动态角标
{ badge: 'messageCount' }  // 从状态获取
```

### 鼓包按钮

```typescript
const config = createTabbarConfig({
  features: { bulge: true },
  items: [
    // 需要偶数个普通项目
    { text: '首页', pagePath: '/pages/home', iconType: 'unocss', icon: 'i-carbon-home' },
    { text: '消息', pagePath: '/pages/message', iconType: 'unocss', icon: 'i-carbon-chat' },
    { text: '发现', pagePath: '/pages/discover', iconType: 'unocss', icon: 'i-carbon-compass' },
    { text: '我的', pagePath: '/pages/user', iconType: 'unocss', icon: 'i-carbon-user' }
  ]
})
```

## 🎯 最佳实践

### 1. 使用配置工厂

```typescript
// ✅ 推荐
const config = createTabbarConfig({ items: [...] })

// ❌ 不推荐
const config = { items: [...] }
```

### 2. 选择合适的图标

- **UnoCSS** - 推荐，体积小，灵活
- **UI库** - 简单，但依赖第三方库
- **图片** - 不推荐，体积大

### 3. 利用钩子函数

```typescript
// ✅ 在钩子中处理逻辑
const hooks = createTabbarHooks({
  beforeNavigate: (index, item) => checkPermission(item)
})

// ❌ 修改组件代码
// 不要直接修改 index.vue
```

### 4. 配置分离

```typescript
// tabbar.config.ts
export const tabbarConfig = createTabbarConfig({...})

// 页面中使用
import { tabbarConfig } from './tabbar.config'
```

## 📁 文件结构

```
tabbar/
├── config.ts      # 配置管理
├── store.ts        # 状态管理
├── hooks.ts        # 钩子函数
├── index.vue       # 主组件
├── types.ts        # 类型定义
└── index.ts        # 统一导出
```

### 使用原生 tabbar

如果使用策略 1（原生 tabbar），只需要关注 `config.ts`，其他文件不需要修改。

## 🐛 常见问题

### Q: 如何隐藏某个 tabbar 项？
A: 在 `items` 配置中排除该项，或使用 `beforeNavigate` 钩子返回 `false`。

### Q: 如何实现动态角标？
A: 使用 `getBadge` 钩子，从 API 或状态管理获取实时数据。

### Q: 如何自定义鼓包按钮？
A: 设置 `features.bulge: true`，并在 `onBulgeClick` 钩子中实现逻辑。

### Q: 如何适配不同平台？
A: 组件已内置平台适配，使用条件编译处理差异。

### Q: 如何在运行时更新配置？
A: 使用 `createTabbarStore` 创建新状态，或直接修改 store 数据。

## 🔗 相关链接

- [Uni-app 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 官方文档](https://vuejs.org/)
- [UnoCSS 图标库](https://icones.js.org/)
- [wot-design-uni](https://wot-design-uni.netlify.app/)
