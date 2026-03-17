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
 * API 加密配置接口
 */
export interface ApiEncryptConfig {
  /** 是否启用 API 加密 */
  enable?: boolean
  /** 加密请求头名称 */
  header?: string
  /** 加密算法: 'AES' | 'RSA' */
  algorithm?: 'AES' | 'RSA'
  /** 请求加密密钥（AES密钥 或 RSA公钥） */
  requestKey?: string
  /** 响应解密密钥（AES密钥 或 RSA私钥） */
  responseKey?: string
}

/**
 * 上传配置接口
 */
export interface UploadConfig {
  /** 上传类型: 'server' | 'client' */
  type?: 'server' | 'client'
}

/**
 * 静态资源配置接口
 */
export interface StaticConfig {
  /** 静态资源基础 URL */
  baseUrl?: string
}

/**
 * HTTP 代理配置接口
 */
export interface ProxyConfig {
  /** 是否启用代理（仅 H5 环境生效） */
  enable?: boolean
  /** 代理前缀 */
  prefix?: string
}

/**
 * 租户配置接口
 */
export interface TenantConfig {
  /** 是否启用租户 */
  enable?: boolean
  /** 默认租户 ID */
  id?: string | number
}

/**
 * 框架配置接口
 * @description 定义所有需要外部项目传入的配置项
 */
export interface FrameworkConfig {
  /** 是否为双 Token 模式（true=双token，false=单token） */
  isDoubleTokenMode?: boolean
  /** API 基础地址 */
  baseUrl?: string
  /** 是否开启调试日志 */
  debugLog?: boolean
  /** API 加密配置 */
  apiEncrypt?: ApiEncryptConfig
  /** 上传配置 */
  upload?: UploadConfig
  /** 静态资源配置 */
  static?: StaticConfig
  /** HTTP 代理配置 */
  proxy?: ProxyConfig
  /** 租户配置 */
  tenant?: TenantConfig
}

/**
 * 默认配置
 */
const defaultConfig: FrameworkConfig = {
  isDoubleTokenMode: false,
  baseUrl: '',
  debugLog: false,
  apiEncrypt: {
    enable: false,
    header: 'X-Api-Encrypt',
    algorithm: 'AES',
    requestKey: '',
    responseKey: '',
  },
  upload: {
    type: 'server',
  },
  static: {
    baseUrl: '',
  },
  proxy: {
    enable: false,
    prefix: '/api',
  },
  tenant: {
    enable: false,
    id: '',
  },
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

// ============================================================
// API 加密配置访问器
// ============================================================

/**
 * 获取 API 加密配置
 */
export function getApiEncryptConfig(): ApiEncryptConfig {
  return _frameworkConfig.apiEncrypt ?? defaultConfig.apiEncrypt!
}

/**
 * 是否启用 API 加密
 */
export function isApiEncryptEnabled(): boolean {
  return _frameworkConfig.apiEncrypt?.enable ?? false
}

/**
 * 获取加密请求头名称
 */
export function getApiEncryptHeader(): string {
  return _frameworkConfig.apiEncrypt?.header ?? 'X-Api-Encrypt'
}

/**
 * 获取加密算法
 */
export function getApiEncryptAlgorithm(): 'AES' | 'RSA' {
  return _frameworkConfig.apiEncrypt?.algorithm ?? 'AES'
}

/**
 * 获取请求加密密钥
 */
export function getApiEncryptRequestKey(): string {
  return _frameworkConfig.apiEncrypt?.requestKey ?? ''
}

/**
 * 获取响应解密密钥
 */
export function getApiEncryptResponseKey(): string {
  return _frameworkConfig.apiEncrypt?.responseKey ?? ''
}

// ============================================================
// 上传配置访问器
// ============================================================

/**
 * 获取上传类型
 */
export function getUploadType(): 'server' | 'client' {
  return _frameworkConfig.upload?.type ?? 'server'
}

// ============================================================
// 静态资源配置访问器
// ============================================================

/**
 * 获取静态资源基础 URL
 */
export function getStaticBaseUrl(): string {
  return _frameworkConfig.static?.baseUrl ?? ''
}

// ============================================================
// 代理配置访问器
// ============================================================

/**
 * 是否启用代理
 */
export function isProxyEnabled(): boolean {
  return _frameworkConfig.proxy?.enable ?? false
}

/**
 * 获取代理前缀
 */
export function getProxyPrefix(): string {
  return _frameworkConfig.proxy?.prefix ?? '/api'
}

// ============================================================
// 租户配置访问器
// ============================================================

/**
 * 是否启用租户
 */
export function isTenantEnabled(): boolean {
  return _frameworkConfig.tenant?.enable ?? false
}

/**
 * 获取租户 ID
 */
export function getTenantId(): string | number {
  return _frameworkConfig.tenant?.id ?? ''
}
