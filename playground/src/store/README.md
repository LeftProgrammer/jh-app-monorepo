# Store 使用说明

## 概述

本项目的 store 模块基于 Pinia,通过框架包 `@jinghe-sanjiaoroad-app/framework/store` 提供统一的状态管理。

## 支持的导入方式

### 方式一:从主入口导入(推荐)

```typescript
import { useUserStore, useTokenStore, useSystemState } from '@/store'
```

### 方式二:从子路径导入(兼容原始项目)

```typescript
import { useUserStore } from '@/store/user'
import { useTokenStore } from '@/store/token'
import { useSystemState } from '@/store/system'
import { useGlobalState } from '@/store/global'
import { useThemeStore } from '@/store/theme'
import { useDictStore } from '@/store/dict'
```

## 可用的 Store 模块

| Store 模块 | 导入路径 | 说明 |
|-----------|---------|------|
| `useUserStore` | `@/store` 或 `@/store/user` | 用户状态管理 |
| `useTokenStore` | `@/store` 或 `@/store/token` | Token 状态管理 |
| `useSystemState` | `@/store` 或 `@/store/system` | 系统状态管理 |
| `useGlobalState` | `@/store` 或 `@/store/global` | 全局状态管理 |
| `useThemeStore` | `@/store` 或 `@/store/theme` | 主题状态管理 |
| `useDictStore` | `@/store` 或 `@/store/dict` | 字典状态管理 |

## 使用示例

```typescript
// 示例 1: 使用用户 store
import { useUserStore } from '@/store'

const userStore = useUserStore()
console.log(userStore.userInfo)

// 示例 2: 使用 Token store
import { useTokenStore } from '@/store/token'

const tokenStore = useTokenStore()
await tokenStore.login({ type: 'username', username: 'admin', password: '123456' })

// 示例 3: 混合使用
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'

const userStore = useUserStore()
const tokenStore = useTokenStore()
```

## 架构说明

### 目录结构

```
playground/src/store/
├── index.ts          # 主入口,重新导出框架包的所有 store
├── user.ts           # 用户 store 子路径导出
├── token.ts          # Token store 子路径导出
├── system.ts         # 系统 store 子路径导出
├── global.ts         # 全局 store 子路径导出
├── theme.ts          # 主题 store 子路径导出
├── dict.ts           # 字典 store 子路径导出
└── README.md         # 本文档
```

### 实现原理

1. **框架包导出**: `@jinghe-sanjiaoroad-app/framework/store` 导出所有 store 模块
2. **主入口重导出**: `playground/src/store/index.ts` 通过 `export *` 重新导出框架包的所有内容
3. **子路径支持**: 每个子模块文件(如 `user.ts`)从框架包主入口导入并重新导出对应的 store

这种设计既保持了代码的简洁性,又兼容了原始项目的导入方式。

## 注意事项

1. **不要重复导入**: 避免在同一个文件中多次从 `@/store` 导入,ESLint 会报错
   ```typescript
   // ❌ 错误
   import { useUserStore } from '@/store'
   import { useTokenStore } from '@/store'
   
   // ✅ 正确
   import { useUserStore, useTokenStore } from '@/store'
   ```

2. **选择一种导入方式**: 建议在项目中统一使用一种导入方式,避免混用
   - 新代码推荐使用主入口导入
   - 迁移的旧代码可以保持子路径导入

3. **Pinia 实例**: 框架包已经创建并配置好 Pinia 实例,包括持久化插件,无需额外配置
