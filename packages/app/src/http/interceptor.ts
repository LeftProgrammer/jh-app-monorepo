/**
 * HTTP 请求拦截器模块
 *
 * @description 提供 uni.request 和 uni.uploadFile 的拦截器配置，包括 Token 自动添加、请求参数处理、API 加密等功能
 * @export httpInterceptor - 拦截器配置对象
 * @export requestInterceptor - 拦截器安装器
 * @usage 请求拦截、Token 管理、参数处理、API 加密
 */
/* eslint-disable brace-style */ // 原因：unibest 官方维护的代码，尽量不要大概，避免难以合并
import type { CustomRequestOptions } from './types'
import { isH5 } from '@uni-helper/uni-env'
import { getBaseUrl, getProxyPrefix, isProxyEnabled, isTenantEnabled } from '../config/framework'
import { useTokenStore, useUserStore } from '../store'
import { ApiEncrypt } from '../utils/encrypt'
import { stringifyQuery } from './tools/queryString'

const whiteList: string[] = [
  '/login',
  '/refresh-token',
  '/system/tenant/get-id-by-name',
] // 白名单列表，不需要传递 token 字段

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = stringifyQuery(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      }
      else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // 使用运行时检测替代条件编译，以支持 npm 包发布
      if (isH5 && isProxyEnabled()) {
        // H5 环境且开启代理：自动拼接代理前缀
        options.url = getProxyPrefix() + options.url
      }
      else {
        // 其他情况：正常拼接 baseUrl
        options.url = getBaseUrl() + options.url
      }
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 60000 // 60s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      ...options.header,
    }
    // 3. 添加 token 请求头标识
    const tokenStore = useTokenStore()
    const token = tokenStore.validToken
    let isToken = (options!.header || {}).isToken === false

    for (const v of whiteList) {
      if (options.url && options.url.includes(v)) {
        isToken = false
        break
      }
    }
    if (!isToken && token) {
      options.header.Authorization = `Bearer ${token}`
    }

    // 4. 添加租户标识
    if (isTenantEnabled()) {
      const userStore = useUserStore()
      const tenantId = userStore.tenantId
      if (tenantId) {
        options.header['tenant-id'] = String(tenantId)
      }
    }

    // 5. add by panda：是否 API 加密
    if (options.isEncrypt) {
      try {
        // 加密请求数据
        if (options.data) {
          options.data = ApiEncrypt.encryptRequest(options.data)
          // 设置加密标识头
          options.header[ApiEncrypt.getEncryptHeader()] = 'true'
        }
      } catch (error) {
        console.error('请求数据加密失败:', error)
        throw error
      }
    }

    return options
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
