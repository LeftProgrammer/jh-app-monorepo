# Store 模块

基于 Pinia 的状态管理模块。框架只导出 Store 定义，Pinia 实例和持久化配置由应用层创建。

## 模块结构

| 文件 | Store | 说明 |
|------|-------|------|
| `token.ts` | `useTokenStore` | Token/登录/登出/刷新，支持单双 Token 模式 |
| `user.ts` | `useUserStore` | 用户信息、角色、权限、部门、常用菜单 |
| `dict.ts` | `useDictStore` | 字典数据缓存、查询、转换 |
| `global.ts` | `useGlobalState` | 全局状态（待办数量、消息数量） |
| `system.ts` | `useSystemState` | 系统状态（记住账号密码） |
| `theme.ts` | `useThemeStore` | 主题切换（light/dark）、主题变量 |

## 导入方式

```ts
// 按需导入（推荐）
import {
  useTokenStore,
  useUserStore,
  useThemeStore,
  useSystemState,
  useGlobalState,
  useDictStore,
} from '@jinghe-sanjiaoroad-app/framework/store'

// 类型导入
import type { DictItem, DictCache } from '@jinghe-sanjiaoroad-app/framework/store'

// 命名空间导入（避免命名冲突）
import { tokenStores, userStores, dictStores } from '@jinghe-sanjiaoroad-app/framework/store'
```

## 应用层配置

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

## 各 Store 说明

### useTokenStore

```ts
const tokenStore = useTokenStore()

// 登录（账号/注册/短信/微信）
await tokenStore.login({ username: 'admin', password: '123456', type: 'default' })
await tokenStore.wxLogin()

// 状态判断
tokenStore.hasLogin      // 是否已登录（computed）
tokenStore.validToken    // 当前有效 Token（computed）

// 登出
await tokenStore.logout()
```

登录成功后自动：获取用户信息 → 获取全局信息 → 加载字典缓存。

### useUserStore

```ts
const userStore = useUserStore()

userStore.userInfo        // 用户信息（id/username/nickname/avatar/phone/department）
userStore.roles           // 角色标识列表
userStore.permissions     // 权限标识列表
userStore.favoriteMenus   // 常用菜单 key 列表
userStore.tenantId        // 租户 ID
userStore.userList        // 全部用户列表

await userStore.fetchUserInfo()      // 刷新用户信息
userStore.setFavoriteMenus(keys)     // 设置常用菜单
userStore.setTenantId(id)            // 设置租户
```

### useDictStore

```ts
const dictStore = useDictStore()

await dictStore.loadDictCache()                  // 加载全部字典（登录后自动调用）
dictStore.getDictOptions('user_status')           // 获取选项列表
dictStore.getDictData('user_status', '1')         // 获取单个字典项
dictStore.isLoaded                                // 是否已加载
dictStore.clearDictCache()                        // 清空缓存（登出时自动调用）
```

### useGlobalState

```ts
const globalState = useGlobalState()

globalState.globalConfig.todoTotal    // 待办数量
globalState.globalConfig.msgTotal     // 消息数量

await globalState.fetchGlobalInfo()   // 刷新待办/消息数量
globalState.clearGlobalInfo()         // 清空
```

### useSystemState

```ts
const systemState = useSystemState()

systemState.systemConfig.username     // 记住的用户名
systemState.systemConfig.password     // 记住的密码

systemState.setSystemInfo({ username: 'admin', password: '123456' })
systemState.clearSystemInfo()
```

### useThemeStore

```ts
const themeStore = useThemeStore()

themeStore.theme          // 'light' | 'dark'
themeStore.themeVars      // ConfigProviderThemeVars

themeStore.toggleTheme()
themeStore.setThemeVars({ colorTheme: '#1890ff' })
```

## 注意事项

- 所有 Store 均配置 `persist: true`，数据自动持久化到 `uni.storage`
- 框架包不创建 Pinia 实例，避免 `uni` 运行时对象在构建时不存在的问题
- `useTokenStore.logout()` 会自动清理 token、用户信息和字典缓存
