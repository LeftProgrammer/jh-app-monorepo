# JH App Tabbar 使用指南

## 📖 概述

JH App Tabbar 组件现在支持配置化使用，外部项目可以轻松自定义配置，同时保持向后兼容。

## 🚀 使用方式

### 方式一：传统使用（向后兼容）

```vue
<template>
  <Tabbar />
</template>

<script setup>
import { Tabbar } from '@jh-app/app'
</script>
```

### 方式二：配置化使用（推荐）

```vue
<template>
  <Tabbar :config="tabbarConfig" :hooks="tabbarHooks" />
</template>

<script setup>
import { Tabbar, createTabbarConfig, useTabbarHooks } from '@jh-app/app'

// 自定义配置
const tabbarConfig = createTabbarConfig({
  items: [
    {
      text: '工作台',
      pagePath: '/pages/workspace',
      iconType: 'unocss',
      icon: 'i-carbon-dashboard',
    },
    {
      text: '消息',
      pagePath: '/pages/message',
      iconType: 'unocss',
      icon: 'i-carbon-chat',
      badge: 'msgCount',
    },
    {
      text: '我的',
      pagePath: '/pages/user',
      iconType: 'unocss',
      icon: 'i-carbon-user',
    },
  ],
  theme: {
    activeColor: '#ff6b35',
    inactiveColor: '#999',
    backgroundColor: '#f8f9fa',
  },
  features: {
    bulge: false,
    badge: true,
    cache: true,
  },
})

// 自定义钩子
const tabbarHooks = useTabbarHooks({
  beforeNavigate: async (index, item) => {
    // 自定义权限检查
    if (item.pagePath === '/pages/admin' && !isAdmin()) {
      uni.showToast({ title: '需要管理员权限' })
      return false
    }
    return true
  },
  onBulgeClick: () => {
    // 自定义鼓包逻辑
    uni.navigateTo({ url: '/pages/scan' })
  },
  getBadge: (item) => {
    // 自定义角标逻辑
    if (item.badge === 'messageCount') {
      return getUnreadMessageCount()
    }
    return item.badge
  },
})
</script>
```

### 方式三：基于现有配置扩展

```vue
<script setup>
import { 
  Tabbar, 
  createTabbarConfig, 
  useTabbarHooks,
  tabbarList,              // 静态配置列表
  tabbarListStore           // 响应式状态列表
} from '@jh-app/app'

// 基于现有配置扩展
const tabbarConfig = createTabbarConfig({
  items: [
    ...tabbarList,  // 使用静态配置作为基础
    { text: '新增', pagePath: '/pages/new', iconType: 'unocss', icon: 'i-carbon-add' }
  ]
})

// 或者基于响应式状态
const extendedItems = [...tabbarListStore]
</script>
```

### 方式四：高级状态管理

```vue
<script setup>
import { 
  tabbarStore,              // 全局状态实例
  createTabbarStore,
  useTabbarHooks
} from '@jh-app/app'

// 直接操作全局状态
const { curIdx, setCurIdx, setTabbarItemBadge } = tabbarStore

// 创建自定义状态
const { tabbarList, tabbarStore: customStore } = createTabbarStore(customItems, true)

// 使用自定义状态
const handleTabClick = (index, item) => {
  customStore.setCurIdx(index)
  uni.switchTab({ url: item.pagePath })
}

// 设置角标
customStore.setTabbarItemBadge(1, 5)
</script>
```

### 方式五：完全自定义 Tabbar

```vue
<template>
  <view class="custom-tabbar">
    <view 
      v-for="(item, index) in tabbarList" 
      :key="index"
      @click="handleTabClick(index, item)"
      :class="{ active: tabbarStore.curIdx === index }"
    >
      <text>{{ item.text }}</text>
      <view v-if="item.badge" class="badge">{{ item.badge }}</view>
    </view>
  </view>
</template>

<script setup>
import { createTabbarStore } from '@jh-app/app'

const customItems = [
  { text: '首页', pagePath: '/pages/home', iconType: 'unocss', icon: 'i-carbon-home' },
  { text: '消息', pagePath: '/pages/message', iconType: 'unocss', icon: 'i-carbon-chat' },
  { text: '我的', pagePath: '/pages/user', iconType: 'unocss', icon: 'i-carbon-user' },
]

const { tabbarList, tabbarStore } = createTabbarStore(customItems, true)

const handleTabClick = (index, item) => {
  tabbarStore.setCurIdx(index)
  uni.switchTab({ url: item.pagePath })
}

// 监听状态变化
watch(() => tabbarStore.curIdx, (newIdx) => {
  console.log('当前选中:', newIdx)
})
</script>
```

### 方式五：完整 API 访问

```vue
<script setup>
// 访问完整的配置 API
import { TabbarConfig } from '@jh-app/app'

// 访问完整的状态管理 API
import { TabbarStore } from '@jh-app/app'

// 访问完整的钩子 API
import { TabbarHooksModule } from '@jh-app/app'

// 使用高级功能
const strategy = TabbarConfig.selectedTabbarStrategy
const { isPageTabbar } = TabbarStore
const { defaultTabbarHooks } = TabbarHooksModule
</script>
```

## 📋 配置选项

### TabbarPackageConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| strategy | number | 2 | Tabbar 策略 |
| items | CustomTabBarItem[] | defaultTabbarItems | Tabbar 项目 |
| theme | ThemeConfig | defaultTabbarTheme | 主题配置 |
| features | FeatureConfig | defaultTabbarFeatures | 功能配置 |

### TabbarHooks

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| beforeNavigate | (index, item) => boolean\|Promise<boolean> | 默认权限检查 | 导航前钩子 |
| onBulgeClick | () => void | 默认提示 | 鼓包点击钩子 |
| getBadge | (item) => number\|'dot'\|undefined | 默认全局状态 | 角标计算钩子 |
| getCustomStyles | (index, item, isActive) => object | {} | 自定义样式钩子 |

### CustomTabBarItem

| 属性 | 类型 | 说明 |
|------|------|------|
| text | string | 显示文字 |
| pagePath | string | 页面路径 |
| iconType | 'uiLib'\|'unocss'\|'iconfont'\|'image' | 图标类型 |
| icon | string | 图标内容 |
| iconActive | string | 高亮图标（仅 image） |
| badge | number\|string\|'dot' | 角标内容 |
| isBulge | boolean | 是否为鼓包按钮 |

## 🎨 图标类型示例

### UnoCSS 图标（推荐）
```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'unocss',
  icon: 'i-carbon-home',
}
```

### UI 库图标
```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'uiLib',
  icon: 'home', // wot-design-uni 图标名
}
```

### 图片图标
```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'image',
  icon: '/static/tabbar/home.png',
  iconActive: '/static/tabbar/home-active.png',
}
```

### Iconfont 图标
```typescript
{
  text: '首页',
  pagePath: '/pages/home',
  iconType: 'iconfont',
  icon: 'iconfont icon-home',
}
```

## 🎯 功能示例

### 带角标的配置
```typescript
{
  text: '消息',
  pagePath: '/pages/message',
  iconType: 'unocss',
  icon: 'i-carbon-chat',
  badge: 'dot',  // 小红点
}

// 或者数字角标
{
  text: '任务',
  pagePath: '/pages/task',
  iconType: 'unocss',
  icon: 'i-carbon-document',
  badge: 5,  // 数字
}

// 或者动态角标
{
  text: '通知',
  pagePath: '/pages/notify',
  iconType: 'unocss',
  icon: 'i-carbon-bell',
  badge: 'notifyCount',  // 从全局状态获取
}
```

### 鼓包按钮配置
```typescript
const config = createTabbarConfig({
  features: {
    bulge: true,  // 启用鼓包
  },
  items: [
    // 需要偶数个普通项目
    { text: '首页', pagePath: '/pages/home', iconType: 'unocss', icon: 'i-carbon-home' },
    { text: '消息', pagePath: '/pages/message', iconType: 'unocss', icon: 'i-carbon-chat' },
    { text: '发现', pagePath: '/pages/discover', iconType: 'unocss', icon: 'i-carbon-compass' },
    { text: '我的', pagePath: '/pages/user', iconType: 'unocss', icon: 'i-carbon-user' },
  ],
})

const hooks = createTabbarHooks({
  onBulgeClick: () => {
    // 自定义鼓包点击逻辑
    uni.navigateTo({ url: '/pages/publish' })
  }
})
```

## 🔧 高级配置

### 自定义主题
```typescript
const config = createTabbarConfig({
  theme: {
    activeColor: '#007aff',
    inactiveColor: '#8e8e93',
    backgroundColor: '#ffffff',
    borderColor: '#c6c6c6',
  },
})
```

### 动态角标
```typescript
const hooks = createTabbarHooks({
  getBadge: (item) => {
    if (item.badge === 'messageCount') {
      return getMessageCountFromAPI()
    }
    if (item.badge === 'taskCount') {
      return getPendingTaskCount()
    }
    return item.badge
  },
})
```

### 权限控制
```typescript
const hooks = createTabbarHooks({
  beforeNavigate: async (index, item) => {
    // 检查登录状态
    if (!isLoggedIn() && item.requiresAuth) {
      uni.showToast({ title: '请先登录' })
      uni.navigateTo({ url: '/pages/login' })
      return false
    }
    
    // 检查权限
    if (item.permission && !hasPermission(item.permission)) {
      uni.showToast({ title: '权限不足' })
      return false
    }
    
    return true
  },
})
```

## 🔄 迁移指南

### 从旧版本迁移

如果你之前使用的是硬编码方式，可以按以下步骤迁移：

1. **创建配置文件**
```typescript
// tabbar.config.ts
import { createTabbarConfig } from '@jh-app/app'

export const tabbarConfig = createTabbarConfig({
  items: [
    // 你的自定义配置
  ],
})
```

2. **更新组件使用**
```vue
<template>
  <Tabbar :config="tabbarConfig" />
</template>

<script setup>
import { Tabbar } from '@jh-app/app'
import { tabbarConfig } from './tabbar.config'
</script>
```

## 🎯 最佳实践

1. **使用配置工厂** - 始终使用 `createTabbarConfig` 确保配置完整
2. **选择合适图标** - 推荐 UnoCSS 图标，体积小且灵活
3. **利用钩子函数** - 实现自定义逻辑，避免修改组件代码
4. **保持配置分离** - 将配置放在单独文件中便于维护
5. **使用 TypeScript** - 充分利用类型检查和自动补全

## 🐛 常见问题

### Q: 如何隐藏某个 tabbar 项？
A: 在 items 配置中排除该项，或使用 beforeNavigate 钩子返回 false。

### Q: 如何实现动态角标？
A: 使用 getBadge 钩子，从 API 或状态管理获取实时数据。

### Q: 如何自定义鼓包按钮？
A: 设置 features.bulge: true，并在 onBulgeClick 钩子中实现自定义逻辑。

### Q: 如何适配不同平台？
A: 组件已内置平台适配，使用条件编译处理差异。

### Q: 如何在运行时更新配置？
A: 使用 createTabbarStore 创建新的状态，或直接修改 store 中的数据。
