/**
 * 框架配置模块
 *
 * @description 项目级框架配置透传
 *              package.json 已配置 exports，可直接导入子路径
 */

export { initFramework } from '@jinghe-sanjiaoroad-app/framework'

export {
  getApiEncryptConfig,
  getBaseUrl,
  getFrameworkConfig,
  getProxyPrefix,
  getStaticBaseUrl,
  getTenantId,
  getUploadType,
  isApiEncryptEnabled,
  isDebugLog,
  isDoubleTokenMode,
  isProxyEnabled,
  isTenantEnabled,
} from '@jinghe-sanjiaoroad-app/framework/config/framework'

export type {
  ApiEncryptConfig,
  FrameworkConfig,
  ProxyConfig,
  StaticConfig,
  TenantConfig,
  UploadConfig,
} from '@jinghe-sanjiaoroad-app/framework/config/framework'
