# 状态管理模块使用指南

## 概述

基于 Pinia 的状态管理模块，提供用户认证、主题管理、系统配置、数据字典等完整的状态管理功能，支持数据持久化和模块化组织。

## 模块结构

### 📋 核心模块

- **index.ts** - 统一导出入口和 Pinia 实例配置
- **token.ts** - Token 状态管理（用户认证）
- **user.ts** - 用户信息状态管理
- **theme.ts** - 主题状态管理
- **system.ts** - 系统状态管理
- **global.ts** - 全局状态管理
- **dict.ts** - 数据字典状态管理

### 🎯 导出方式

#### **默认导出**
```typescript
// 导入 Pinia 实例
import store from '@jh-app/app/store'

// 在 main.js 中使用
app.use(store)
```

#### **直接导出 (export { })**
```typescript
// 按需导入 Store
import { 
  useTokenStore,
  useUserStore,
  useThemeStore,
  useSystemState,
  useGlobalState,
  useDictStore
} from '@jh-app/app/store'
```

#### **命名空间导出 (export * as)**
```typescript
// 导入命名空间避免冲突
import { 
  tokenStores,
  userStores,
  themeStores,
  systemStores,
  globalStores,
  dictStores
} from '@jh-app/app/store'

// 使用
const { useTokenStore } = tokenStores
```

## 使用指南

### 🚀 基础配置

#### **Pinia 实例配置**
```typescript
// index.ts 中已配置好
import { createPinia, setActivePinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

const store = createPinia();
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
);

// 立即激活 Pinia 实例，解决 APP 端白屏问题
setActivePinia(store);
```

#### **在应用中使用**
```typescript
// main.js
import { createApp } from 'vue'
import store from '@jh-app/app/store'

const app = createApp(App)
app.use(store)
```

### 🔧 Token 状态管理

#### **基础使用**
```typescript
import { useTokenStore } from '@jh-app/app/store'

const tokenStore = useTokenStore()

// 检查登录状态
const isLoggedIn = computed(() => !!tokenStore.token)

// 登录
await tokenStore.login({
  username: 'admin',
  password: '123456'
})

// 登出
await tokenStore.logout()

// 刷新 Token
await tokenStore.refreshToken()
```

#### **Token 状态**
```typescript
interface TokenState {
  token: string              // 访问令牌
  refreshToken: string       // 刷新令牌
  tokenExpireIn: number      // Token 过期时间
  refreshTokenExpireIn: number // 刷新令牌过期时间
}
```

#### **登录方法**
```typescript
// 账号密码登录
await tokenStore.login({
  username: 'admin',
  password: '123456'
})

// 短信登录
await tokenStore.smsLogin({
  mobile: '13800138000',
  code: '123456'
})

// 微信登录
await tokenStore.wxLogin(wxCode)

// 注册
await tokenStore.register({
  username: 'newuser',
  password: '123456',
  mobile: '13800138000'
})
```

### 👤 用户状态管理

#### **基础使用**
```typescript
import { useUserStore } from '@jh-app/app/store'

const userStore = useUserStore()

// 获取用户信息
await userStore.getUserInfo()

// 获取权限信息
await userStore.getPermissionInfo()

// 获取部门信息
await userStore.getDeptInfo()
```

#### **用户状态**
```typescript
interface UserState {
  userId: number
  username: string
  nickname: string
  avatar: string
  phone: string
  permissions: string[]      // 权限列表
  roles: string[]            // 角色列表
  deptId: number             // 部门ID
  deptName: string           // 部门名称
}
```

### 🎨 主题状态管理

#### **基础使用**
```typescript
import { useThemeStore } from '@jh-app/app/store'

const themeStore = useThemeStore()

// 切换主题
themeStore.toggleTheme()

// 设置主题
themeStore.setTheme('dark')

// 设置主题变量
themeStore.setThemeVars({
  colorTheme: '#ff6b6b',
  colorDanger: '#ff4757'
})
```

#### **主题状态**
```typescript
interface ThemeState {
  theme: 'light' | 'dark'           // 当前主题
  themeVars: ConfigProviderThemeVars // 主题变量
}
```

#### **主题变量配置**
```typescript
// 默认主题变量
const defaultThemeVars = {
  colorTheme: '#009688',    // 主题色
  colorDanger: '#F53F3F',   // 危险色
  // ... 更多主题变量
}

// 自定义主题变量
themeStore.setThemeVars({
  colorTheme: '#1890ff',
  colorDanger: '#ff4d4f',
  bgColor: '#f5f5f5'
})
```

### 🌐 系统状态管理

#### **基础使用**
```typescript
import { useSystemState } from '@jh-app/app/store'

const systemStore = useSystemState()

// 设置系统信息
systemStore.setSystemInfo({
  platform: 'ios',
  version: '1.0.0',
  deviceId: 'unique-device-id'
})
```

#### **系统状态**
```typescript
interface SystemState {
  platform: string        // 平台信息
  version: string         // 应用版本
  deviceId: string        // 设备ID
  networkType: string     // 网络类型
  systemInfo: any        // 系统信息
}
```

### 📊 全局状态管理

#### **基础使用**
```typescript
import { useGlobalState } from '@jh-app/app/store'

const globalStore = useGlobalState()

// 获取待办数量
await globalStore.getTodoCount()

// 获取消息数量
await globalStore.getMsgCount()

// 设置待办数量
globalStore.setTodoCount(5)

// 设置消息数量
globalStore.setMsgCount(10)
```

#### **全局状态**
```typescript
interface GlobalState {
  todoTotal: number        // 待办数量
  msgTotal: number         // 消息数量
  loading: boolean         // 加载状态
}
```

### 📚 数据字典管理

#### **基础使用**
```typescript
import { useDictStore } from '@jh-app/app/store'

const dictStore = useDictStore()

// 获取字典数据
await dictStore.getDictData('user_status')

// 获取字典项
const statusOptions = dictStore.getDictItems('user_status')

// 字典值转换
const statusText = dictStore.getDictLabel('user_status', '1')

// 字典标签转换
const statusValue = dictStore.getDictValue('user_status', '正常')
```

#### **字典状态**
```typescript
interface DictState {
  dictData: Record<string, DictItem[]>  // 字典数据缓存
  loading: boolean                       // 加载状态
}

interface DictItem {
  label: string      // 显示标签
  value: string      // 字典值
  color?: string     // 颜色
  disabled?: boolean  // 是否禁用
}
```

## 高级功能

### 🔐 数据持久化

#### **自动持久化**
```typescript
// 所有 Store 都支持自动持久化
// 数据会自动保存到 uni.storage 中

// Token Store 持久化配置
persist: {
  key: 'token-store',
  storage: {
    getItem: uni.getStorageSync,
    setItem: uni.setStorageSync,
  },
  paths: ['token', 'refreshToken'] // 只持久化指定字段
}
```

#### **手动控制持久化**
```typescript
// 在 Store 定义中配置 persist 选项
export const useTokenStore = defineStore('token', () => {
  // ... state 定义
}, {
  persist: {
    key: 'token-store',
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
    paths: ['token', 'refreshToken'] // 指定需要持久化的字段
  }
})
```

### 🔄 状态监听

#### **监听状态变化**
```typescript
import { useTokenStore } from '@jh-app/app/store'

const tokenStore = useTokenStore()

// 监听 Token 变化
watch(() => tokenStore.token, (newToken, oldToken) => {
  console.log('Token 变化:', newToken, oldToken)
  
  if (!newToken) {
    // Token 清空，跳转到登录页
    uni.navigateTo({ url: '/pages-core/auth/login' }
  }
})
```

#### **跨 Store 通信**
```typescript
// 在 User Store 中监听 Token 变化
export const useUserStore = defineStore('user', () => {
  const tokenStore = useTokenStore()
  
  watch(() => tokenStore.token, async (token) => {
    if (token) {
      // Token 存在，获取用户信息
      await getUserInfo()
    } else {
      // Token 清空，清空用户信息
      resetUserInfo()
    }
  })
})
```

### 🎯 组合式 API

#### **在组件中使用**
```typescript
<template>
  <view>
    <text v-if="isLoggedIn">欢迎，{{ userInfo.nickname }}</text>
    <button @click="handleLogin" v-else>登录</button>
  </view>
</template>

<script setup>
import { useTokenStore, useUserStore } from '@jh-app/app/store'

const tokenStore = useTokenStore()
const userStore = useUserStore()

// 计算属性
const isLoggedIn = computed(() => !!tokenStore.token)
const userInfo = computed(() => userStore.userInfo)

// 方法
const handleLogin = async () => {
  await tokenStore.login({
    username: 'admin',
    password: '123456'
  })
  await userStore.getUserInfo()
}
</script>
```

#### **自定义 Composables**
```typescript
// composables/useAuth.ts
import { useTokenStore, useUserStore } from '@jh-app/app/store'

export function useAuth() {
  const tokenStore = useTokenStore()
  const userStore = useUserStore()
  
  const isLoggedIn = computed(() => !!tokenStore.token)
  const userInfo = computed(() => userStore.userInfo)
  
  const login = async (credentials: LoginCredentials) => {
    await tokenStore.login(credentials)
    await userStore.getUserInfo()
  }
  
  const logout = async () => {
    await tokenStore.logout()
    userStore.resetUserInfo()
  }
  
  return {
    isLoggedIn,
    userInfo,
    login,
    logout
  }
}
```

## 最佳实践

### ✅ 推荐用法

#### **1. 模块化组织**
```typescript
// 按功能模块组织 Store
// - token.ts: 认证相关
// - user.ts: 用户信息
// - theme.ts: 主题配置
// - dict.ts: 数据字典
```

#### **2. 类型安全**
```typescript
// 定义完整的接口类型
interface TokenState {
  token: string
  refreshToken: string
  tokenExpireIn: number
  refreshTokenExpireIn: number
}

// 使用 TypeScript 类型检查
const token: string = tokenStore.token
```

#### **3. 错误处理**
```typescript
// 在 Store 中统一处理错误
export const useTokenStore = defineStore('token', () => {
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await _login(credentials)
      token.value = response.token
      refreshToken.value = response.refreshToken
    } catch (error) {
      console.error('登录失败:', error)
      throw error // 向上传递错误
    }
  }
})
```

#### **4. 性能优化**
```typescript
// 使用 computed 缓存计算结果
const isLoggedIn = computed(() => !!token.value)

// 使用 watchEffect 自动响应
watchEffect(() => {
  if (token.value) {
    // Token 存在时的逻辑
  }
})
```

### ⚠️ 注意事项

#### **1. Store 命名规范**
- 使用 `useXxxStore` 命名规范
- Store ID 使用 kebab-case：`'token-store'`
- 命名空间使用 `xxxStores`：`tokenStores`

#### **2. 持久化配置**
- 只持久化必要的数据
- 避免持久化敏感信息
- 使用合适的 storage key

#### **3. 状态重置**
```typescript
// 提供重置方法
const reset = () => {
  token.value = ''
  refreshToken.value = ''
  tokenExpireIn.value = 0
  refreshTokenExpireIn.value = 0
}

// 在登出时调用
await logout()
reset()
```

#### **4. 异步操作**
```typescript
// 使用 async/await 处理异步操作
const getUserInfo = async () => {
  loading.value = true
  try {
    const response = await getUserInfoApi()
    userInfo.value = response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.value = false
  }
}
```

## 故障排除

### 常见问题

#### **1. Store 未激活**
```typescript
// 问题：Store 未激活导致白屏
// 解决：确保在 main.js 中正确配置
import store from '@jh-app/app/store'
app.use(store)

// 或者手动激活
import { setActivePinia, createPinia } from 'pinia'
const pinia = createPinia()
setActivePinia(pinia)
```

#### **2. 持久化失效**
```typescript
// 问题：数据没有持久化
// 解决：检查 persist 配置
export const useTokenStore = defineStore('token', () => {
  // ... state 定义
}, {
  persist: {
    key: 'token-store',
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    }
  }
})
```

#### **3. 状态不同步**
```typescript
// 问题：多个组件状态不同步
// 解决：使用 computed 和 watch
const token = computed(() => tokenStore.token)

watch(() => tokenStore.token, (newToken) => {
  // 响应 Token 变化
})
```

### 调试技巧

#### **1. 开启调试模式**
```typescript
// 开启 Pinia 调试
import { createPinia } from 'pinia'

const pinia = createPinia()
pinia.use(devtoolsPlugin) // 开发环境
```

#### **2. 状态检查**
```typescript
// 在组件中检查状态
console.log('Token:', tokenStore.token)
console.log('User:', userStore.userInfo)
console.log('Theme:', themeStore.theme)
```

#### **3. 持久化检查**
```typescript
// 检查持久化数据
console.log('Storage Token:', uni.getStorageSync('token-store'))
```

## 依赖说明

### 内部依赖
- `@/api/login` - 登录相关 API
- `@/api/system/user` - 用户管理 API
- `@/api/system/dict/data` - 数据字典 API
- `@/api/bpm/task` - 工作流任务 API
- `@/api/system/notify/message` - 通知消息 API

### 外部依赖
- `pinia` - 状态管理库
- `pinia-plugin-persistedstate` - 数据持久化插件
- `vue` - Vue 3 Composition API
- `wot-design-uni` - UI 组件库（主题相关）
