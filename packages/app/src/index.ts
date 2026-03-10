/**
 * jinghe-sanjiaoroad App 框架 - 核心功能导出
 * @description 提供 Vue 3 + UniApp 移动端开发框架的完整功能
 * @module @jinghe-sanjiaoroad-app/app
 */

// 默认导出 - 全局引入的便利性
import * as api from './api'
import * as store from './store'
import * as router from './router'
import { http } from './http'
import * as hooks from './hooks'
import * as utils from './utils'
import * as config from './config'
import * as components from './components'
import * as pages from './pages'
import * as style from './style'
import * as vitePlugins from './vite-plugins'

// 命名空间导出 - 避免命名冲突，支持按需使用
export * as api from './api'
export * as store from './store'
export * as router from './router'
export * from './http'
export * from './hooks'
export * from './utils'
export * from './config'
export * from './components'
export * as pages from './pages'
export * from './style'
export * from './vite-plugins'

// 核心框架对象
const jhApp = {
  api,
  store,
  router,
  http,
  hooks,
  utils,
  config,
  components,
  pages,
  style,
  vitePlugins,
}

export default jhApp
