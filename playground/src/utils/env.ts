/**
 * 环境相关工具函数
 *
 * 这些函数依赖项目特定的环境变量配置，因此放在项目级别而非框架包中
 */
import { isMpWeixin } from '@uni-helper/uni-env'

/**
 * 根据微信小程序当前环境，判断应该获取的 baseUrl
 *
 * 支持动态环境切换：开发版、测试版、正式版使用不同的 API 地址
 */
export function getEnvBaseUrl() {
  const env = import.meta.env
  let baseUrl = env.VITE_SERVER_BASEURL

  // #ifdef MP-WEIXIN
  if (isMpWeixin()) {
    const { miniProgram: { envVersion } } = uni.getAccountInfoSync()
    const envKey = `VITE_SERVER_BASEURL__WEIXIN_${envVersion.toUpperCase()}`
    const envBaseUrl = env[envKey]
    baseUrl = envBaseUrl || baseUrl
  }
  // #endif

  return baseUrl
}

/**
 * 根据环境变量，获取基础路径的根路径，比如 http://localhost:48080
 *
 * add by 芋艿：用于类似 websocket 这种需要根路径的场景
 *
 * @return 根路径
 */
export function getEnvBaseUrlRoot() {
  const baseUrl = getEnvBaseUrl()
  const urlObj = new URL(baseUrl)
  return urlObj.origin
}
