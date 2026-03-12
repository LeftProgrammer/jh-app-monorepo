/**
 * Playground 项目的 APP 更新模块
 * 使用框架包的 appUpdate 实现，注入本地的 http.get 和配置
 */
import appUpdateCore, { getLatestVersion } from '@jinghe-sanjiaoroad-app/framework/utils'
import { http } from '@/http/http'

const { VITE_SERVER_BASEURL } = import.meta.env
const APP_ID = 'test001'

/**
 * APP 更新检查
 */
export default async function appUpdate() {
  return appUpdateCore(APP_ID, http.get.bind(http), VITE_SERVER_BASEURL)
}

// 同时导出 getLatestVersion 供其他模块使用
export { getLatestVersion }
