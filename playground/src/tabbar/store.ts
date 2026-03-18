/**
 * Tabbar Store
 *
 * 使用框架包的 createTabbarStore 创建 store
 * 简化了原有的状态管理代码
 */
import { createTabbarStore } from '@jinghe-sanjiaoroad-app/framework/components/tabbar'
import { tabbarConfig } from './config'

// 使用框架包创建 store
const { tabbarList, tabbarStore, isPageTabbar } = createTabbarStore(tabbarConfig)

// 导出供外部使用
export { isPageTabbar, tabbarList, tabbarStore }
