// 路由配置
export const LOGIN_PAGE = '/pages/login/index'
export const HOME_PAGE = '/pages/index/index'
export const NOT_FOUND_PAGE = '/pages/404/index'

// 是否需要登录模式（true: 白名单策略, false: 黑名单策略）
export const isNeedLoginMode = true

// 小程序端是否启用登录页
export const LOGIN_PAGE_ENABLE_IN_MP = false

// 不需要登录的页面列表（白名单）
export const EXCLUDE_LOGIN_PATH_LIST = [
  LOGIN_PAGE,
  '/pages/register/index',
  '/pages/forgot-password/index',
  '/pages/404/index',
  '/pages/about/index',
]
