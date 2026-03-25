# 路由模块

提供路由拦截和登录验证功能，支持白名单（默认需登录）和黑名单（默认免登录）两种策略。

## 模块结构

| 文件 | 说明 |
|------|------|
| `index.ts` | 统一导出入口 + 登录策略常量 |
| `interceptor.ts` | 路由拦截器核心实现 |

## 导入方式

```ts
import {
  routeInterceptor,        // 路由拦截器（main.ts 中安装）
  navigateToInterceptor,   // 导航拦截器对象
  judgeIsExcludePath,      // 判断路径是否排除登录
  LOGIN_STRATEGY_MAP,      // 登录策略枚举
} from '@jinghe-sanjiaoroad-app/framework/router'

// 路由配置通过 config 模块获取
import { getLoginPage, isNeedLoginMode } from '@jinghe-sanjiaoroad-app/framework/config'
```

## 使用方式

### 安装拦截器

```ts
// main.ts
import { routeInterceptor } from '@jinghe-sanjiaoroad-app/framework/router'

export function createApp() {
  const app = createSSRApp(App)
  app.use(routeInterceptor)  // 拦截 navigateTo/reLaunch/redirectTo/switchTab
  return { app }
}
```

### 配置路由策略

```ts
// main.ts
import { initFramework } from '@jinghe-sanjiaoroad-app/framework'

initFramework({
  router: {
    loginPage: '/pages/login/index',
    homePage: '/pages/home/index',
    isNeedLoginMode: true,        // true=白名单策略（默认需登录）
    excludeLoginPathList: [],     // 配合策略的排除列表
    loginPageEnableInMp: true,    // 小程序是否启用自定义登录页
  },
  routerDeps: {
    getAllPages,  // 注入项目的 getAllPages 函数
  }
})
```

### 页面级免登录配置

```vue
<!-- 在页面的 route-block 中声明 -->
<route lang="json">
{
  "style": { "navigationStyle": "custom" },
  "excludeLoginPath": true
}
</route>
```

## 拦截器行为

1. 解析目标 URL，提取 path 和 query
2. 检查页面是否存在，不存在则跳转 404
3. 同步 tabbar 选中状态
4. 小程序且未启用自定义登录页时，跳过登录检查
5. 已登录时：如果目标是登录页，则重定向到首页或 redirect 参数指定页面
6. 未登录时：根据策略（白名单/黑名单）判断是否需要跳转登录页

## 登录策略

| 策略 | `isNeedLoginMode` | 行为 |
|------|-------------------|------|
| 白名单 | `true`（默认） | 除 `excludeLoginPath` 标记的页面外，均需登录 |
| 黑名单 | `false` | 除 `excludeLoginPath` 标记的页面外，均可直接访问 |
