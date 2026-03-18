/**
 * 路由拦截器模块
 *
 * @description 提供路由拦截、登录验证、页面访问控制等功能
 *              配置通过 initFramework() 传入，自动创建拦截器实例
 *
 * @example
 * // 外部项目 main.ts 中配置
 * initFramework({
 *   router: {
 *     loginPage: '/pages-core/auth/login',
 *     homePage: '/pages/index/index',
 *     isNeedLoginMode: true,
 *   },
 *   routerDeps: {
 *     getAllPages, // 注入项目的 getAllPages 函数
 *   }
 * })
 *
 * // 外部项目 router/index.ts 中直接导出
 * export { routeInterceptor } from '@jinghe-sanjiaoroad-app/framework/router'
 */
/* eslint-disable brace-style */
import type { RouterConfig, RouterDeps } from '../config/framework'
import { isMp } from '@uni-helper/uni-env'
import {
  getExcludeLoginPathList,
  getHomePage,
  getLoginPage,
  getNotFoundPage,
  getRouterDeps,
  isDebugLog,
  isLoginPageEnableInMp,
  isNeedLoginMode,
} from '../config/framework'
import { useTokenStore } from '../store/token'
import { getAllPages as _getAllPages, getLastPage, parseUrlToObj } from '../utils/index'
import { toLoginPage as _toLoginPage } from '../utils/toLoginPage'

// tabbarStore 和 isPageTabbar 从路由依赖中获取（由外部项目注入）
// 提供默认的空实现，避免未注入时报错
const defaultTabbarStore = {
  curIdx: 0,
  prevIdx: 0,
  setCurIdx: () => {},
  setTabbarItemBadge: () => {},
  setAutoCurIdx: () => {},
  restorePrevIdx: () => {},
}

function getTabbarStore() {
  const deps = getRouterDeps()
  return deps.tabbarStore ?? defaultTabbarStore
}

function getIsPageTabbar() {
  const deps = getRouterDeps()
  return deps.isPageTabbar ?? (() => false)
}

// 重新导出类型
export type { RouterConfig, RouterDeps } from '../config/framework'

/** @deprecated 使用 isDebugLog() 替代 */
export const FG_LOG_ENABLE = false

// ============================================================
// 内部拦截器实现（使用配置访问器）
// ============================================================

let _excludeListInited = false
let _excludeLoginPathListCache: string[] = []

/**
 * 判断路径是否需要排除登录
 */
function _judgeIsExcludePath(path: string): boolean {
  const deps = getRouterDeps()
  const getAllPagesFn = deps.getAllPages ?? ((key?: string) => _getAllPages(undefined, key))
  const excludeLoginPathList = getExcludeLoginPathList()

  const isDev = import.meta.env.DEV
  if (!isDev) {
    if (!_excludeListInited) {
      _excludeLoginPathListCache = [...excludeLoginPathList]
      const pages = getAllPagesFn('excludeLoginPath')
      pages.forEach((page) => {
        if (!_excludeLoginPathListCache.includes(page.path)) {
          _excludeLoginPathListCache.push(page.path)
        }
      })
      _excludeListInited = true
    }
    return _excludeLoginPathListCache.includes(path)
  }
  const allExcludeLoginPages = getAllPagesFn('excludeLoginPath')
  return excludeLoginPathList.includes(path) || (isDev && allExcludeLoginPages.some(page => page.path === path))
}

/**
 * 导航拦截器
 */
const _navigateToInterceptor = {
  invoke({ url, query }: { url: string, query?: Record<string, string> }) {
    if (url === undefined) {
      return
    }

    const deps = getRouterDeps()
    const debugLog = isDebugLog()
    const loginPage = getLoginPage()
    const homePage = getHomePage()
    const notFoundPage = getNotFoundPage()
    const loginPageEnableInMp = isLoginPageEnableInMp()
    const _isNeedLoginMode = isNeedLoginMode()

    const _tabbarStore = deps.tabbarStore ?? getTabbarStore()
    const _isPageTabbar = deps.isPageTabbar ?? getIsPageTabbar()
    const toLoginPageFn = deps.toLoginPage ?? _toLoginPage
    const getAllPagesFn = deps.getAllPages ?? ((key?: string) => _getAllPages(undefined, key))

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

    if (path !== '/' && !getAllPagesFn().some(page => page.path === path)) {
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
        const redirectUrl = myQuery.redirect || homePage
        if (_isPageTabbar(redirectUrl)) {
          uni.switchTab({ url: redirectUrl })
        }
        else {
          uni.navigateTo({ url: redirectUrl })
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
        toLoginPageFn({ queryString: redirectQuery })
        return false
      }
    }
    // #endregion

    // #region 2/2 默认不需要登录的情况(黑名单策略)
    else {
      if (_judgeIsExcludePath(path)) {
        debugLog && console.log('2 isNeedLogin(黑名单策略) url:', fullPath)
        toLoginPageFn({ queryString: redirectQuery })
        return false
      }
      return true
    }
    // #endregion
  },
}

// ============================================================
// 导出路由拦截器实例
// ============================================================

/**
 * 路由拦截器
 * @description 在 main.ts 中调用 routeInterceptor.install() 安装
 */
export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', _navigateToInterceptor)
    uni.addInterceptor('reLaunch', _navigateToInterceptor)
    uni.addInterceptor('redirectTo', _navigateToInterceptor)
    uni.addInterceptor('switchTab', _navigateToInterceptor)
  },
}

/**
 * 导航拦截器（供高级用法）
 */
export const navigateToInterceptor = _navigateToInterceptor

/**
 * 判断路径是否需要排除登录
 */
export const judgeIsExcludePath = _judgeIsExcludePath

// ============================================================
// 兼容性：保留 createRouteInterceptor 工厂函数
// ============================================================

/**
 * 创建路由拦截器（兼容性函数）
 * @deprecated 建议直接使用 routeInterceptor，配置通过 initFramework() 传入
 */
export function createRouteInterceptor(config: RouterConfig, deps: RouterDeps = {}) {
  console.warn('[Router] createRouteInterceptor 已弃用，建议直接使用 routeInterceptor，配置通过 initFramework() 传入')

  const {
    loginPage,
    homePage,
    notFoundPage,
    isNeedLoginMode: _isNeedLoginMode,
    excludeLoginPathList = [],
    loginPageEnableInMp,
  } = config

  const debugLog = isDebugLog()
  const _tabbarStore = deps.tabbarStore ?? getTabbarStore()
  const _isPageTabbar = deps.isPageTabbar ?? getIsPageTabbar()
  const toLoginPageFn = deps.toLoginPage ?? _toLoginPage
  const getAllPagesFn = deps.getAllPages ?? ((key?: string) => _getAllPages(undefined, key))

  let _excludeListInitedLocal = false
  const _excludeListLocal = [...excludeLoginPathList]

  function judgeIsExcludePathLocal(path: string): boolean {
    const isDev = import.meta.env.DEV
    if (!isDev) {
      if (!_excludeListInitedLocal) {
        const pages = getAllPagesFn('excludeLoginPath')
        pages.forEach((page) => {
          if (!_excludeListLocal.includes(page.path)) {
            _excludeListLocal.push(page.path)
          }
        })
        _excludeListInitedLocal = true
      }
      return _excludeListLocal.includes(path)
    }
    const allExcludeLoginPages = getAllPagesFn('excludeLoginPath')
    return _excludeListLocal.includes(path) || (isDev && allExcludeLoginPages.some(page => page.path === path))
  }

  const navigateToInterceptorLocal = {
    invoke({ url, query }: { url: string, query?: Record<string, string> }) {
      if (url === undefined) {
        return
      }
      let { path, query: _query } = parseUrlToObj(url)

      debugLog && console.log('\n\n路由拦截器:-------------------------------------')
      const myQuery = { ..._query, ...query }

      if (!path.startsWith('/')) {
        const currentPath = getLastPage()?.route || ''
        const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
        const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
        path = `${baseDir}/${path}`
      }

      if (path !== '/' && !getAllPagesFn().some(page => page.path === path)) {
        console.warn('路由不存在:', path)
        uni.navigateTo({ url: notFoundPage })
        return false
      }

      if (url.startsWith('plugin://')) {
        path = url
      }

      _tabbarStore.setAutoCurIdx(path)

      if (isMp && !loginPageEnableInMp) {
        return true
      }

      const tokenStore = useTokenStore()

      if (tokenStore.hasLogin) {
        if (path !== loginPage) {
          return true
        }
        else {
          const redirectUrl = myQuery.redirect || homePage
          if (_isPageTabbar(redirectUrl)) {
            uni.switchTab({ url: redirectUrl })
          }
          else {
            uni.navigateTo({ url: redirectUrl })
          }
          return false
        }
      }

      let fullPath = path
      if (Object.keys(myQuery).length) {
        fullPath += `?${Object.keys(myQuery).map(key => `${key}=${myQuery[key]}`).join('&')}`
      }
      const redirectQuery = `?redirect=${encodeURIComponent(fullPath)}`

      if (_isNeedLoginMode) {
        if (judgeIsExcludePathLocal(path)) {
          return true
        }
        else {
          if (path === loginPage) {
            return true
          }
          toLoginPageFn({ queryString: redirectQuery })
          return false
        }
      }
      else {
        if (judgeIsExcludePathLocal(path)) {
          toLoginPageFn({ queryString: redirectQuery })
          return false
        }
        return true
      }
    },
  }

  const routeInterceptorLocal = {
    install() {
      uni.addInterceptor('navigateTo', navigateToInterceptorLocal)
      uni.addInterceptor('reLaunch', navigateToInterceptorLocal)
      uni.addInterceptor('redirectTo', navigateToInterceptorLocal)
      uni.addInterceptor('switchTab', navigateToInterceptorLocal)
    },
  }

  return {
    navigateToInterceptor: navigateToInterceptorLocal,
    routeInterceptor: routeInterceptorLocal,
    judgeIsExcludePath: judgeIsExcludePathLocal,
  }
}
