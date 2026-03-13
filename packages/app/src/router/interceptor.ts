/**
 * 路由拦截器模块
 *
 * @description 提供路由拦截、登录验证、页面访问控制等功能，支持黑名单和白名单两种策略
 * @export judgeIsExcludePath - 判断路径是否需要排除登录
 * @export FG_LOG_ENABLE - 调试日志开关
 * @usage 路由拦截、登录验证、页面访问控制
 */
/* eslint-disable brace-style */ // 原因：unibest 官方维护的代码，尽量不要大概，避免难以合并
import { isMp } from '@uni-helper/uni-env'
import { isPageTabbarStore, tabbarStore } from '../components/tabbar/store'
/**
 * by 菲鸽 on 2025-08-19
 * 路由拦截，通常也是登录拦截
 * 黑、白名单的配置，请看 config.ts 文件， EXCLUDE_LOGIN_PATH_LIST
 */
import { useTokenStore } from '../store/token'
import { getAllPages, getLastPage, parseUrlToObj } from '../utils/index'
import { toLoginPage } from '../utils/toLoginPage'
import { activeRouterConfig } from './config'

export const FG_LOG_ENABLE = false

// ============================================================
// 外部项目依赖注入接口及工厂函数
// 外部项目通过 createRouteInterceptor 注入自身依赖，得到路由拦截器实例
// ============================================================

/**
 * 外部项目依赖注入接口（所有字段均可选，不传则使用框架包默认实现）
 */
export interface RouterDeps {
  /** tabbarStore 实例，用于处理 tabbar index 的自动更新。默认使用框架包内置 tabbarStore */
  tabbarStore?: { setAutoCurIdx: (path: string) => void }
  /** 判断路径是否是 tabbar 页面。默认使用框架包内置 isPageTabbarStore */
  isPageTabbar?: (path: string) => boolean
  /** 跳转到登录页的函数。默认使用框架包内置 toLoginPage */
  toLoginPage?: (options?: { mode?: 'navigateTo' | 'reLaunch', queryString?: string }) => void
  /**
   * 获取所有页面（含可选过滤 key）。
   * 框架包本身无 pages.json，默认返回空数组。
   * 外部项目如需支持 `excludeLoginPath` 动态收集，需注入已绑定 pages.json 的版本。
   * 例如 playground/src/utils 中的 getAllPages(key?)
   */
  getAllPages?: (key?: string) => Array<{ path: string }>
}

/**
 * 创建路由拦截器（工厂函数，供外部项目使用）
 * @description 传入路由配置（由 createRouterConfig 创建），可选传入依赖覆盖，得到路由拦截器实例。
 *              不传 deps 时，使用框架包内置的 tabbarStore、toLoginPage 等默认实现。
 * @param config 路由配置
 * @param deps 可选依赖覆盖
 * @returns { navigateToInterceptor, routeInterceptor, judgeIsExcludePath }
 * @example 最简用法（不传 deps）
 * ```ts
 * // src/router/interceptor.ts
 * import { createRouteInterceptor, createRouterConfig } from '@jinghe-sanjiaoroad-app/framework'
 * import { LOGIN_PAGE, HOME_PAGE, NOT_FOUND_PAGE, IS_NEED_LOGIN_MODE, EXCLUDE_LOGIN_PATH_LIST, LOGIN_PAGE_ENABLE_IN_MP } from './config'
 *
 * const config = createRouterConfig({ loginPage: LOGIN_PAGE, homePage: HOME_PAGE, notFoundPage: NOT_FOUND_PAGE,
 *   isNeedLoginMode: IS_NEED_LOGIN_MODE, excludeLoginPathList: EXCLUDE_LOGIN_PATH_LIST, loginPageEnableInMp: LOGIN_PAGE_ENABLE_IN_MP })
 * export const { navigateToInterceptor, routeInterceptor, judgeIsExcludePath } = createRouteInterceptor(config)
 * ```
 * @example 传入 getAllPages 以支持 excludeLoginPath 动态收集
 * ```ts
 * import { getAllPages } from '@/utils'
 * export const { navigateToInterceptor, routeInterceptor, judgeIsExcludePath } =
 *   createRouteInterceptor(config, { getAllPages })
 * ```
 */
export function createRouteInterceptor(config: import('./config').RouterConfig, deps: RouterDeps = {}) {
  const {
    loginPage,
    homePage,
    notFoundPage,
    isNeedLoginMode: _isNeedLoginMode,
    excludeLoginPathList,
    loginPageEnableInMp,
    debugLog = false,
  } = config

  const _tabbarStore = deps.tabbarStore ?? tabbarStore
  const _isPageTabbar = deps.isPageTabbar ?? isPageTabbarStore
  const _toLoginPage = deps.toLoginPage ?? toLoginPage
  const _getAllPages = deps.getAllPages ?? ((key?: string) => getAllPages(undefined, key))

  let _excludeListInited = false

  function _judgeIsExcludePath(path: string): boolean {
    const isDev = import.meta.env.DEV
    if (!isDev) {
      if (!_excludeListInited) {
        const pages = _getAllPages('excludeLoginPath')
        pages.forEach((page) => {
          if (!excludeLoginPathList.includes(page.path)) {
            excludeLoginPathList.push(page.path)
          }
        })
        _excludeListInited = true
      }
      return excludeLoginPathList.includes(path)
    }
    const allExcludeLoginPages = _getAllPages('excludeLoginPath')
    return excludeLoginPathList.includes(path) || (isDev && allExcludeLoginPages.some(page => page.path === path))
  }

  const _navigateToInterceptor = {
    invoke({ url, query }: { url: string, query?: Record<string, string> }) {
      if (url === undefined) {
        return
      }
      let { path, query: _query } = parseUrlToObj(url)

      debugLog && console.log('\n\n路由拦截器:-------------------------------------')
      debugLog && console.log('路由拦截器 1: url->', url, ', query ->', query)
      const myQuery = { ..._query, ...query }
      debugLog && console.log('路由拦截器 2: path->', path, ', _query ->', _query)
      debugLog && console.log('路由拦截器 3: myQuery ->', myQuery)

      if (!path.startsWith('/')) {
        const currentPath = getLastPage()?.route || ''
        const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
        const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
        path = `${baseDir}/${path}`
      }

      if (path !== '/' && !_getAllPages().some(page => page.path === path)) {
        console.warn('路由不存在:', path)
        uni.navigateTo({ url: notFoundPage })
        return false
      }

      if (url.startsWith('plugin://')) {
        debugLog && console.log('路由拦截器 4: plugin:// 路径 ==>', url)
        path = url
      }

      _tabbarStore.setAutoCurIdx(path)

      if (isMp && !loginPageEnableInMp) {
        return true
      }

      const tokenStore = useTokenStore()
      debugLog && console.log('tokenStore.hasLogin:', tokenStore.hasLogin)

      if (tokenStore.hasLogin) {
        if (path !== loginPage) {
          return true
        }
        else {
          console.log('已经登录，但是还在登录页', myQuery.redirect)
          const url = myQuery.redirect || homePage
          if (_isPageTabbar(url)) {
            uni.switchTab({ url })
          }
          else {
            uni.navigateTo({ url })
          }
          return false
        }
      }

      let fullPath = path
      if (Object.keys(myQuery).length) {
        fullPath += `?${Object.keys(myQuery).map(key => `${key}=${myQuery[key]}`).join('&')}`
      }
      const redirectQuery = `?redirect=${encodeURIComponent(fullPath)}`

      // #region 1/2 默认需要登录的情况(白名单策略)
      if (_isNeedLoginMode) {
        if (_judgeIsExcludePath(path)) {
          return true
        }
        else {
          if (path === loginPage) {
            return true
          }
          debugLog && console.log('1 isNeedLogin(白名单策略) url:', fullPath)
          _toLoginPage({ queryString: redirectQuery })
          return false
        }
      }
      // #endregion

      // #region 2/2 默认不需要登录的情况(黑名单策略)
      else {
        if (_judgeIsExcludePath(path)) {
          debugLog && console.log('2 isNeedLogin(黑名单策略) url:', fullPath)
          _toLoginPage({ queryString: redirectQuery })
          return false
        }
        return true
      }
      // #endregion
    },
  }

  const _routeInterceptor = {
    install() {
      uni.addInterceptor('navigateTo', _navigateToInterceptor)
      uni.addInterceptor('reLaunch', _navigateToInterceptor)
      uni.addInterceptor('redirectTo', _navigateToInterceptor)
      uni.addInterceptor('switchTab', _navigateToInterceptor)
    },
  }

  return {
    navigateToInterceptor: _navigateToInterceptor,
    routeInterceptor: _routeInterceptor,
    judgeIsExcludePath: _judgeIsExcludePath,
  }
}

// ============================================================
// 包内部默认实例：使用 activeRouterConfig（由外部项目通过 createRouterConfig 更新）
// ============================================================
const _defaultInstance = createRouteInterceptor(activeRouterConfig)

export const judgeIsExcludePath = _defaultInstance.judgeIsExcludePath
export const navigateToInterceptor = _defaultInstance.navigateToInterceptor
export const routeInterceptor = _defaultInstance.routeInterceptor
