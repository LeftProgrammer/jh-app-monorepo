/**
 * jinghe-sanjiaoroad App 框架 - 主入口
 *
 * 推荐使用子路径导入（如 /store、/http），主入口适合快速使用。
 * Vite 插件不在此导出，请从 '@jinghe-sanjiaoroad-app/framework/vite-plugins' 导入。
 */

// API 模块（命名空间导出，避免与业务 API 冲突）
export * as api from './api'

// 组件模块（jh-xxx 组件 + Tabbar）
export * from './components'

// 框架配置（核心，必须在项目入口最先调用）
export { getFrameworkConfig, initFramework, updateFrameworkConfig } from './config'
export type { ApiEncryptConfig, FrameworkConfig, RouterConfig, RouterDeps } from './config'

// 组合函数（权限/字典/请求/分页/上传）
export * from './hooks'

// HTTP 模块（命名空间 + 常用 API 直接导出）
export * as http from './http'
export { http as httpRequest, requestInterceptor } from './http'
export type { CustomRequestOptions, IResponse, PageParam, PageResult } from './http'

// 路由管理（命名空间 + 常用 API 直接导出）
export * as router from './router'
export { judgeIsExcludePath, LOGIN_STRATEGY_MAP, navigateToInterceptor, routeInterceptor } from './router'

// 状态管理（命名空间 + Store 直接导出）
export * as store from './store'
export {
  useDictStore,
  useGlobalState,
  useSystemState,
  useThemeStore,
  useTokenStore,
  useUserStore,
} from './store'

// 工具函数
export * from './utils'
