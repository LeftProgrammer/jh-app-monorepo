# @jinghe-sanjiaoroad-app/framework

基于 Vue 3 + UniApp 的移动端开发框架，提供登录认证、路由拦截、HTTP 请求、状态管理、业务组件、页面模板等开箱即用的能力。

## 安装

```bash
pnpm add @jinghe-sanjiaoroad-app/framework
```

## 框架初始化

在项目入口 `main.ts` 中调用 `initFramework`，传入运行时配置：

```ts
import { createSSRApp } from 'vue'
import { initFramework, routeInterceptor } from '@jinghe-sanjiaoroad-app/framework'
import { requestInterceptor } from '@jinghe-sanjiaoroad-app/framework/http'

// 1. 初始化框架配置（必须最先调用）
initFramework({
  baseUrl: import.meta.env.VITE_SERVER_BASEURL,
  isDoubleTokenMode: import.meta.env.VITE_AUTH_MODE === 'double',
  tenantEnable: true,
  router: {
    loginPage: '/pages/login/index',
    homePage: '/pages/home/index',
    isNeedLoginMode: true,
  },
  routerDeps: {
    getAllPages,
  },
})

// 2. 安装拦截器
export function createApp() {
  const app = createSSRApp(App)
  app.use(routeInterceptor)     // 路由拦截（登录验证、404 检测）
  app.use(requestInterceptor)   // 请求拦截（Token 注入、加密、租户）
  return { app }
}
```

完整配置项见 `FrameworkConfig` 类型定义（[config/index.ts](src/config/index.ts)）。

## 模块总览

| 子路径 | 说明 | 详细文档 |
|--------|------|----------|
| `./config` | 框架运行时配置（`initFramework`） | [config/index.ts](src/config/index.ts) |
| `./store` | Pinia 状态管理（Token/用户/字典/主题） | [store/README.md](src/store/README.md) |
| `./http` | HTTP 请求 + 拦截器 | [http/README.md](src/http/README.md) |
| `./router` | 路由拦截 + 登录策略 | [router/README.md](src/router/README.md) |
| `./hooks` | 组合函数（权限/字典/请求/分页/上传） | [hooks/README.md](src/hooks/README.md) |
| `./utils` | 工具函数（日期/防抖/树/验证/下载等） | [utils/README.md](src/utils/README.md) |
| `./components` | 业务组件（字典标签/文件上传/选择器/Tabbar） | [components/README.md](src/components/README.md) |
| `./api` | 基础 API 封装（用户/字典/文件/BPM 等） | [api/index.ts](src/api/index.ts) |
| `./vite-plugins` | Vite 构建插件（原生资源复制/Manifest 同步） | [vite-plugins/README.md](src/vite-plugins/README.md) |
| `./pages/*` | 页面模板（登录/首页/用户/BPM/消息/错误） | 见下方 |
| `./style` | 全局样式 | — |

## 导入方式

### 子路径导入（推荐）

```ts
// 按模块按需导入，避免加载整个包
import { http } from '@jinghe-sanjiaoroad-app/framework/http'
import { useTokenStore, useUserStore } from '@jinghe-sanjiaoroad-app/framework/store'
import { useAccess, getDictLabel } from '@jinghe-sanjiaoroad-app/framework/hooks'
import { formatDate, debounce } from '@jinghe-sanjiaoroad-app/framework/utils'
import { routeInterceptor } from '@jinghe-sanjiaoroad-app/framework/router'
import { initFramework } from '@jinghe-sanjiaoroad-app/framework/config'

// 组件（推荐 easycom 自动引入，也可手动导入）
import { JhDictTag, JhFileUpload, JhUserPicker, JhUnitPicker } from '@jinghe-sanjiaoroad-app/framework/components'

// Tabbar
import { defineTabbar, useTabbarStore, TABBAR_STRATEGY_MAP } from '@jinghe-sanjiaoroad-app/framework/components'

// Vite 插件（仅 vite.config.ts 中使用）
import { createCopyNativeResourcesPlugin, syncManifestPlugin } from '@jinghe-sanjiaoroad-app/framework/vite-plugins'
```

### 主入口导入

```ts
// 主入口聚合了所有模块，适合快速使用
import { initFramework, routeInterceptor, useAccess, formatDate } from '@jinghe-sanjiaoroad-app/framework'

// 命名空间导入（避免命名冲突）
import { http, store, router, api } from '@jinghe-sanjiaoroad-app/framework'
```

## 组件 easycom 配置

在 `pages.json` 中配置后，模板中可直接使用 `jh-` 前缀组件，无需 import：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^jh-(.*)": "@jinghe-sanjiaoroad-app/framework/src/components/jh-$1/jh-$1.vue",
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue"
    }
  }
}
```

```vue
<template>
  <jh-dict-tag type="status" :value="1" />
  <jh-file-upload v-model:file-id="fileId" />
  <jh-user-picker v-model="userId" label="负责人" />
  <jh-unit-picker v-model="unitId" label="所属单位" />
  <jh-tabbar />
</template>
```

组件详细用法见 [components/README.md](src/components/README.md)。

## 页面模板

框架提供可复用的页面组件，外部项目在自己的页面中引入即可：

### 首页模块（`./pages/home`）

```ts
import {
  // 页面组件
  HomeDefaultPage,        // 首页完整页面
  HomeMenuPage,           // 菜单设置页面
  // 子组件
  HomeBanner,             // 轮播 Banner
  HomeUserHeader,         // 用户信息头部
  HomeMenuSection,        // 菜单分页区域（Swiper + Grid）
  HomeMenuGrid,           // 菜单网格
  HomeNewsList,           // 新闻列表
  // 组合函数
  useMenuGroups,          // 菜单分组逻辑
  // 工具函数
  filterMenuGroupsByPermission,
  getAllMenuItems,
  getMenuItemByKey,
  chunkArray,
} from '@jinghe-sanjiaoroad-app/framework/pages/home'

// 类型
import type { MenuItem, MenuGroup, NewsItem } from '@jinghe-sanjiaoroad-app/framework/pages/home'
```

### 认证模块（`./pages/auth`）

```ts
import {
  AuthLoginPage,          // 登录页（聚合入口）
  AuthDefaultLoginPage,   // 账号密码登录
  AuthCodeLoginPage,      // 短信验证码登录
  AuthRegisterPage,       // 注册页
  AuthForgetPasswordPage, // 忘记密码
  // 子组件
  AuthHeader,             // 认证页头部
  CodeInput,              // 验证码输入
  TenantPicker,           // 租户选择器
  Verify,                 // 图形验证
  // 样式路径常量
  AUTH_STYLE_PATH,
} from '@jinghe-sanjiaoroad-app/framework/pages/auth'
```

### 用户模块（`./pages/user`）

```ts
import {
  UserPage,               // 「我的」页面
  UserProfilePage,        // 个人信息
  UserSecurityPage,       // 安全设置
  UserSettingsPage,       // 系统设置
  UserFeedbackPage,       // 意见反馈
  UserAgreementPage,      // 用户协议
  UserPrivacyPage,        // 隐私政策
  // 子组件
  UserPasswordForm,       // 修改密码表单
  UserProfileForm,        // 编辑个人信息表单
} from '@jinghe-sanjiaoroad-app/framework/pages/user'
```

### BPM 流程模块（`./pages/bpm`）

```ts
import {
  BpmPage,                // BPM 主页面（待办/已办/我的/传阅 Tab）
  BpmDetailPage,          // 流程详情页
  // 子组件
  BpmTodoList,            // 待办列表
  BpmDoneList,            // 已办列表
  BpmMyList,              // 我的流程列表
  BpmCopyList,            // 传阅列表
  BpmFormDetail,          // 表单详情
  BpmProcessTaskList,     // 流程任务列表
  BpmProcessViewer,       // 流程图查看器
} from '@jinghe-sanjiaoroad-app/framework/pages/bpm'
```

### 消息模块（`./pages/message`）

```ts
import {
  MessagePage,            // 消息列表页
  MessageDetailPopup,     // 消息详情弹窗
} from '@jinghe-sanjiaoroad-app/framework/pages/message'
```

### 错误页面（`./pages/error`）

```ts
import {
  Error404Page,           // 404 页面
  ErrorPcOnlyPage,        // 仅 PC 访问提示
} from '@jinghe-sanjiaoroad-app/framework/pages/error'
```

## 应用层配置示例

### Pinia Store 配置

```ts
// store/index.ts（应用层）
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

// 立即激活，解决 APP 端白屏问题
setActivePinia(store)

export default store
export * from '@jinghe-sanjiaoroad-app/framework/store'
```

### Tabbar 配置

```ts
// tabbar/config.ts（应用层）
import { defineTabbar, TABBAR_STRATEGY_MAP } from '@jinghe-sanjiaoroad-app/framework/components'

export const { tabBar } = defineTabbar({
  strategy: TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
  customItems: [
    { text: '首页', pagePath: 'pages/home/index', iconType: 'image', icon: '/static/tabbar/home.png', iconActive: '/static/tabbar/home-active.png' },
    { text: '任务', pagePath: 'pages/bpm/index', iconType: 'image', icon: '/static/tabbar/task.png', iconActive: '/static/tabbar/task-active.png', badge: 'todoTotal' },
    { text: '我的', pagePath: 'pages/my/index', iconType: 'image', icon: '/static/tabbar/my.png', iconActive: '/static/tabbar/my-active.png' },
  ],
  getBadgeValue: (key) => { /* 从全局状态获取角标值 */ },
})
```

## 技术栈

- **Vue 3** + `<script setup>` + TypeScript
- **UniApp** — 跨平台（H5 / 微信小程序 / App）
- **Pinia** — 状态管理（框架只导出 Store 定义，实例由应用层创建）
- **wot-design-uni** — UI 组件库
- **dayjs** — 日期处理
- **crypto-js / jsencrypt** — API 加解密
