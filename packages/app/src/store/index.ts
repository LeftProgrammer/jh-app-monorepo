/**
 * 状态管理模块统一导出
 *
 * @description 基于 Pinia 的状态管理，包含用户、Token、主题、系统、字典等状态管理
 * @export store - Pinia 实例
 * @export useTokenStore - Token 状态管理
 * @export useUserStore - 用户状态管理
 * @export useThemeStore - 主题状态管理
 * @export useSystemState - 系统状态管理
 * @export useGlobalState - 全局状态管理
 * @export useDictStore - 字典状态管理
 * @export tokenStores - Token 模块命名空间
 * @export userStores - 用户模块命名空间
 * @export themeStores - 主题模块命名空间
 * @export systemStores - 系统模块命名空间
 * @export globalStores - 全局模块命名空间
 * @export dictStores - 字典模块命名空间
 * @export createAppStore - 创建自定义 Pinia 实例
 * @export createPersistedState - 持久化插件主要方法
 * @export * as persistPlugin - 持久化插件命名空间（按需使用）
 * @usage 状态管理、数据持久化、用户认证、主题切换
 *
 * @note 依赖管理策略：
 *       - pinia: 外部项目需要安装（peerDependencies）
 *       - pinia-plugin-persistedstate: 包内提供，外部项目可选安装
 *       - 这样既保证了灵活性，又简化了基本使用
 *
 * @note 持久化插件使用：
 *       - 基础使用：import { store } from '@jinghe-sanjiaoroad-app/app/store'
 *       - 自定义配置：import { createAppStore } from '@jinghe-sanjiaoroad-app/app/store'
 *       - 主要方法：import { createPersistedState } from '@jinghe-sanjiaoroad-app/app/store'
 *       - 完整访问：import { persistPlugin } from '@jinghe-sanjiaoroad-app/app/store'
 *
 * @note 包体积优化：
 *       - createPersistedState: 按需导出，支持 Tree Shaking
 *       - persistPlugin: 命名空间导出，按需使用
 *       - 未使用的方法不会被打包进最终产物
 */
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 按需导入主要方法
import * as persistPlugin from 'pinia-plugin-persistedstate' // 命名空间导入（按需使用）

/**
 * 创建默认的 Pinia 实例
 * 适用于大多数 uni-app 项目，使用 uni.storage 作为持久化存储
 *
 * @note 外部项目直接使用此实例，无需额外配置
 */
const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

// 立即激活 Pinia 实例, 这样即使在 app.use(store)之前调用 store 也能正常工作 （解决APP端白屏问题）
setActivePinia(store)

/**
 * 创建自定义的 Pinia 实例
 * 允许外部项目自定义持久化存储配置
 *
 * @param customStorage 自定义存储配置
 * @returns 配置好的 Pinia 实例
 *
 * @example
 * ```typescript
 * // 方式1: 使用默认配置（推荐）
 * import { store } from '@jinghe-sanjiaoroad-app/app/store'
 * app.use(store)
 *
 * // 方式2: 使用自定义配置
 * import { createAppStore } from '@jinghe-sanjiaoroad-app/app/store'
 * const customStore = createAppStore({
 *   getItem: localStorage.getItem,
 *   setItem: localStorage.setItem,
 * })
 * app.use(customStore)
 *
 * // 方式3: 完全自定义配置
 * import { createPinia } from 'pinia'  // 外部项目安装 pinia
 * import { createPersistedState } from '@jinghe-sanjiaoroad-app/app/store'  // 按需导入
 * const customStore = createPinia()
 * customStore.use(createPersistedState({
 *   storage: {
 *     getItem: localStorage.getItem,
 *     setItem: localStorage.setItem,
 *   },
 *   paths: ['token', 'userInfo'] // 只持久化指定字段
 * }))
 * app.use(customStore)
 *
 * // 方式4: 使用插件的其他方法（按需导入）
 * import { persistPlugin } from '@jinghe-sanjiaoroad-app/app/store'
 * // 假设插件有其他方法
 * // persistPlugin.someOtherMethod()
 * ```
 */
export function createAppStore(customStorage?: {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}) {
  const customStore = createPinia()

  customStore.use(
    createPersistedState({
      storage: customStorage || {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
      },
    }),
  )

  return customStore
}

// 持久化插件导出 - 支持按需使用和 Tree Shaking
export { createPersistedState } // 主要方法，按需导出
export { persistPlugin } // 命名空间，按需使用

// Store 模块导出 - 按字母顺序排列，保持一致性
export { useDictStore } from './dict'
export * as dictStores from './dict'

export { useGlobalState } from './global'
export * as globalStores from './global'

export { useSystemState } from './system'
export * as systemStores from './system'

export { useThemeStore } from './theme'
export * as themeStores from './theme'

export { useTokenStore } from './token'
export * as tokenStores from './token'

export { useUserStore } from './user'
export * as userStores from './user'

export default store
