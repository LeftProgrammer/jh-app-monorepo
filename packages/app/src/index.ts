/**
 * jinghe-sanjiaoroad App 框架 - 核心功能导出
 * 
 * @description 提供 Vue 3 + UniApp 移动端开发框架的完整功能
 * @module @jinghe-sanjiaoroad-app/app
 * @version 1.0.0
 */

// 命名空间导出 - 避免命名冲突，支持按需使用
// API 接口
export * as api from './api'

// 状态管理
export * as store from './store'

// 路由管理
export * as router from './router'

// HTTP 模块
export * as http from './http'

// 组合函数
export * from './hooks'

// 工具函数
export * from './utils'

// 配置模块
export * from './config'

// 组件模块
export * from './components'

// 页面模块
export * as pages from './pages'

// 样式模块
export * as style from './style'

// Vite 插件
export * as vitePlugins from './vite-plugins'