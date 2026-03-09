# 路由模块使用指南

## 概述

路由模块提供完整的路由管理和登录拦截功能，支持黑名单和白名单两种登录策略，适用于不同类型的应用场景。

## 模块结构

### 核心模块

- **config.ts** - 路由配置和登录策略
- **interceptor.ts** - 路由拦截器实现
- **index.ts** - 统一导出入口

### 导出方式

#### 统一导出 (export *)
```typescript
// 按需导入配置和功能
import { 
  LOGIN_STRATEGY,
  LOGIN_PAGE,
  EXCLUDE_LOGIN_PATH_LIST,
  judgeIsExcludePath
} from '@jh-app/app/router'
```

#### 命名空间导出 (export * as)
```typescript
// 导入命名空间
import { routerConfig, routerInterceptor } from '@jh-app/app/router'

const { LOGIN_STRATEGY, LOGIN_PAGE } = routerConfig
const { judgeIsExcludePath } = routerInterceptor
```

## 登录注册页路由

登录页对应路由是 `/pages-core/auth/login`.
注册页对应路由是 `/pages-core/auth/register`.
短信登录页对应路由是 `/pages-core/auth/code-login`.
忘记密码页对应路由是 `/pages-core/auth/forget-password`.

## 登录注册页适用性

登录注册页主要适用于 `h5` 和 `App`，默认不适用于 `小程序`，因为 `小程序` 通常会使用平台提供的快捷登录。

特殊情况例外，如业务需要跨平台复用登录注册页时，也可以用在 `小程序` 上，所以主要还是看业务需求。

通过一个参数 `LOGIN_PAGE_ENABLE_IN_MP` 来控制是否在 `小程序` 中使用 `H5登录页` 的登录逻辑。
