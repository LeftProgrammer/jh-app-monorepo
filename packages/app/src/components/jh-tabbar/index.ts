/**
 * jh-tabbar 组件模块
 *
 * 使用方式（3 步）：
 * 1. tabbar/config.ts — defineTabbar({ customItems, ... }) 创建配置并注册
 * 2. main.ts — import './tabbar/config' 确保路由拦截器之前完成初始化
 * 3. tabbar/index.vue — <jh-tabbar /> 使用组件
 */
import type { TabbarConfigOptions, TabbarFullConfig } from './types'
import { createTabbarConfig } from './config'
import { initTabbarStore } from './store'

// === 主 API ===

/**
 * 定义并注册 Tabbar 配置（一步完成）
 *
 * 内部自动调用 createTabbarConfig + initTabbarStore，
 * 返回完整配置（含 tabBar 供 pages.config.ts 使用）。
 *
 * @example
 * ```ts
 * import { defineTabbar } from '@jinghe-sanjiaoroad-app/framework/components/jh-tabbar'
 *
 * const { tabBar } = defineTabbar({
 *   customItems: [...],
 *   getBadgeValue: (key) => store.badges[key],
 * })
 * export { tabBar } // 供 pages.config.ts
 * ```
 */
export function defineTabbar(options: TabbarConfigOptions): TabbarFullConfig {
  const config = createTabbarConfig(options)
  initTabbarStore(config)
  return config
}

// === 组件 ===
// jh-tabbar 组件通过 easycom 自动注册，模板中直接 <jh-tabbar /> 即可
// 不在此处 re-export .vue 文件，避免 pages.config.ts 构建时 Node 无法解析 .vue

// === Store（运行时访问） ===
export { useTabbarStore } from './store'
export type { UseTabbarStoreReturn } from './store'

// === 类型 & 常量 ===
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
