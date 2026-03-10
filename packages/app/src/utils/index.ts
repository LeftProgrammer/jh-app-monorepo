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
 * @export getAllPages - 获取所有页面
 * @export getCurrentPageI18nKey - 获取当前页面国际化键
 * @export getEnvBaseUrl - 获取环境基准地址
 * @export getEnvBaseUrlRoot - 获取环境根地址
 * @export isDoubleTokenMode - 是否双 token 模式
 * @export HOME_PAGE - 首页路径
 * @export redirectAfterLogin - 登录后跳转
 * @export navigateBackPlus - 导航返回
 * @export getNavbarHeight - 获取导航栏高度
 * @export deepClone - 深拷贝
 * @usage 页面处理、路由辅助、工具函数
 */
import type {
  PageMetaDatum,
  SubPackages,
} from "@uni-helper/vite-plugin-uni-pages";
import { isMpWeixin } from "@uni-helper/uni-env";
import { isPageTabbarStore } from "../components/tabbar/store";

export type PageInstance = Page.PageInstance<AnyObject, object> & {
  $page: Page.PageInstance<AnyObject, object> & { fullPath: string };
};

// 页面处理工具
export function getPageConfig(pagesConfig?: { pages: PageMetaDatum[], subPackages?: SubPackages[] }) {
  return pagesConfig || { pages: [], subPackages: [] };
}

export function isPageTabbar(pagePath: string, tabbarPages?: string[]): boolean {
  if (!tabbarPages) return false;
  return tabbarPages.some(path => pagePath.includes(path));
}

export function getLastPage() {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages();
  return pages[pages.length - 1] as PageInstance;
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 '/pages/login/login'
 * redirectPath 如 '/pages/demo/base/route-interceptor'
 */
export function currRoute() {
  const lastPage = getLastPage() as PageInstance;
  if (!lastPage) {
    return {
      path: "",
      query: {},
    };
  }
  const fullPath = lastPage.$page.fullPath;
  // console.log('fullPath', fullPath)
  const [path, queryStr] = fullPath.split("?");
  return {
    path,
    query: parseUrlToObj(queryStr),
  };
}

export function ensureDecodeURIComponent(url: string) {
  if (url.startsWith("%")) {
    return ensureDecodeURIComponent(decodeURIComponent(url));
  }
  return url;
}

/**
 * 比如输入url: /pages/login/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/login, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export function parseUrlToObj(url: string) {
  const [path, queryStr] = url.split("?");
  // console.log(path, queryStr)
  const query: Record<string, string> = {};
  if (queryStr) {
    queryStr.split("&").forEach((str) => {
      const [key, val] = str.split("=");
      if (key) {
        query[key] = decodeURIComponent(val);
      }
    });
  }
  return { path, query };
}

/**
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 excludeLoginPath, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 */
export function getAllPages(key?: string) {
  // 这里处理主包
  const mainPages = (pages as PageMetaDatum[])
    .filter((page) => !key || page[key])
    .map((page) => `/${page.path}`);

  // 这里处理分包
  const subPages = (subPackages as SubPackages[]).flatMap((pkg) =>
    (pkg.pages || []).map((page) => `/${pkg.root}/${page.path}`),
  );

  const result = [...mainPages, ...subPages];

  // console.log('getAllPages', result)
  return result;
}

export function getCurrentPageI18nKey() {
  const routeObj = currRoute();
  const currPage = (pages as PageMetaDatum[]).find(
    (page) => `/${page.path}` === routeObj.path,
  );
  return currPage?.i18nKey || "";
}

/**
 * 根据微信小程序当前环境，判断应该获取的 baseUrl
 * 
 * 支持动态环境切换：开发版、测试版、正式版使用不同的 API 地址
 */
export function getEnvBaseUrl() {
  // 请求基准地址
  let baseUrl = import.meta.env.VITE_SERVER_BASEURL;

  // #ifdef MP-WEIXIN
  if (isMpWeixin()) {
    // 微信小程序，根据环境版本动态切换地址
    const { miniProgram: { envVersion } } = uni.getAccountInfoSync();
    
    // 动态构建环境变量名
    const envKey = `VITE_SERVER_BASEURL__WEIXIN_${envVersion.toUpperCase()}`;
    const envBaseUrl = import.meta.env[envKey];
    
    // 使用环境特定地址，如果未配置则使用默认地址
    baseUrl = envBaseUrl || baseUrl;
  }
  // #endif

  return baseUrl;
}

/**
 * 根据环境变量，获取基础路径的根路径，比如 http://localhost:48080
 *
 * add by 芋艿：用户类似 websocket 这种需要根路径的场景
 *
 * @return 根路径
 */
export function getEnvBaseUrlRoot() {
  const baseUrl = getEnvBaseUrl();
  // 提取根路径
  const urlObj = new URL(baseUrl);
  return urlObj.origin;
}

/**
 * 是否是双token模式
 */
export const isDoubleTokenMode = import.meta.env.VITE_AUTH_MODE === "double";

/**
 * 首页路径，通过 page.json 里面的 type 为 home 的页面获取，如果没有，则默认是第一个页面
 * 通常为 /pages/index/index
 */
export const HOME_PAGE = `/${(pages as PageMetaDatum[]).find((page) => page.type === "home")?.path || (pages as PageMetaDatum[])[0].path}`;

/**
 * 登录成功后跳转
 *
 * @author 芋艿
 * @param redirectUrl 重定向地址，为空则跳转到默认首页（HOME_PAGE）
 */
export function redirectAfterLogin(redirectUrl?: string) {
  let path = redirectUrl || HOME_PAGE;
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const { path: _path } = parseUrlToObj(path);
  if (isPageTabbarStore(_path)) {
    uni.switchTab({ url: path });
  } else {
    uni.navigateBack();
  }
}

/**
 * 增强的返回方法
 * 1. 如果存在上一页，则返回上一页
 * 2. 如果不存在上一页，则跳转到传入的 fallbackUrl 地址
 * 3. 如果 fallbackUrl 也不存在，则跳转到首页
 *
 * @author 芋艿
 * @param fallbackUrl 备选跳转地址，当不存在上一页时使用
 */
export function navigateBackPlus(fallbackUrl?: string) {
  const pages = getCurrentPages();
  // 情况一：如果存在上一页（页面栈长度大于 1），则直接返回
  if (pages.length > 1) {
    uni.navigateBack();
    return;
  }

  // 情况二 + 三：不存在上一页，尝试跳转到传入的 fallbackUrl
  let targetUrl = fallbackUrl || HOME_PAGE;
  // 确保路径以 / 开头
  if (!targetUrl.startsWith("/")) {
    targetUrl = `/${targetUrl}`;
  }
  // 解析路径，判断是否是 tabbar 页面
  const { path } = parseUrlToObj(targetUrl);
  if (isPageTabbarStore(path)) {
    uni.switchTab({ url: targetUrl });
  } else {
    uni.reLaunch({ url: targetUrl });
  }
}

/** 获取 wd-navbar 导航栏高度 */
export function getNavbarHeight() {
  const systemInfo = uni.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight || 0;
  // #ifdef MP-WEIXIN
  // 小程序：根据胶囊按钮位置计算导航栏高度，确保内容与胶囊垂直居中
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  // 导航栏高度 = (胶囊顶部到状态栏底部的距离) * 2 + 胶囊高度
  const navBarHeight =
    (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;
  return statusBarHeight + navBarHeight;
  // #endif
  // #ifndef MP-WEIXIN
  // H5/App：状态栏高度 + 导航栏高度（44px）
  return statusBarHeight + 44;
  // #endif
}

/**
 * 深拷贝任意 JS/TS 值
 * @param src  源数据
 * @param wm   内部用，解决循环引用（调用时无需传入）
 * @returns    拷贝后的新值，类型与原值一致
 */
export function deepClone<T>(src: T, wm = new WeakMap<object, any>()): T {
  // 1. 基本类型 / function => 直接返回
  if (Object(src) !== src || typeof src === "function") {
    return src;
  }

  // 2. 已拷贝过（循环引用）=> 返回缓存
  if (wm.has(src as object)) {
    return wm.get(src as object);
  }

  let dst: any;

  // 3. 特殊内置类型
  if (src instanceof Date) {
    dst = new Date(src);
  } else if (src instanceof RegExp) {
    dst = new RegExp(src);
  } else if (src instanceof Map) {
    dst = new Map();
    wm.set(src, dst);
    src.forEach((v, k) => {
      dst.set(deepClone(k, wm), deepClone(v, wm));
    });
    return dst;
  } else if (src instanceof Set) {
    dst = new Set();
    wm.set(src, dst);
    src.forEach((v) => {
      dst.add(deepClone(v, wm));
    });
    return dst;
  } else if (Array.isArray(src)) {
    dst = [];
  } else {
    // 普通对象：保留原型链
    dst = Object.create(Object.getPrototypeOf(src));
  }

  // 4. 记录已拷贝对象
  wm.set(src as object, dst);

  // 5. 拷贝所有自有属性（含 Symbol 键）
  Reflect.ownKeys(src as object).forEach((key) => {
    dst[key] = deepClone((src as any)[key], wm);
  });

  return dst;
}
