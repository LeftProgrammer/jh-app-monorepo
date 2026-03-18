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

// ============ 项目级环境配置工具 ============
// 这些函数依赖项目特定的环境变量，因此在项目级实现
export { getEnvBaseUrl, getEnvBaseUrlRoot } from './env'

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

// ============ 透传框架包所有工具函数 ============
export * from '@jinghe-sanjiaoroad-app/framework/utils'
