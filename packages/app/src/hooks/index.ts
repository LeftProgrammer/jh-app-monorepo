/**
 * 组合函数模块
 * 
 * @description 提供常用的 Vue 3 组合函数
 * @usage 按命名空间导入，避免命名冲突
 */

// 权限相关
export * as hooksAccess from './useAccess'

// 字典相关
export * as hooksDict from './useDict'

// 请求相关
export * as hooksRequest from './useRequest'

// 滚动相关
export * as hooksScroll from './useScroll'

// 上传相关
export * as hooksUpload from './useUpload'

// 便捷的默认导出（主要 Hook）
export { default as useAccess } from './useAccess'
export { default as useDict } from './useDict'
export { default as useRequest } from './useRequest'
export { default as useScroll } from './useScroll'
export { default as useUpload } from './useUpload'