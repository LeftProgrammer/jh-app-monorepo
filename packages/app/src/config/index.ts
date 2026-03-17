/**
 * 配置模块统一导出
 * 使用方式：
 * import { manifestConfig, pagesConfig, unoConfig } from '@jinghe-sanjiaoroad-app/framework/config'
 * import { initFramework, getFrameworkConfig } from '@jinghe-sanjiaoroad-app/framework/config'
 */

// 框架运行时配置（核心）
export {
  getBaseUrl,
  getFrameworkConfig,
  initFramework,
  isDebugLog,
  isDoubleTokenMode,
  resetFrameworkConfig,
  updateFrameworkConfig,
} from './framework'
export type { FrameworkConfig } from './framework'

// 构建配置
export { manifestConfig } from './manifest'
export { pagesConfig } from './pages'
export { unoConfig } from './uno'
