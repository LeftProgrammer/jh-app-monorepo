/**
 * 组合函数模块
 * @description 提供常用的 Vue 3 组合函数
 * @usage 直接导入需要的函数或 Hook
 *
 * @example
 * // 导入 Hook
 * import { useAccess, useRequest, useScroll, useUpload } from '@jinghe-sanjiaoroad-app/framework/hooks'
 *
 * // 导入字典工具函数
 * import { getDictLabel, getDictOptions, getIntDictOptions, getStrDictOptions } from '@jinghe-sanjiaoroad-app/framework/hooks'
 */

// ============ 权限相关 ============
export { default as useAccess } from './useAccess'

// ============ 字典相关 ============
// 导出所有字典工具函数（常用）
export {
  getBoolDictOptions,
  getDictLabel,
  getDictObj,
  getDictOptions,
  getIntDictOptions,
  getStrDictOptions,
} from './useDict'

// 导出类型
export type {
  DictDataType,
  NumberDictDataType,
  StringDictDataType,
} from './useDict'

// ============ 请求相关 ============
export { default as useRequest } from './useRequest'

// ============ 滚动相关 ============
export { useScroll } from './useScroll'

// ============ 上传相关 ============
export { default as useUpload } from './useUpload'
