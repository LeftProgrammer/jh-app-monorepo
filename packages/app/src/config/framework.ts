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
 * 路由配置接口
 */
export interface RouterConfig {
  /** 登录页路径 */
  loginPage?: string
  /** 首页路径 */
  homePage?: string
  /** 404 页面路径 */
  notFoundPage?: string
  /** 注册页路径 */
  registerPage?: string
  /** 短信登录页路径 */
  codeLoginPage?: string
  /** 忘记密码页路径 */
  forgetPasswordPage?: string
  /** 仅 PC 端访问提示页路径 */
  onlyPcPage?: string
  /** 是否为白名单登录模式（true=默认需要登录，false=默认不需要登录） */
  isNeedLoginMode?: boolean
  /** 排除登录路径列表（白名单模式下为免登录路径，黑名单模式下为需登录路径） */
  excludeLoginPathList?: string[]
  /** 小程序是否启用自定义登录页 */
  loginPageEnableInMp?: boolean
}

/**
 * 路由依赖注入接口
 * @description 外部项目可注入自定义实现
 */
export interface RouterDeps {
  /** 获取所有页面（含可选过滤 key），用于支持 excludeLoginPath 动态收集 */
  getAllPages?: (key?: string) => Array<{ path: string }>
  /** tabbarStore 实例，用于处理 tabbar index 的自动更新 */
  tabbarStore?: { setAutoCurIdx: (path: string) => void }
  /** 判断路径是否是 tabbar 页面 */
  isPageTabbar?: (path: string) => boolean
  /** 跳转到登录页的函数 */
  toLoginPage?: (options?: { mode?: 'navigateTo' | 'reLaunch', queryString?: string }) => void
}

/**
 * 框架配置接口
 * @description 定义所有需要外部项目传入的配置项
 */
export interface FrameworkConfig {
  /** 应用标题 */
  appTitle?: string
  /** 应用 Logo 路径 */
  appLogo?: string
  /** 是否为双 Token 模式（true=双token，false=单token） */
  isDoubleTokenMode?: boolean
  /** API 基础地址 */
  baseUrl?: string
  /** 是否开启调试日志 */
  debugLog?: boolean
  /** API 加密配置 */
  apiEncrypt?: ApiEncryptConfig
  /** 上传类型: 'server' | 'client' */
  uploadType?: 'server' | 'client'
  /** 静态资源基础 URL */
  staticBaseUrl?: string
  /** 是否启用代理（仅 H5 环境生效） */
  proxyEnable?: boolean
  /** 代理前缀 */
  proxyPrefix?: string
  /** 是否启用租户 */
  tenantEnable?: boolean
  /** 默认租户 ID（用于登录时的默认选择） */
  defaultTenantId?: string | number
  /** 是否启用验证码 */
  captchaEnable?: boolean
  /** 路由配置 */
  router?: RouterConfig
  /** 路由依赖注入 */
  routerDeps?: RouterDeps
}

/**
 * 默认配置
 */
/**
 * 默认路由配置
 */
const defaultRouterConfig: RouterConfig = {
  loginPage: '/pages/login/index',
  homePage: '/pages/index/index',
  notFoundPage: '/pages/error/404',
  registerPage: '/pages/register/index',
  codeLoginPage: '/pages/code-login/index',
  forgetPasswordPage: '/pages/forget-password/index',
  onlyPcPage: '/pages/error/only-pc',
  isNeedLoginMode: true,
  excludeLoginPathList: [],
  loginPageEnableInMp: true,
}

const defaultConfig: FrameworkConfig = {
  appTitle: '',
  appLogo: '/static/logo.svg',
  isDoubleTokenMode: false,
  baseUrl: '',
  uploadType: 'server',
  staticBaseUrl: '',
  proxyEnable: false,
  proxyPrefix: '/api',
  tenantEnable: false,
  defaultTenantId: '',
  captchaEnable: false,
  debugLog: false,
  apiEncrypt: {
    enable: false,
    header: 'X-Api-Encrypt',
    algorithm: 'AES',
    requestKey: '',
    responseKey: '',
  },
  router: { ...defaultRouterConfig },
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

/**
 * 获取应用标题
 */
export function getAppTitle(): string {
  return _frameworkConfig.appTitle ?? ''
}

/**
 * 获取应用 Logo 路径
 */
export function getAppLogo(): string {
  return _frameworkConfig.appLogo ?? '/static/logo.svg'
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
  return _frameworkConfig.uploadType ?? 'server'
}

// ============================================================
// 静态资源配置访问器
// ============================================================

/**
 * 获取静态资源基础 URL
 */
export function getStaticBaseUrl(): string {
  return _frameworkConfig.staticBaseUrl ?? ''
}

// ============================================================
// 代理配置访问器
// ============================================================

/**
 * 是否启用代理
 */
export function isProxyEnabled(): boolean {
  return _frameworkConfig.proxyEnable ?? false
}

/**
 * 获取代理前缀
 */
export function getProxyPrefix(): string {
  return _frameworkConfig.proxyPrefix ?? '/api'
}

// ============================================================
// 租户配置访问器
// ============================================================

/**
 * 是否启用租户
 */
export function isTenantEnabled(): boolean {
  return _frameworkConfig.tenantEnable ?? false
}

/**
 * 获取默认租户 ID（用于登录时的默认选择）
 */
export function getDefaultTenantId(): string | number {
  return _frameworkConfig.defaultTenantId ?? ''
}

// ============================================================
// 路由配置访问器
// ============================================================

/**
 * 获取路由配置
 */
export function getRouterConfig(): RouterConfig {
  return _frameworkConfig.router ?? defaultRouterConfig
}

/**
 * 获取路由依赖
 */
export function getRouterDeps(): RouterDeps {
  return _frameworkConfig.routerDeps ?? {}
}

/**
 * 获取登录页路径
 */
export function getLoginPage(): string {
  return _frameworkConfig.router?.loginPage ?? defaultRouterConfig.loginPage!
}

/**
 * 获取首页路径
 */
export function getHomePage(): string {
  return _frameworkConfig.router?.homePage ?? defaultRouterConfig.homePage!
}

/**
 * 获取 404 页面路径
 */
export function getNotFoundPage(): string {
  return _frameworkConfig.router?.notFoundPage ?? defaultRouterConfig.notFoundPage!
}

/**
 * 获取注册页路径
 */
export function getRegisterPage(): string {
  return _frameworkConfig.router?.registerPage ?? defaultRouterConfig.registerPage!
}

/**
 * 获取短信登录页路径
 */
export function getCodeLoginPage(): string {
  return _frameworkConfig.router?.codeLoginPage ?? defaultRouterConfig.codeLoginPage!
}

/**
 * 获取忘记密码页路径
 */
export function getForgetPasswordPage(): string {
  return _frameworkConfig.router?.forgetPasswordPage ?? defaultRouterConfig.forgetPasswordPage!
}

/**
 * 获取仅 PC 端访问提示页路径
 */
export function getOnlyPcPage(): string {
  return _frameworkConfig.router?.onlyPcPage ?? defaultRouterConfig.onlyPcPage!
}

/**
 * 是否为白名单登录模式
 */
export function isNeedLoginMode(): boolean {
  return _frameworkConfig.router?.isNeedLoginMode ?? defaultRouterConfig.isNeedLoginMode!
}

/**
 * 获取排除登录路径列表
 */
export function getExcludeLoginPathList(): string[] {
  return _frameworkConfig.router?.excludeLoginPathList ?? []
}

/**
 * 小程序是否启用自定义登录页
 */
export function isLoginPageEnableInMp(): boolean {
  return _frameworkConfig.router?.loginPageEnableInMp ?? defaultRouterConfig.loginPageEnableInMp!
}

/**
 * 获取登录页列表
 */
export function getLoginPageList(): string[] {
  return [
    getLoginPage(),
    getRegisterPage(),
    getCodeLoginPage(),
    getForgetPasswordPage(),
  ]
}

// ============================================================
// 验证码配置访问器
// ============================================================

/**
 * 是否启用验证码
 */
export function isCaptchaEnabled(): boolean {
  return _frameworkConfig.captchaEnable ?? false
}
