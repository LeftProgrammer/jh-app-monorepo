/**
 * 路由模块统一导出
 *
 * @description 提供路由配置、登录策略、路由拦截等功能
 * @export routerConfig - 路由配置命名空间
 * @export routerInterceptor - 路由拦截器命名空间
 * @usage 登录策略配置、路由拦截、页面访问控制
 */
// 路由模块统一导出
export * from './config'
// 命名空间导出 - 避免命名冲突
export * as routerConfig from './config'

export * from './interceptor'
export * as routerInterceptor from './interceptor'
