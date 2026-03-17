/**
 * 框架包运行时配置模块
 *
 * @description 提供框架包的全局配置管理，采用初始化单例模式
 *              包内部不直接读取环境变量，而是由外部项目在启动时传入配置
 *
 * @example
 * // 外部项目 main.ts 中初始化
 * import { initFramework } from '@jinghe-sanjiaoroad-app/framework'
 *
 * initFramework({
 *   isDoubleTokenMode: import.meta.env.VITE_AUTH_MODE === 'double',
 *   baseUrl: import.meta.env.VITE_SERVER_BASEURL,
 *   // ... 其他配置
 * })
 */

/**
 * 框架配置接口
 * @description 定义所有需要外部项目传入的配置项
 */
export interface FrameworkConfig {
  /** 是否为双 Token 模式（true=双token，false=单token） */
  isDoubleTokenMode?: boolean
  /** API 基础地址 */
  baseUrl?: string
  /** 租户 ID */
  tenantId?: string | number
  /** 是否开启调试日志 */
  debugLog?: boolean
}

/**
 * 默认配置
 */
const defaultConfig: FrameworkConfig = {
  isDoubleTokenMode: false,
  baseUrl: '',
  tenantId: '',
  debugLog: false,
}

/**
 * 框架配置单例（内部使用）
 */
let _frameworkConfig: FrameworkConfig = { ...defaultConfig }

/**
 * 配置是否已初始化标记
 */
let _initialized = false

/**
 * 初始化框架配置
 * @description 外部项目在启动时调用此方法传入配置
 * @param config 框架配置对象
 *
 * @example
 * // main.ts
 * import { initFramework } from '@jinghe-sanjiaoroad-app/framework'
 *
 * initFramework({
 *   isDoubleTokenMode: import.meta.env.VITE_AUTH_MODE === 'double',
 *   baseUrl: import.meta.env.VITE_SERVER_BASEURL,
 * })
 */
export function initFramework(config: FrameworkConfig): void {
  _frameworkConfig = { ...defaultConfig, ...config }
  _initialized = true

  if (_frameworkConfig.debugLog) {
    console.log('[Framework] 配置已初始化:', _frameworkConfig)
  }
}

/**
 * 获取框架配置
 * @description 包内部使用此方法获取配置，不直接读取环境变量
 * @returns 当前框架配置
 */
export function getFrameworkConfig(): FrameworkConfig {
  if (!_initialized) {
    console.warn(
      '[Framework] 警告: 框架配置尚未初始化，请在项目入口调用 initFramework()',
    )
  }
  return { ..._frameworkConfig }
}

/**
 * 更新框架配置（部分更新）
 * @description 运行时动态更新配置
 * @param config 要更新的配置项
 */
export function updateFrameworkConfig(config: Partial<FrameworkConfig>): void {
  _frameworkConfig = { ..._frameworkConfig, ...config }

  if (_frameworkConfig.debugLog) {
    console.log('[Framework] 配置已更新:', _frameworkConfig)
  }
}

/**
 * 重置框架配置为默认值
 * @description 主要用于测试
 */
export function resetFrameworkConfig(): void {
  _frameworkConfig = { ...defaultConfig }
  _initialized = false
}

// ============================================================
// 便捷访问器（包内部常用配置的快捷方式）
// ============================================================

/**
 * 是否为双 Token 模式
 * @description 包内部使用此 getter 获取配置值
 */
export function isDoubleTokenMode(): boolean {
  return _frameworkConfig.isDoubleTokenMode ?? false
}

/**
 * 获取 API 基础地址
 */
export function getBaseUrl(): string {
  return _frameworkConfig.baseUrl ?? ''
}

/**
 * 是否开启调试日志
 */
export function isDebugLog(): boolean {
  return _frameworkConfig.debugLog ?? false
}
