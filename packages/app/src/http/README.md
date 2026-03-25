# HTTP 模块

基于 `uni.request` 封装的 HTTP 请求模块，支持 Token 自动刷新、API 加密、错误处理，适配 uni-app 全平台。

## 模块结构

| 文件 | 说明 |
|------|------|
| `http.ts` | HTTP 请求核心（`http`/`httpGet`/`httpPost`/`httpPut`/`httpDelete`） |
| `interceptor.ts` | 请求拦截器（Token 注入、URL 拼接、租户标识、API 加密） |
| `types.ts` | 类型定义（`CustomRequestOptions`/`IResponse`/`PageParam`/`PageResult`） |
| `tools/enum.ts` | 状态码枚举 `ResultEnum`、内容类型枚举 |
| `tools/queryString.ts` | 查询字符串序列化（替代 qs 库） |

## 导入方式

```ts
// 按需导入
import {
  http,                 // HTTP 函数（支持 http.get/post/put/delete）
  requestInterceptor,   // 拦截器（main.ts 中安装）
  ResultEnum,           // 状态码枚举
  stringifyQuery,       // 查询字符串工具
} from '@jinghe-sanjiaoroad-app/framework/http'

// 类型导入
import type {
  CustomRequestOptions,
  IResponse,
  PageParam,
  PageResult,
} from '@jinghe-sanjiaoroad-app/framework/http'

// 命名空间导入（避免命名冲突）
import { httpCore, httpTypes, httpInterceptor } from '@jinghe-sanjiaoroad-app/framework/http'
```

## 使用方式

### 安装拦截器

```ts
// main.ts
import { requestInterceptor } from '@jinghe-sanjiaoroad-app/framework/http'

export function createApp() {
  const app = createSSRApp(App)
  app.use(requestInterceptor)  // 拦截 uni.request + uni.uploadFile
  return { app }
}
```

### 发起请求

```ts
import { http } from '@jinghe-sanjiaoroad-app/framework/http'

// GET
const users = await http.get<User[]>('/system/user/list', { pageNo: 1, pageSize: 10 })

// POST
const result = await http.post<number>('/system/user/create', userData)

// PUT
await http.put('/system/user/update', userData)

// DELETE
await http.delete('/system/user/delete?id=1')

// 通用调用
const data = await http<User>({
  url: '/system/user/get',
  method: 'GET',
  query: { id: 1 },
  hideErrorToast: true,   // 隐藏错误提示
  original: true,         // 返回原始响应（不解包 data）
  isEncrypt: true,        // 启用 API 加密
})
```

### 分页请求

```ts
import type { PageParam, PageResult } from '@jinghe-sanjiaoroad-app/framework/http'

const params: PageParam = { pageNo: 1, pageSize: 10, status: 1 }
const result = await http.get<PageResult<User>>('/system/user/page', params)
// result.list, result.total
```

## 拦截器行为

**请求拦截（interceptor.ts）：**
1. 处理 `query` 参数，序列化为 URL 查询字符串
2. 非 http 开头的 URL 自动拼接 `baseUrl`（H5 代理模式拼接 `proxyPrefix`）
3. 自动注入 `Authorization: Bearer <token>`（白名单接口除外）
4. 启用租户时自动注入 `tenant-id` header
5. `isEncrypt: true` 时加密请求数据

**响应处理（http.ts）：**
1. 加密响应自动解密
2. 401 状态码触发 Token 刷新（双 Token 模式）或跳转登录
3. 业务码非 0/200 时显示错误提示并 reject
4. `original: true` 时返回原始响应数据

## Token 白名单

以下路径不会自动携带 Token：

- `/login`
- `/refresh-token`
- `/system/tenant/get-id-by-name`
