# jh-tabbar 组件

完整封装 tabbar 功能的框架组件，支持 4 种策略，开箱即用。

## 架构

```
jh-tabbar/
├── types.ts        # 类型定义
├── config.ts       # 配置工厂（内部）
├── store.ts        # 状态管理（内部）
├── jh-tabbar.vue   # 组件（零 props，自动获取配置）
└── index.ts        # 模块入口：defineTabbar() + useTabbarStore()
```

## 使用方式（2 步）

### 1. 配置 — `tabbar/config.ts`

```ts
import { defineTabbar } from '@jinghe-sanjiaoroad-app/framework/components/jh-tabbar'

const { tabBar } = defineTabbar({
  customItems: [ /* ... */ ],
  getBadgeValue: (key) => store.badges[key],
})

export { tabBar } // 供 pages.config.ts
```

### 2. 组件 — `tabbar/index.vue` + `App.ku.vue`

```vue
<!-- tabbar/index.vue -->
<script setup lang="ts">
import './config' // 确保配置已注册
</script>
<template>
  <jh-tabbar />
</template>
```

```vue
<!-- App.ku.vue -->
<template>
  <FgTabbar v-if="isCurrentPageTabbar" />
</template>
```

`<jh-tabbar />` 内部自动获取配置，零 props。
`main.ts` 无需任何 tabbar 代码 — 路由拦截器内部自动获取。

## API

| API | 说明 |
|-----|------|
| `defineTabbar(options)` | **主 API** — 定义配置并注册，返回含 `tabBar` 的完整配置 |
| `useTabbarStore()` | 获取 tabbar 状态（首次调用时懒创建） |
| `TABBAR_STRATEGY_MAP` | 策略常量枚举 |

## 配置选项 (`TabbarConfigOptions`)

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `customItems` | `CustomTabBarItem[]` | **必填** | 自定义 tabbar 列表 |
| `strategy` | `TabbarStrategy` | `CUSTOM_TABBAR_WITH_CACHE` | tabbar 策略 |
| `nativeItems` | `NativeTabBarItem[]` | `[]` | 原生 tabbar 列表 |
| `getBadgeValue` | `(key: string) => number \| undefined` | `() => undefined` | 角标值获取函数 |
| `bulgeEnable` | `boolean` | `false` | 是否启用中间鼓包 |
| `bulgeImage` | `string` | 默认扫描图 | 鼓包图片路径 |
| `onBulgeClick` | `() => void` | toast 提示 | 鼓包点击回调 |
| `beforeNavigate` | `(index, item) => boolean \| void` | `() => true` | 导航前回调 |
| `checkLogin` | `(pagePath: string) => boolean` | `() => true` | 登录检查函数 |
| `theme` | `{ activeColor, inactiveColor }` | 绿/灰 | 主题颜色 |

## 4 种策略

| 值 | 名称 | 缓存 | 说明 |
|----|------|------|------|
| 0 | `NO_TABBAR` | - | 无 tabbar |
| 1 | `NATIVE_TABBAR` | 有 | 完全原生 tabbar |
| 2 | `CUSTOM_TABBAR_WITH_CACHE` | 有 | 自定义 tabbar + switchTab 缓存（默认） |
| 3 | `CUSTOM_TABBAR_WITHOUT_CACHE` | 无 | 自定义 tabbar + navigateTo 无缓存 |

## 平台差异处理

组件内部已处理不同平台隐藏原生 tabbar 的差异：

| 平台 | 处理方式 |
|------|---------|
| **微信小程序** | `custom: true` 原生处理，无需手动 hide |
| **支付宝小程序** | `onMounted` 中调用 `hideTabBar`（支付宝要求此时机） |
| **H5 / App** | `onMounted` 中调用 `hideTabBar` |

> 使用者无需关心平台差异，框架已通过条件编译自动处理。
