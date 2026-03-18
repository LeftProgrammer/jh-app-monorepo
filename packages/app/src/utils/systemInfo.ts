/**
 * 系统信息工具
 *
 * 注意：所有 uni API 调用都延迟到函数调用时执行，
 * 避免模块加载时立即执行导致 Node.js 构建环境报错
 */

// 缓存系统信息，避免重复调用
let _systemInfo: UniApp.GetSystemInfoResult | null = null
let _safeAreaInsets: UniApp.SafeAreaInsets | null = null

/**
 * 获取系统信息（延迟加载，带缓存）
 */
export function getSystemInfo(): UniApp.GetSystemInfoResult {
  if (_systemInfo) {
    return _systemInfo
  }

  // #ifdef MP-WEIXIN
  // 微信小程序使用新的API
  _systemInfo = uni.getWindowInfo() as unknown as UniApp.GetSystemInfoResult
  // #endif

  // #ifndef MP-WEIXIN
  // 其他平台继续使用uni API
  _systemInfo = uni.getSystemInfoSync()
  // #endif

  return _systemInfo
}

/**
 * 获取安全区域边距（延迟加载，带缓存）
 */
export function getSafeAreaInsets(): UniApp.SafeAreaInsets | null {
  if (_safeAreaInsets !== null) {
    return _safeAreaInsets
  }

  const info = getSystemInfo()

  // #ifdef MP-WEIXIN
  // 微信小程序从 safeArea 计算
  if (info.safeArea) {
    _safeAreaInsets = {
      top: info.safeArea.top,
      right: info.windowWidth - info.safeArea.right,
      bottom: info.windowHeight - info.safeArea.bottom,
      left: info.safeArea.left,
    }
  } else {
    _safeAreaInsets = null
  }
  // #endif

  // #ifndef MP-WEIXIN
  // 其他平台直接使用 safeAreaInsets
  _safeAreaInsets = info.safeAreaInsets || null
  // #endif

  return _safeAreaInsets
}

// 向后兼容：导出 getter 属性（延迟求值）
// 注意：这些是函数调用，不是直接的值
export const systemInfo = {
  get value() {
    return getSystemInfo()
  },
}

export const safeAreaInsets = {
  get value() {
    return getSafeAreaInsets()
  },
}
