/**
 * Playground 项目的 utils 模块
 *
 * 注意：由于 pages.json 包含注释且被 gitignore，不能直接导入
 * 所有需要 pages 配置的函数都直接使用框架包的实现
 */

// ============ 项目级环境配置工具 ============
// 这些函数依赖项目特定的环境变量，因此在项目级实现
export { getEnvBaseUrl, getEnvBaseUrlRoot, isDoubleTokenMode } from './env'

// ============ 透传框架包所有通用工具 ============
// 包含: getAllPages, getHomePage, redirectAfterLogin, navigateBackPlus,
//       getLastPage, currRoute, parseUrlToObj, isPageTabbar,
//       getNavbarHeight, deepClone, formatDate, formatDateTime,
//       DICT_TYPE, isMobile, debounce, AES, handleTree 等...
export * from '@jinghe-sanjiaoroad-app/framework/utils'

// ============ 项目级常量和配置 ============

/**
 * 首页路径
 * 注意：这里硬编码，避免导入 pages.json
 * 如果需要动态获取，请在使用时调用 getHomePage(pagesConfig)
 */
export const HOME_PAGE = '/pages/index/index'
