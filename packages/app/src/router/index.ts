/**
 * 路由模块统一导出
 *
 * @description 提供路由拦截器和路由特有工具
 *              配置访问器请从 config 导入
 *
 * @example
 * // 外部项目 main.ts 中配置
 * initFramework({
 *   router: {
 *     loginPage: '/pages-core/auth/login',
 *     homePage: '/pages/home/index',
 *     isNeedLoginMode: true,
 *   },
 *   routerDeps: { getAllPages }
 * })
 *
 * // 使用路由拦截器
 * import { routeInterceptor } from '@jinghe-sanjiaoroad-app/framework/router'
 * app.use(routeInterceptor)
 *
 * // 获取路由配置（从 config 导入）
 * import { getLoginPage, isNeedLoginMode } from '@jinghe-sanjiaoroad-app/framework/config'
 */

// 类型导出
export type { RouterConfig, RouterDeps } from './config'

// 路由特有工具
export { LOGIN_STRATEGY_MAP } from './config'

// 路由拦截器
export {
  judgeIsExcludePath,
  navigateToInterceptor,
  routeInterceptor,
} from './interceptor'
