/**
 * 工作台页面模块导出
 * 提供首页工作台相关的组件、页面和功能
 */

// 导出页面组件
export { default as HomePage } from './index.vue'

// 导出子组件
export { default as UserHeader } from './components/user-header.vue'
export { default as MenuSection } from './components/menu-section.vue'
export { default as HomeNews } from './components/news.vue'
export { default as MenuGrid } from './components/menu-grid.vue'

// 导出类型定义
export type { MenuItem, MenuGroup } from './index'

// 导出工具函数
export { getMenuGroups, getMenuItemByKey } from './index'
