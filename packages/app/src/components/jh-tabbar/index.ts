/**
 * Tabbar 组件模块
 *
 * 完整封装了 tabbar 的所有功能，包括：
 * - 配置：策略选择、项目列表、主题配置
 * - 组件：可配置的 Tabbar Vue 组件
 * - 状态管理：tabbar 状态、角标管理
 *
 * 使用方式：
 * 1. 在项目中创建 tabbar 配置文件，调用 createTabbarConfig 创建配置
 * 2. 调用 createTabbarStore 创建 store
 * 3. 在 App.vue 中使用 Tabbar 组件
 */

// === 配置导出 ===
export { createTabbarConfig, isTabBarPage } from './config'

// === 组件导出 ===
export { default as JhTabbar } from './jh-tabbar.vue'

// === Store 导出 ===
export { createTabbarStore } from './store'
export type { TabbarStoreReturn } from './store'

// === 类型导出 ===
export type {
  CustomTabBarItem,
  CustomTabBarItemBadge,
  NativeTabBarItem,
  TabbarConfigOptions,
  TabbarFullConfig,
  TabbarStoreInterface,
  TabbarStrategy,
} from './types'
export { TABBAR_STRATEGY_MAP } from './types'
