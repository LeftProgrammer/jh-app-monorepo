/**
 * 路由拦截器
 *
 * @description 基于框架包 createRouteInterceptor 工厂函数，注入项目路由配置
 * 黑、白名单的配置，请看 config.ts 文件，EXCLUDE_LOGIN_PATH_LIST
 */
import { createRouteInterceptor, createRouterConfig } from '@jinghe-sanjiaoroad-app/framework'
import { getAllPages, HOME_PAGE } from '@/utils'
import { EXCLUDE_LOGIN_PATH_LIST, IS_NEED_LOGIN_MODE, LOGIN_PAGE, LOGIN_PAGE_ENABLE_IN_MP, NOT_FOUND_PAGE } from './config'

const routerConfig = createRouterConfig({
  loginPage: LOGIN_PAGE,
  homePage: HOME_PAGE,
  notFoundPage: NOT_FOUND_PAGE,
  isNeedLoginMode: IS_NEED_LOGIN_MODE,
  excludeLoginPathList: EXCLUDE_LOGIN_PATH_LIST,
  loginPageEnableInMp: LOGIN_PAGE_ENABLE_IN_MP,
})

export const { navigateToInterceptor, routeInterceptor, judgeIsExcludePath } = createRouteInterceptor(routerConfig, {
  getAllPages,
})

// 调试日志开关（供框架包内部组件使用）
export const FG_LOG_ENABLE = false
