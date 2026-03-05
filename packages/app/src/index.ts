// JH App 框架 - 核心功能导出

// API 接口 - 命名空间导出避免冲突
export * as api from './api'

// 状态管理 - 命名空间导出避免冲突
export * as store from './store'

// HTTP 模块
export * from './http'

// 路由管理
export * from './router'

// 组件模块
export * from './components'

// 布局模块
export * from './layouts'

// 底部导航栏模块
export * from './tabbar'

// 组合函数
export * from './hooks'

// 工具函数
export * from './utils'

// 样式模块
export * from './style'

export * from './vite-plugins'

// 版本信息
export const version = '1.0.0'
