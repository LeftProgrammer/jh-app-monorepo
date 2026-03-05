// 导出所有 Store 模块
export { useTokenStore } from './token'
export { useUserStore } from './user'
export { useGlobalState } from './global'
export { useDictStore } from './dict'
export { useSystemState } from './system'
export { useThemeStore } from './theme'

// 导出类型
export type { DictItem, DictCache } from './dict'
export type { IAuthLoginRes } from './token'
export type { IUserInfoRes, AuthPermissionInfo } from './user'
