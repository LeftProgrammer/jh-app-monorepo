/**
 * 组合函数模块
 * @description 提供常用的 Vue 3 组合函数
 * @usage 直接导入需要的函数或 Hook
 *
 * @example
 * // 权限控制
 * import { useAccess } from '@jinghe-sanjiaoroad-app/framework/hooks'
 * const { hasPermission, hasRole } = useAccess()
 *
 * // 模板中使用（全平台兼容，包括小程序）
 * // <button v-if="hasPermission('system:user:update')">编辑</button>
 * // <button v-if="hasRole('admin')">管理</button>
 *
 * // 导入字典工具函数
 * import { getDictLabel, getDictOptions } from '@jinghe-sanjiaoroad-app/framework/hooks'
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
export type { DictDataType, NumberDictDataType, StringDictDataType } from './useDict'

// ============ 请求相关 ============
export { default as useRequest } from './useRequest'

// ============ 滚动相关 ============
export { useScroll } from './useScroll'

// ============ 上传相关 ============
export { default as useUpload } from './useUpload'
