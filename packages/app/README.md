# @jh-app/app

## 📦 导入指南

### 页面模块
```typescript
// 工作台页面
import { pages } from '@jh-app/app'
const { HomePage, UserHeader, MenuSection } = pages.index

// 或者直接导入
import { HomePage, UserHeader, MenuSection } from '@jh-app/app/pages/index'

// 使用示例
// HomePage - 首页工作台页面
// UserHeader - 用户头部组件
// MenuSection - 菜单区域组件
```

### HTTP 模块
```typescript
import { http, httpGet, httpPost, httpPut, httpDelete } from '@jh-app/app'
// 来源：src/http/index.ts
```

### Store 状态管理
```typescript
import { useTokenStore, useUserStore } from '@jh-app/app'
// 来源：src/store/token.ts, src/store/index.ts
```

### Router 路由
```typescript
import { useRouter, toLoginPage } from '@jh-app/app'
// 来源：src/router/interceptor.ts
```

### Utils 工具函数
```typescript
import { formatDate, deepClone, debounce } from '@jh-app/app'
// 来源：src/utils/index.ts, src/utils/date.ts
```

### Types 类型定义
```typescript
import type { CustomRequestOptions, UserInfo } from '@jh-app/app'
// 来源：src/types/index.ts, src/http/types.ts
```

## 🔍 快速查找
使用 IDE 的 "Go to Definition" 功能（F12）可以快速跳转到源码位置。
