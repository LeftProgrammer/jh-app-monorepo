/**
 * 工作台页面模块导出
 * 提供首页工作台相关的组件、页面和功能
 * 
 * 使用方式：
 * import { HomePage, UserHeader, configureMenus } from '@jh-app/app/pages/index'
 */

// ==================== 页面组件 ====================
export { default as HomePage } from './index.vue'

// ==================== UI 组件 ====================
export { default as UserHeader } from './components/user-header.vue'
export { default as MenuSection } from './components/menu-section.vue'
export { default as HomeNews } from './components/news.vue'
export { default as MenuGrid } from './components/menu-grid.vue'
export { default as HomeBanner } from './components/banner.vue'

// ==================== 菜单配置（推荐使用） ====================
export { 
  configureMenus,        // 最简单：直接传入数组
  addMenuGroup,          // 增量：添加分组
  addMenuItem,           // 增量：添加菜单项
  setMenuConfig,         // 高级：完全控制
  resetMenuConfig        // 重置：恢复默认
} from './index'

// ==================== 菜单工具函数 ====================
export { 
  getMenuGroups,         // 获取菜单分组
  getMenuItemByKey,      // 根据 key 获取菜单
  getAllMenuItems,       // 获取所有菜单项
  getMenuItemsByKeys,    // 批量获取菜单项
  searchMenuItems,       // 搜索菜单项
  getMenuStats           // 获取菜单统计
} from './index'

// ==================== 类型定义 ====================
export type { 
  MenuItem,              // 菜单项类型
  MenuGroup,             // 菜单分组类型
  MenuConfig             // 菜单配置类型
} from './index'
