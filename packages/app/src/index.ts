/**
 * jinghe-sanjiaoroad App 框架 - 核心功能导出
 * 
 * @description 提供 Vue 3 + UniApp 移动端开发框架的完整功能
 * @module @jinghe-sanjiaoroad-app/framework
 * @version 1.0.0
 */

// 命名空间导出 - 避免命名冲突，支持按需使用
// 状态管理
export * as store from './store'

// 路由管理
export * as router from './router'
// 路由工厂函数直接导出，方便外部项目使用
export { createRouteInterceptor, createRouterConfig } from './router'

// HTTP 模块
export * as http from './http'

// API 模块 - 提供基础 API 封装,支持外部扩展和覆盖
export * as api from './api'

// 组合函数
export * from './hooks'

// 工具函数
export * from './utils'

// 组件模块
export * from './components'

// 注意：Vite 插件不导出到主入口，避免 Node.js 模块污染浏览器代码
// 使用方式：import { ... } from '@jinghe-sanjiaoroad-app/framework/vite-plugins'