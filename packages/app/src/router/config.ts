/**
 * 路由配置模块
 *
 * @description 提供登录策略配置、页面路径定义、路由白名单等功能
 * @export LOGIN_STRATEGY_MAP - 登录策略枚举
 * @export LOGIN_STRATEGY - 当前登录策略
 * @export LOGIN_PAGE - 登录页面路径
 * @export REGISTER_PAGE - 注册页面路径
 * @export EXCLUDE_LOGIN_PATH_LIST - 排除登录路径列表
 * @export LOGIN_PAGE_ENABLE_IN_MP - 小程序登录页启用配置
 * @usage 登录策略配置、页面路径管理、路由访问控制
 */
// import { getAllPages } from '@/utils'

export const LOGIN_STRATEGY_MAP = {
  DEFAULT_NO_NEED_LOGIN: 0, // 黑名单策略，默认可以进入APP
  DEFAULT_NEED_LOGIN: 1, // 白名单策略，默认不可以进入APP，需要强制登录
}
// TODO: 1/3 登录策略，默认使用`无需登录策略`，即默认不需要登录就可以访问
export const LOGIN_STRATEGY = LOGIN_STRATEGY_MAP.DEFAULT_NEED_LOGIN // edit by 芋艿：管理后台，默认需要登录
export const isNeedLoginMode
  = LOGIN_STRATEGY === LOGIN_STRATEGY_MAP.DEFAULT_NEED_LOGIN

export const LOGIN_PAGE = '/pages-core/auth/login' // edit by 芋艿：自定义了登录页路径
export const REGISTER_PAGE = '/pages-core/auth/register' // edit by 芋艿：自定义了注册页路径
export const CODE_LOGIN_PAGE = '/pages-core/auth/code-login' // edit by 芋艿：自定义了短信登录页路径
export const FORGET_PASSWORD_PAGE = '/pages-core/auth/forget-password' // edit by 芋艿：自定义了忘记密码页路径
export const NOT_FOUND_PAGE = '/pages-core/error/404' // edit by 芋艿：调整 404 页面路径
export const ONLY_PC_PAGE = '/pages-core/error/only-pc' // edit by 芋艿：新增仅 PC 端访问提示页面路径
export const HOME_PAGE = '/pages/index/index' // 默认首页路径，项目可以覆盖此配置

// 环境配置（项目可以覆盖）
export const BASE_URL = import.meta.env?.VITE_SERVER_BASEURL || 'http://localhost:48080/admin-api'
export const IS_DOUBLE_TOKEN_MODE = import.meta.env?.VITE_AUTH_MODE === 'double'

// TODO @芋艿：【优化】貌似 unibest 这个变量没用？！
export const LOGIN_PAGE_LIST = [
  LOGIN_PAGE,
  REGISTER_PAGE,
  CODE_LOGIN_PAGE,
  FORGET_PASSWORD_PAGE,
]

// 注释 by 芋艿：在 mp 环境下，getAllPages 函数还没初始化好，所以不能直接调用。统一优化到 judgeIsExcludePath 函数里面去获取
// 在 definePage 里面配置了 excludeLoginPath 的页面，功能与 EXCLUDE_LOGIN_PATH_LIST 相同
// export const excludeLoginPathList = getAllPages('excludeLoginPath').map(
//   page => page.path,
// )

// 排除在外的列表，白名单策略指白名单列表，黑名单策略指黑名单列表
// TODO: 2/3 在 definePage 配置 excludeLoginPath，或者在下面配置 EXCLUDE_LOGIN_PATH_LIST
export const EXCLUDE_LOGIN_PATH_LIST = [
  '/pages/xxx/index', // 示例值
  '/pages-sub/xxx/index', // 示例值
  // 注释 by 芋艿：在 mp 环境下，getAllPages 函数还没初始化好，所以不能直接调用。统一优化到 judgeIsExcludePath 函数里面去获取
  // ...excludeLoginPathList, // 都是以 / 开头的 path
]

// 在小程序里面是否使用H5的登录页，默认为 false
// 如果为 true 则复用 h5 的登录逻辑
// TODO: 3/3 确定自己的登录页是否需要在小程序里面使用
export const LOGIN_PAGE_ENABLE_IN_MP = true // edit by 芋艿：管理后台，小程序也使用自定义登录页

// ============================================================
// 以下为供外部项目使用的接口类型和工厂函数
// ============================================================

/**
 * 路由配置接口（供外部项目使用）
 * @description 外部项目通过此接口定义路由配置，传入 createRouteInterceptor
 */
export interface RouterConfig {
  /** 登录页路径 */
  loginPage: string
  /** 首页路径 */
  homePage: string
  /** 404 页面路径 */
  notFoundPage: string
  /** 是否为白名单登录模式（true=默认需要登录，false=默认不需要登录） */
  isNeedLoginMode: boolean
  /** 排除登录路径列表（白名单模式下为白名单，黑名单模式下为黑名单） */
  excludeLoginPathList: string[]
  /** 小程序是否启用自定义登录页 */
  loginPageEnableInMp: boolean
  /** 是否开启调试日志 */
  debugLog?: boolean
}

/**
 * 运行时可更新的路由配置单例（包内部使用，外部项目不应直接访问）
 * @description 包内部消费者（toLoginPage、tabbar 等）应读取此单例而非静态常量，
 *              外部项目调用 createRouterConfig 后，此单例会被更新，确保行为一致
 * @internal
 */
export const activeRouterConfig: RouterConfig = {
  loginPage: LOGIN_PAGE,
  homePage: HOME_PAGE,
  notFoundPage: NOT_FOUND_PAGE,
  isNeedLoginMode,
  excludeLoginPathList: EXCLUDE_LOGIN_PATH_LIST,
  loginPageEnableInMp: LOGIN_PAGE_ENABLE_IN_MP,
  debugLog: false,
}

/**
 * 创建路由配置（工厂函数，供外部项目使用）
 * @description 外部项目使用此函数，将项目的路由常量整合为 RouterConfig 对象，
 *              同时更新包内活动配置单例，确保 toLoginPage、tabbar 等内部消费者行为一致
 * @example
 * const config = createRouterConfig({
 *   loginPage: LOGIN_PAGE,
 *   homePage: HOME_PAGE,
 *   notFoundPage: NOT_FOUND_PAGE,
 *   isNeedLoginMode,
 *   excludeLoginPathList: EXCLUDE_LOGIN_PATH_LIST,
 *   loginPageEnableInMp: LOGIN_PAGE_ENABLE_IN_MP,
 * })
 */
export function createRouterConfig(config: RouterConfig): RouterConfig {
  Object.assign(activeRouterConfig, config)
  return config
}
