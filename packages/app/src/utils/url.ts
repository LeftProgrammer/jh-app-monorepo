declare function getApp(): any

/**
 * 设置 tabBar 页面跳转参数（通过 globalData 传递）
 * @param params 参数对象
 */
export function setTabParams(params: Record<string, string>) {
  const app = getApp()
  if (app) {
    app.globalData = app.globalData || {}
    app.globalData.tabParams = params
  }
}

/**
 * 获取并清除 tabBar 页面跳转参数
 * @returns 参数对象，如果没有则返回 undefined
 */
export function getAndClearTabParams(): Record<string, string> | undefined {
  const app = getApp()
  const tabParams = app?.globalData?.tabParams
  if (tabParams) {
    delete app.globalData.tabParams
  }
  return tabParams
}
