/**
 * 状态管理模块统一导出
 *
 * @description 基于 Pinia 的状态管理,包含用户、Token、主题、系统、字典等状态管理
 * @export useTokenStore - Token 状态管理
 * @export useUserStore - 用户状态管理
 * @export useThemeStore - 主题状态管理
 * @export useSystemState - 系统状态管理
 * @export useGlobalState - 全局状态管理
 * @export useDictStore - 字典状态管理
 * @export tokenStores - Token 模块命名空间
 * @export userStores - 用户模块命名空间
 * @export themeStores - 主题模块命名空间
 * @export systemStores - 系统模块命名空间
 * @export globalStores - 全局模块命名空间
 * @export dictStores - 字典模块命名空间
 * @usage 状态管理、数据持久化、用户认证、主题切换
 *
 * @note 架构说明：
 *       - 框架包只导出 store 模块定义,不创建 Pinia 实例
 *       - Pinia 实例和持久化配置由使用方(如 playground)创建
 *       - 这样可以避免 uni 等运行时对象在构建时不存在的问题
 */

// Store 模块导出 - 按字母顺序排列，保持一致性
export { useDictStore } from './dict'
export * as dictStores from './dict'

export { useGlobalState } from './global'
export * as globalStores from './global'

export { useSystemState } from './system'
export * as systemStores from './system'

export { useThemeStore } from './theme'
export * as themeStores from './theme'

export { useTokenStore } from './token'
export * as tokenStores from './token'

export { useUserStore } from './user'
export * as userStores from './user'
