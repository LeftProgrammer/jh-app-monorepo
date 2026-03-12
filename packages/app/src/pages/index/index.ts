/**
 * 工作台模块导出
 * 提供工作台相关的组件、配置和工具函数
 * 
 * 使用方式：
 * import { IndexPage, UserHeader, MenuSection, configureMenus } from '@jinghe-sanjiaoroad-app/framework/pages/index'
 */

// ==================== 页面组件 ====================
export { default as IndexPage } from './index.vue'

// ==================== UI 组件 ====================
export { default as UserHeader } from './components/user-header.vue'
export { default as MenuSection } from './components/menu-section.vue'
export { default as HomeNews } from './components/news.vue'
export { default as MenuGrid } from './components/menu-grid.vue'
export { default as HomeBanner } from './components/banner.vue'

// ==================== 菜单配置（推荐使用） ====================
export { 
  configureMenus, 
  addMenuGroup, 
  addMenuItem, 
  setMenuConfig, 
  resetMenuConfig,
  getMenuGroups,
  getMenuItemByKey,
  searchMenuItems,
  getMenuStats,
  type MenuItem,
  type MenuGroup,
  type MenuConfig
} from './menu-config'
