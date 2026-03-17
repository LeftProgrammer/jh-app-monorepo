/**
 * 路由模块统一导出
 *
 * @description 路由配置已整合到 initFramework()
 *              配置访问器从 @/config/framework 导入
 *              路由拦截器从框架包导入
 */

// 配置访问器（从 config/framework 重新导出）
export {
  getCodeLoginPage,
  getExcludeLoginPathList,
  getForgetPasswordPage,
  getHomePage,
  getLoginPage,
  getLoginPageList,
  getNotFoundPage,
  getOnlyPcPage,
  getRegisterPage,
  getRouterConfig,
  isLoginPageEnableInMp,
  isNeedLoginMode,
} from '@/config/framework'
// 路由拦截器（从框架包导入）
export {
  judgeIsExcludePath,
  navigateToInterceptor,
  routeInterceptor,
} from '@jinghe-sanjiaoroad-app/framework/router'

// 类型导出
export type { RouterConfig, RouterDeps } from '@/config/framework'
