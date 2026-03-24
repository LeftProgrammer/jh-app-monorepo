/**
 * 首页模块
 * 提供首页相关的类型、工具函数、组件和 composable
 */

// 组件导出
export { default as HomeBanner } from './components/banner.vue'
export { default as HomeMenuGrid } from './components/menu-grid.vue'
export { default as HomeMenuSection } from './components/menu-section.vue'
export { default as HomeNewsList } from './components/news-list.vue'
export { default as HomeUserHeader } from './components/user-header.vue'

// Composable 导出
export { useMenuGroups } from './composables/useMenuGroups'

// 类型导出
export * from './types'
export * from './utils'

// 页面组件导出
export { default as HomeDefaultPage } from './views/index.vue'
export { default as HomeMenuPage } from './views/menu.vue'
