// ============================================================
// 页面路径常量（项目自定义）
// ============================================================
import { HOME_PAGE } from '@/utils' // 从 utils 导入动态计算的首页路径

export const LOGIN_PAGE = '/pages-core/auth/login'
export const REGISTER_PAGE = '/pages-core/auth/register'
export const CODE_LOGIN_PAGE = '/pages-core/auth/code-login'
export const FORGET_PASSWORD_PAGE = '/pages-core/auth/forget-password'
export const NOT_FOUND_PAGE = '/pages-core/error/404'
export const ONLY_PC_PAGE = '/pages-core/error/only-pc'

// ============================================================
// 路由拦截配置（项目自定义，由 interceptor.ts 传入框架包）
// ============================================================

// 登录策略：true = 白名单（默认需要登录），false = 黑名单（默认不需要登录）
export const IS_NEED_LOGIN_MODE = true // 管理后台，默认需要登录

// 排除列表：白名单模式时为免登录路径，黑名单模式时为需登录路径
export const EXCLUDE_LOGIN_PATH_LIST: string[] = [
  // '/pages/xxx/index', // 示例值
]

// 小程序是否使用自定义登录页，false = 使用平台自带登录
export const LOGIN_PAGE_ENABLE_IN_MP = true // 管理后台，小程序也使用自定义登录页

// 运行时路由配置单例（由 createRouterConfig 更新，供框架包内部组件使用）
export const activeRouterConfig = {
  loginPage: LOGIN_PAGE,
  homePage: HOME_PAGE,
  notFoundPage: NOT_FOUND_PAGE,
  isNeedLoginMode: IS_NEED_LOGIN_MODE,
  excludeLoginPathList: EXCLUDE_LOGIN_PATH_LIST,
  loginPageEnableInMp: LOGIN_PAGE_ENABLE_IN_MP,
  debugLog: false,
}
