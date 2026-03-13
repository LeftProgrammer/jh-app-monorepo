/**
 * 工具函数模块统一导出
 *
 * @description 提供常用的工具函数，包括页面处理、路由辅助、日期格式化、加解密等功能
 * @export PageInstance - 页面实例类型
 * @export getPageConfig - 获取页面配置
 * @export isPageTabbar - 检查是否为 tabbar 页面
 * @export getLastPage - 获取最后页面
 * @export currRoute - 获取当前路由
 * @export ensureDecodeURIComponent - 确保 URL 解码
 * @export parseUrlToObj - 解析 URL 为对象
 * @export getAllPages - 获取所有页面（参数化）
 * @export getHomePage - 获取首页路径（参数化）
 * @export getCurrentPageI18nKey - 获取当前页面国际化键
 * @export redirectAfterLogin - 登录后跳转（参数化）
 * @export navigateBackPlus - 导航返回（参数化）
 * @export getNavbarHeight - 获取导航栏高度
 * @export deepClone - 深拷贝
 * @usage 页面处理、路由辅助、工具函数
 */
import type {
  PageMetaDatum,
  SubPackages,
} from '@uni-helper/vite-plugin-uni-pages'
import { isMpWeixin } from '@uni-helper/uni-env'
import { isTabBarPage as _isTabBarPage } from '../components/tabbar/config'

// 导出 isPageTabbar，供外部使用
export const isPageTabbar = _isTabBarPage

export type PageInstance = Page.PageInstance<AnyObject, object> & {
  $page: Page.PageInstance<AnyObject, object> & { fullPath: string }
}

// 页面处理工具
export function getPageConfig(pagesConfig?: { pages: PageMetaDatum[], subPackages?: SubPackages[] }) {
  return pagesConfig || { pages: [], subPackages: [] }
}

export function getLastPage() {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1] as PageInstance
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 '/pages/login/login'
 * redirectPath 如 '/pages/demo/base/route-interceptor'
 */
export function currRoute() {
  const lastPage = getLastPage() as PageInstance
  if (!lastPage) {
    return {
      path: '',
      query: {},
    }
  }
  const fullPath = lastPage.$page.fullPath
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  // 直接调用 parseUrlToObj，它会处理有无查询参数的情况
  return parseUrlToObj(fullPath)
}

export function ensureDecodeURIComponent(url: string) {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}

/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/login, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export function parseUrlToObj(url: string) {
  const [path, queryStr] = url.split("?");
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    };
  }
  const query: Record<string, string> = {};
  queryStr.split("&").forEach((item) => {
    const [key, value] = item.split("=");
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value); // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  });
  return { path, query };
}

/**
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 excludeLoginPath, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 *
 * @param pagesConfig 页面配置对象,包含 pages 和 subPackages
 * @param key 可选的过滤键
 * @returns 返回包含 path 属性的对象数组
 */
export function getAllPages(
  pagesConfig?: { pages: PageMetaDatum[], subPackages?: SubPackages[] },
  key?: string,
) {
  // 如果没有传入配置，返回空数组
  if (!pagesConfig) {
    return []
  }

  const mainPages = pagesConfig.pages
    .filter(page => !key || page[key])
    .map(page => ({ path: `/${page.path}` }))

  const subPages = (pagesConfig.subPackages || []).flatMap(pkg =>
    (pkg.pages || []).map(page => ({ path: `/${pkg.root}/${page.path}` })),
  )

  const result = [...mainPages, ...subPages]

  // console.log('getAllPages', result)
  return result
}

/**
 * 获取当前页面的国际化键
 *
 * @param pagesConfig 页面配置对象
 */
export function getCurrentPageI18nKey(pagesConfig: { pages: PageMetaDatum[] }) {
  const routeObj = currRoute()
  const currPage = pagesConfig.pages.find(
    page => `/${page.path}` === routeObj.path,
  )
  return currPage?.i18nKey || ''
}

/**
 * 获取环境基准地址
 * @deprecated 建议项目自行实现或从 router/config 导入 BASE_URL
 */
export function getEnvBaseUrl() {
  return (import.meta as any).env?.VITE_SERVER_BASEURL || 'http://localhost:48080/admin-api'
}

/**
 * 获取环境根地址
 * @deprecated 建议项目自行实现
 */
export function getEnvBaseUrlRoot() {
  const baseUrl = getEnvBaseUrl()
  const urlObj = new URL(baseUrl)
  return urlObj.origin
}

/**
 * 是否是双 token 模式
 * @deprecated 建议项目自行实现或从 router/config 导入 IS_DOUBLE_TOKEN_MODE
 */
export const isDoubleTokenMode = (import.meta as any).env?.VITE_AUTH_MODE === 'double'

/**
 * 获取首页路径
 * 通过 page.json 里面的 type 为 home 的页面获取，如果没有，则默认是第一个页面
 * 通常为 /pages/index/index
 *
 * @param pagesConfig 页面配置对象
 * @returns 首页路径
 */
export function getHomePage(pagesConfig: { pages: PageMetaDatum[] }): string {
  const homePage = pagesConfig.pages.find(page => page.type === 'home')
  return `/${homePage?.path || pagesConfig.pages[0]?.path || 'pages/index/index'}`
}

/**
 * 登录成功后跳转（框架包基础实现）
 *
 * @author 芋艿
 * @param redirectUrl 重定向地址，为空则跳转到首页
 * @param homePage 首页路径，默认为 '/pages/index/index'，项目层应覆盖此函数并注入实际的 HOME_PAGE
 * @internal 此函数应由项目层覆盖，不建议直接使用
 */
export function redirectAfterLogin(
  redirectUrl?: string,
  homePage: string = '/pages/index/index',
) {
  let path = redirectUrl || homePage
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  const { path: _path } = parseUrlToObj(path)
  if (_isTabBarPage(_path)) {
    uni.switchTab({ url: path })
  } else {
    uni.navigateBack()
  }
}

/**
 * 增强的返回方法（框架包基础实现）
 * 1. 如果存在上一页，则返回上一页
 * 2. 如果不存在上一页，则跳转到传入的 fallbackUrl 地址
 * 3. 如果 fallbackUrl 也不存在，则跳转到首页
 *
 * @author 芋艿
 * @param fallbackUrl 备选跳转地址，当不存在上一页时使用
 * @param homePage 首页路径，默认为 '/pages/index/index'，项目层应覆盖此函数并注入实际的 HOME_PAGE
 * @internal 此函数应由项目层覆盖，不建议直接使用
 */
export function navigateBackPlus(
  fallbackUrl?: string,
  homePage: string = '/pages/index/index',
) {
  const pages = getCurrentPages()
  // 情况一：如果存在上一页（页面栈长度大于 1），则直接返回
  if (pages.length > 1) {
    uni.navigateBack()
    return
  }

  // 情况二 + 三：不存在上一页，尝试跳转到传入的 fallbackUrl
  let targetUrl = fallbackUrl || homePage
  // 确保路径以 / 开头
  if (!targetUrl.startsWith('/')) {
    targetUrl = `/${targetUrl}`
  }
  // 解析路径，判断是否是 tabbar 页面
  const { path } = parseUrlToObj(targetUrl)
  if (_isTabBarPage(path)) {
    uni.switchTab({ url: targetUrl })
  } else {
    uni.reLaunch({ url: targetUrl })
  }
}

/** 获取 wd-navbar 导航栏高度 */
export function getNavbarHeight() {
  const systemInfo = uni.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0

  // 使用运行时平台检测替代条件编译，以支持 npm 包发布
  if (isMpWeixin) {
    // 小程序：根据胶囊按钮位置计算导航栏高度，确保内容与胶囊垂直居中
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    // 导航栏高度 = (胶囊顶部到状态栏底部的距离) * 2 + 胶囊高度
    const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height
    return statusBarHeight + navBarHeight
  }

  // H5/App：状态栏高度 + 导航栏高度（44px）
  return statusBarHeight + 44
}

/**
 * 深拷贝任意 JS/TS 值
 * @param src  源数据
 * @param wm   内部用，解决循环引用（调用时无需传入）
 * @returns    拷贝后的新值，类型与原值一致
 */
export function deepClone<T>(src: T, wm = new WeakMap<object, any>()): T {
  // 1. 基本类型 / function => 直接返回
  if (Object(src) !== src || typeof src === 'function') {
    return src
  }

  // 2. 已拷贝过（循环引用）=> 返回缓存
  if (wm.has(src as object)) {
    return wm.get(src as object)
  }

  let dst: any

  // 3. 特殊内置类型
  if (src instanceof Date) {
    dst = new Date(src)
  } else if (src instanceof RegExp) {
    dst = new RegExp(src)
  } else if (src instanceof Map) {
    dst = new Map()
    wm.set(src, dst)
    src.forEach((v, k) => {
      dst.set(deepClone(k, wm), deepClone(v, wm))
    })
    return dst
  } else if (src instanceof Set) {
    dst = new Set()
    wm.set(src, dst)
    src.forEach((v) => {
      dst.add(deepClone(v, wm))
    })
    return dst
  } else if (Array.isArray(src)) {
    dst = []
  } else {
    // 普通对象：保留原型链
    dst = Object.create(Object.getPrototypeOf(src))
  }

  // 4. 记录已拷贝对象
  wm.set(src as object, dst)

  // 5. 拷贝所有自有属性（含 Symbol 键）
  Reflect.ownKeys(src as object).forEach((key) => {
    dst[key] = deepClone((src as any)[key], wm)
  })

  return dst
}

// ==================== 子模块重新导出 ====================
// 以下导出所有子模块的功能，方便使用者直接从主入口导入

// 应用更新
export * from './appUpdate'

// 常量枚举
export * from './constants'

// 日期处理工具
export * from './date'

// 防抖节流
export * from './debounce'

// 文件下载
export * from './download'

// 加密解密
export * from './encrypt'

// 路由辅助
export * from './routerHelper'

// 系统信息
export * from './systemInfo'

// 登录跳转
export * from './toLoginPage'

// 树形数据处理
export * from './tree'

// 微信更新管理
export * from './updateManager.wx'

// 文件上传
export * from './uploadFile'

// URL 处理
export * from './url'

// 表单验证
export * from './validator'
