// 注意：不能从 @/utils 导入，因为会造成循环依赖
// 直接从框架包导入，但框架包的 utils 使用 export * 导出，没有 default
// 所以这里需要特殊处理
import * as frameworkUtils from '@jinghe-sanjiaoroad-app/framework/utils'
/**
 * Playground 项目的 APP 更新模块
 * 使用框架包的 appUpdate 实现，注入本地的 http.get 和配置
 */
import { http } from '@/http/http'

const appUpdateCore = (frameworkUtils as any).default
const getLatestVersion = (frameworkUtils as any).getLatestVersion

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
