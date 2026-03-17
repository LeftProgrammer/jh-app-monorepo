// === 核心功能导出 ===
// 配置核心
export {
  createTabbarConfig,
  defaultTabbarConfig,
  isTabBarPage,
  tabbarList,
  type TabbarPackageConfig,
} from './config'

// === 完整导出 ===
// 配置模块完整导出
export * as TabbarConfig from './config'

// 钩子核心
export {
  createTabbarHooks,
  defaultTabbarHooks,
  type TabbarHooks,
  useTabbarHooks,
} from './hooks'

// 钩子模块完整导出
export * as TabbarHooksModule from './hooks'

// Tabbar 组件统一导出
export { default as Tabbar } from './index.vue'

// 状态管理核心
export {
  createTabbarStore,
  tabbarListStore,
  tabbarStore,
} from './store'

// 状态管理完整导出
export * as TabbarStore from './store'

// 类型完整导出
export * from './types'
