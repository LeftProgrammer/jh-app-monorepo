// Tabbar 组件统一导出
export { default as Tabbar } from './index.vue'

// === 核心功能导出 ===
// 配置核心
export { 
  createTabbarConfig, 
  defaultTabbarConfig,
  type TabbarPackageConfig,
  tabbarList,
  isTabBarPage
} from './config'

// 状态管理核心
export { 
  createTabbarStore,
  tabbarStore,
  tabbarListStore
} from './store'

// 钩子核心
export { 
  useTabbarHooks,
  createTabbarHooks,
  defaultTabbarHooks,
  type TabbarHooks
} from './hooks'

// === 完整导出 ===
// 配置模块完整导出
export * as TabbarConfig from './config'

// 状态管理完整导出
export * as TabbarStore from './store'

// 钩子模块完整导出
export * as TabbarHooksModule from './hooks'

// 类型完整导出
export * from './types'
