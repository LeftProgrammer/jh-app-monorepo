# 🏠 工作台首页模块

> 零配置可用，渐进式增强的移动端工作台解决方案

## 🚀 快速开始

### 基础使用（推荐）

```vue
<!-- pages/index/index.vue -->
<template>
  <view class="home-page">
    <UserHeader />
    <MenuSection />
    <HomeNews />
  </view>
</template>

<script setup>
import { UserHeader, MenuSection, HomeNews } from '@jh-app/app/pages/index'
</script>
```

### 菜单配置

```typescript
// App.vue - 应用启动时
import { configureMenus } from '@jh-app/app/pages/index'

export default {
  onLaunch() {
    configureMenus([
      {
        key: "myapp",
        name: "我的应用",
        menus: [
          { key: "home", name: "首页", url: "/pages/home" },
          { key: "user", name: "用户", url: "/pages/user" }
        ]
      }
    ])
  }
}
```

## 📱 组件介绍

### 📋 组件清单

| 组件 | 用途 | 配置难度 | 推荐度 |
|------|------|----------|--------|
| **HomePage** | 完整首页 | ⭐ | ⭐⭐⭐⭐⭐ |
| **UserHeader** | 用户信息头部 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **MenuSection** | 菜单区域 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **HomeNews** | 新闻资讯 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **MenuGrid** | 菜单网格 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **HomeBanner** | 轮播图 | ⭐⭐ | ⭐⭐⭐⭐ |

### 🎨 使用示例

#### UserHeader - 用户信息头部

```vue
<!-- ✅ 零配置：自动获取用户数据 -->
<UserHeader />

<!-- ⚡ 按需配置：自定义数据 -->
<UserHeader 
  :user-info="myUser"
  :todo-num="5"
  :auto-fetch="false"
  @todo-click="handleTodo"
/>
```

#### MenuSection - 菜单区域

```vue
<!-- ✅ 零配置：使用默认菜单 -->
<MenuSection />

<!-- ⚡ 按需配置：自定义布局 -->
<MenuSection 
  :chunk-size="6"
  :height="'320rpx'"
  @menu-click="handleClick"
/>

<!-- 🔧 高级配置：完全自定义 -->
<MenuSection 
  :swiper-props="{ loop: false }"
  :grid-props="{ gutter: '20rpx' }"
>
  <template #icon="{ menu }">
    <CustomIcon :menu="menu" />
  </template>
</MenuSection>
```

#### HomeNews - 新闻资讯

```vue
<!-- ✅ 零配置：自动获取新闻 -->
<HomeNews />

<!-- ⚡ 按需配置：自定义数据源 -->
<HomeNews 
  :page-size="5"
  :auto-fetch="false"
  @item-click="handleNews"
/>
```

#### MenuGrid - 菜单网格

```vue
<!-- ✅ 零配置：5列网格 -->
<MenuGrid :menus="menus" />

<!-- ⚡ 按需配置：自定义布局 -->
<MenuGrid 
  :menus="menus" 
  :column="4" 
  :auto-navigate="false"
  @click="handleMenuClick"
/>
```

#### HomeBanner - 轮播图

```vue
<!-- ✅ 零配置：默认轮播图 -->
<HomeBanner />

<!-- ⚡ 按需配置：自定义轮播图 -->
<HomeBanner 
  :banners="myBanners"
  :autoplay="true"
  @click="handleBannerClick"
/>
```

## ⚙️ 菜单配置系统

### 🎯 配置方式

#### 方式1: 最简单 - 直接传入数组

```typescript
import { configureMenus } from '@jh-app/app/pages/index'

configureMenus([
  {
    key: "business",
    name: "业务模块",
    menus: [
      { key: "order", name: "订单管理", url: "/pages/order" }
    ]
  }
])
```

#### 方式2: 增量添加

```typescript
import { addMenuGroup, addMenuItem } from '@jh-app/app/pages/index'

// 添加整个分组
addMenuGroup({
  key: "tools",
  name: "工具模块",
  menus: [{ key: "calc", name: "计算器", url: "/pages/calc" }]
})

// 添加单个菜单
addMenuItem("general", {
  key: "feature",
  name: "新功能",
  url: "/pages/feature"
})
```

#### 方式3: 完全控制

```typescript
import { setMenuConfig } from '@jh-app/app/pages/index'

setMenuConfig({
  overrideDefault: true,
  enablePermission: false,
  groups: [
    {
      key: "custom",
      name: "自定义模块",
      menus: [
        {
          key: "feature",
          name: "自定义功能",
          url: "/pages/custom",
          icon: "star",
          iconColor: "#52c41a"
        }
      ]
    }
  ]
})
```

### 📋 菜单项配置

```typescript
interface MenuItem {
  key: string              // 必填：菜单唯一标识
  name: string            // 必填：菜单显示名称
  url?: string            // 可选：跳转路径
  icon?: string           // 可选：图标名称
  iconColor?: string       // 可选：图标颜色
  enabled?: boolean        // 可选：是否启用
  permission?: string      // 可选：权限标识
  imageUrl?: string        // 可选：自定义图片
  description?: string     // 可选：菜单描述
  sort?: number           // 可选：排序权重
  badge?: string | number // 可选：角标
}
```

## 🔧 工具函数

### 📊 菜单工具

```typescript
import { 
  getMenuGroups,         // 获取菜单分组
  getMenuItemByKey,      // 根据 key 获取菜单
  getAllMenuItems,       // 获取所有菜单项
  searchMenuItems,       // 搜索菜单项
  getMenuStats           // 获取菜单统计
} from '@jh-app/app/pages/index'

// 使用示例
const groups = getMenuGroups()
const menuItem = getMenuItemByKey('home')
const searchResults = searchMenuItems('管理')
const stats = getMenuStats()
```

### 🔄 配置管理

```typescript
import { 
  configureMenus,        // 配置菜单
  addMenuGroup,          // 添加分组
  addMenuItem,           // 添加菜单项
  setMenuConfig,         // 高级配置
  resetMenuConfig        // 重置配置
} from '@jh-app/app/pages/index'
```

## 🎨 样式定制

### 🎯 主题色

```scss
.home-page {
  // 默认主题色
  --primary-color: #22b5af;
  --secondary-color: #3fc5be;
  --accent-color: #95e6ea;
}
```

### 📱 响应式设计

所有组件都支持响应式设计，自动适配不同屏幕尺寸。

## 📚 使用场景

### 🟢 新手项目

```typescript
// 只需要这样
import { configureMenus } from '@jh-app/app/pages/index'

configureMenus([
  { key: "app", name: "应用", menus: [
    { key: "home", name: "首页", url: "/pages/home" }
  ]}
])
```

### 🟡 进阶项目

```typescript
// 按需添加功能
import { addMenuItem } from '@jh-app/app/pages/index'

addMenuItem("general", { key: "feature", name: "功能" })
```

### 🔴 复杂项目

```typescript
// 完全控制
import { setMenuConfig, type MenuConfig } from '@jh-app/app/pages/index'

const config: MenuConfig = {
  overrideDefault: true,
  groups: [/* 完全自定义 */]
}
setMenuConfig(config)
```

## 🔍 开发调试

### 🛠️ 调试工具

```typescript
import { getMenuStats, resetMenuConfig } from '@jh-app/app/pages/index'

// 查看菜单统计
const stats = getMenuStats()
console.log('菜单统计:', stats)

// 重置配置（调试用）
resetMenuConfig()
```

### 📝 常见问题

#### Q: 如何自定义菜单图标？
A: 使用 `icon` 和 `iconColor` 字段，或通过插槽完全自定义。

#### Q: 如何控制菜单显示顺序？
A: 使用 `sort` 字段，数值越小越靠前。

#### Q: 如何禁用某个菜单？
A: 设置 `enabled: false`。

#### Q: 如何添加权限控制？
A: 使用 `permission` 字段配置权限标识。