# HTTP 模块使用指南

## 概述

HTTP 模块，提供完整的 HTTP 请求处理功能，包括请求拦截、响应处理、Token 管理、错误处理、API 加密等功能。基于 uni.request 封装，支持 uni-app 全平台。

## 模块结构

### 📋 核心模块

- **http.ts** - HTTP 请求核心功能
- **interceptor.ts** - 请求拦截器配置
- **types.ts** - TypeScript 类型定义
- **tools/enum.ts** - 枚举和工具函数
- **tools/queryString.ts** - 查询字符串处理

### 🎯 导出方式

#### **统一导出 (export *)**
```typescript
// 按需导入任何内容
import { 
  http,              // HTTP 实例
  requestInterceptor, // 拦截器
  CustomRequestOptions, // 类型定义
  ResultEnum,        // 枚举
  stringifyQuery     // 工具函数
} from '@jh-app/app/http'
```

#### **明确命名导出 (export { default as })**
```typescript
// 直接导入 HTTP 实例
import { http } from '@jh-app/app/http'
```

#### **命名空间导出 (export * as)**
```typescript
// 导入命名空间
import { httpCore, httpTypes, httpInterceptor } from '@jh-app/app/http'

const { http: httpFunction } = httpCore
const { CustomRequestOptions } = httpTypes
const { requestInterceptor } = httpInterceptor
```

## 使用指南

### 🚀 基础使用

#### **GET 请求**
```typescript
import { http } from '@jh-app/app/http'

// 简单 GET 请求
const users = await http.get('/api/users')

// 带参数的 GET 请求
const users = await http.get('/api/users', { page: 1, size: 10 })

// 带查询参数的 GET 请求
const users = await http.get('/api/users', null, { status: 'active' })
```

#### **POST 请求**
```typescript
// POST 请求
const newUser = await http.post('/api/users', { 
  name: 'John',
  email: 'john@example.com'
})

// 带配置的 POST 请求
const newUser = await http.post('/api/users', userData, {
  hideErrorToast: false,
  isEncrypt: true
})
```

#### **PUT 请求**
```typescript
// 更新用户
const updatedUser = await http.put('/api/users/1', { 
  name: 'Updated Name'
})
```

#### **DELETE 请求**
```typescript
// 删除用户
await http.delete('/api/users/1')

// 带请求体的 DELETE 请求
await http.delete('/api/users', { ids: [1, 2, 3] })
```

#### **通用请求**
```typescript
// 使用通用请求方法
const result = await http({
  url: '/api/users',
  method: 'GET',
  query: { page: 1 },
  header: { 'Custom-Header': 'value' }
})
```

### 🔧 高级配置

#### **自定义请求选项**
```typescript
import { CustomRequestOptions } from '@jh-app/app/http'

const options: CustomRequestOptions = {
  url: '/api/users',
  method: 'POST',
  data: userData,
  query: { timestamp: Date.now() },
  header: { 'Content-Type': 'application/json' },
  hideErrorToast: false,    // 是否隐藏错误提示
  original: false,          // 是否返回原始数据
  isEncrypt: true,           // 是否 API 加密
  timeout: 10000            // 超时时间
}

const result = await http(options)
```

#### **类型安全使用**
```typescript
import { http, CustomRequestOptions, IResponse } from '@jh-app/app/http'

interface User {
  id: number
  name: string
  email: string
}

// 类型安全的请求
const options: CustomRequestOptions = {
  url: '/api/users',
  method: 'GET'
}

const response: IResponse<User[]> = await http(options)
```

### 🛡️ 错误处理

#### **状态码判断**
```typescript
import { ResultEnum, ShowMessage } from '@jh-app/app/http'

try {
  const response = await http.get('/api/users')
  
  if (response.code === ResultEnum.Success200) {
    console.log('请求成功')
  } else if (response.code === ResultEnum.Unauthorized) {
    console.log('未授权')
  }
} catch (error) {
  console.error('请求失败:', error)
}
```

#### **错误消息生成**
```typescript
import { ShowMessage } from '@jh-app/app/http'

// 生成错误消息
const errorMessage = ShowMessage(404)
console.log(errorMessage) // "请求出错(404)，请检查网络或联系管理员！"
```

### 🔐 Token 管理

#### **自动 Token 处理**
```typescript
// Token 会自动添加到请求头
// 无需手动处理，拦截器会自动添加 Authorization header
const users = await http.get('/api/users')

// Token 过期会自动刷新
// 如果 Token 过期，会自动尝试刷新，无需手动处理
```

#### **白名单接口**
```typescript
// 白名单接口不会自动添加 Token
// 如登录、刷新 Token 等
const login = await http.post('/login', credentials)
```

### 📱 分页处理

#### **分页参数类型**
```typescript
import { PageParam, PageResult } from '@jh-app/app/http'

interface User {
  id: number
  name: string
}

// 分页参数
const pageParam: PageParam = {
  pageNo: 1,
  pageSize: 10,
  keyword: 'search'
}

// 分页结果
const result: PageResult<User> = await http.get('/api/users', pageParam)
```

### 🔍 查询字符串处理

#### **查询参数序列化**
```typescript
import { stringifyQuery } from '@jh-app/app/http'

// 序列化查询参数
const query = stringifyQuery({
  page: 1,
  size: 10,
  status: 'active',
  tags: ['tag1', 'tag2']
})

console.log(query) // "page=1&size=10&status=active&tags=tag1&tags=tag2"
```

### 🌐 拦截器使用

#### **安装拦截器**
```typescript
import { requestInterceptor } from '@jh-app/app/http'

// 在应用启动时安装拦截器
requestInterceptor.install()
```

#### **拦截器功能**
- **请求拦截** - 自动添加 Token、处理查询参数、API 加密
- **响应拦截** - 自动处理响应数据、错误处理、Token 刷新

### 🔧 环境配置

#### **基础 URL 配置**
```typescript
// 通过环境变量配置
// VITE_APP_BASE_URL=https://api.example.com

// 拦截器会自动使用配置的基础 URL
const users = await http.get('/users') 
// 实际请求: https://api.example.com/users
```

#### **租户配置**
```typescript
// 通过环境变量启用租户功能
// VITE_APP_TENANT_ENABLE=true

// 拦截器会自动添加租户信息
```

## 最佳实践

### ✅ 推荐用法

#### **1. 统一的错误处理**
```typescript
import { http, ResultEnum } from '@jh-app/app/http'

class ApiService {
  static async request<T>(options: CustomRequestOptions): Promise<T> {
    try {
      const response = await http<T>(options)
      
      if (response.code === ResultEnum.Success200 || 
          response.code === ResultEnum.Success0) {
        return response.data
      } else {
        throw new Error(response.message || '请求失败')
      }
    } catch (error) {
      console.error('API 请求失败:', error)
      throw error
    }
  }
}
```

#### **2. 类型安全的 API 封装**
```typescript
import { http, CustomRequestOptions } from '@jh-app/app/http'

interface User {
  id: number
  name: string
  email: string
}

class UserApi {
  static async getUsers(params?: PageParam): Promise<PageResult<User>> {
    return http.request<PageResult<User>>({
      url: '/api/users',
      method: 'GET',
      data: params
    })
  }

  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return http.request<User>({
      url: '/api/users',
      method: 'POST',
      data: userData
    })
  }

  static async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return http.request<User>({
      url: `/api/users/${id}`,
      method: 'PUT',
      data: userData
    })
  }

  static async deleteUser(id: number): Promise<void> {
    return http.request<void>({
      url: `/api/users/${id}`,
      method: 'DELETE'
    })
  }
}
```

#### **3. 请求重试机制**
```typescript
import { http } from '@jh-app/app/http'

async function requestWithRetry<T>(
  options: CustomRequestOptions,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await http<T>(options)
    } catch (error) {
      lastError = error as Error
      
      if (i === maxRetries) {
        throw lastError
      }
      
      // 指数退避
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
  
  throw lastError!
}
```

## 依赖说明

### 内部依赖
- `@/store/token` - Token 状态管理
- `@/store/user` - 用户状态管理
- `@/utils` - 工具函数
- `@/utils/encrypt` - API 加密工具

### 外部依赖
- `vue` - Vue 3 Composition API
- `uni-app` - uni-app 框架