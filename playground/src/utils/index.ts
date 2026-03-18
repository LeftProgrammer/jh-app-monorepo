/**
 * Playground 项目的 utils 模块
 *
 * 说明：
 * - 大部分工具函数直接从框架包透传
 * - getAllPages/getHomePage 需要注入 pages.json，在此处覆盖实现
 * - getEnvBaseUrl 依赖项目环境变量，在此处实现
 */
import type { PageMetaDatum } from '@uni-helper/vite-plugin-uni-pages'
import {
  getAllPages as _getAllPages,
  getHomePage as _getHomePage,
} from '@jinghe-sanjiaoroad-app/framework/utils'

// 动态导入 pages.json（由 vite 插件生成）
import { pages, subPackages } from '@/pages.json'

// ============ 需要注入 pages.json 的函数 ============

/**
 * 获取所有页面
 * 覆盖框架包实现，自动注入本地 pages.json 配置
 * 保持与原始项目一致的调用方式（无需传参）
 */
export function getAllPages(key?: string) {
  return _getAllPages({ pages: pages as PageMetaDatum[], subPackages: subPackages as any }, key)
}

/**
 * 获取首页路径
 * 覆盖框架包实现，自动注入本地 pages.json 配置
 */
export function getHomePage() {
  return _getHomePage({ pages: pages as PageMetaDatum[] })
}

/**
 * 首页路径常量
 * 动态计算自 pages.json，与原始项目保持一致
 */
export const HOME_PAGE = getHomePage()

// ============ 项目级环境配置工具 ============
/**
 * 根据微信小程序当前环境，判断应该获取的 baseUrl
 *
 * 支持动态环境切换：开发版、测试版、正式版使用不同的 API 地址
 */
export function getEnvBaseUrl() {
  const env = import.meta.env
  let baseUrl = env.VITE_SERVER_BASEURL

  // #ifdef MP-WEIXIN
  const { miniProgram: { envVersion } } = uni.getAccountInfoSync()
  const envKey = `VITE_SERVER_BASEURL__WEIXIN_${envVersion.toUpperCase()}`
  const envBaseUrl = env[envKey]
  baseUrl = envBaseUrl || baseUrl
  // #endif

  return baseUrl
}

/**
 * 根据环境变量，获取基础路径的根路径，比如 http://localhost:48080
 *
 * add by 芋艿：用于类似 websocket 这种需要根路径的场景
 *
 * @return 根路径
 */
export function getEnvBaseUrlRoot() {
  const baseUrl = getEnvBaseUrl()
  const urlObj = new URL(baseUrl)
  return urlObj.origin
}

// ============ 透传框架包所有工具函数 ============
export * from '@jinghe-sanjiaoroad-app/framework/utils'
