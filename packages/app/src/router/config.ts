/**
 * 路由配置模块
 *
 * @description 路由特有的配置和工具
 *              配置访问器统一从 config/framework 导入
 *
 * @example
 * // 获取路由配置
 * import { getLoginPage, isNeedLoginMode } from '@jinghe-sanjiaoroad-app/framework/config/framework'
 */

// 重新导出类型（方便从 router 模块导入）
export type { RouterConfig, RouterDeps } from '../config/framework'

// ============================================================
// 登录策略枚举
// ============================================================

/** 登录策略枚举 */
export const LOGIN_STRATEGY_MAP = {
  /** 黑名单策略，默认可以进入APP */
  DEFAULT_NO_NEED_LOGIN: 0,
  /** 白名单策略，默认不可以进入APP，需要强制登录 */
  DEFAULT_NEED_LOGIN: 1,
}
