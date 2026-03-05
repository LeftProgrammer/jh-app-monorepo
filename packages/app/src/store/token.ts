import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isDoubleTokenMode } from '../utils'

// Token 信息接口
export interface IAuthLoginRes {
  // 单 token 模式
  token?: string
  expiresIn?: number
  // 双 token 模式
  accessToken?: string
  refreshToken?: string
  expiresTime?: number
}

// 类型判断函数
export const isSingleTokenRes = (res: IAuthLoginRes): res is IAuthLoginRes & { token: string; expiresIn: number } => {
  return !!(res.token && res.expiresIn)
}

export const isDoubleTokenRes = (res: IAuthLoginRes): res is IAuthLoginRes & { accessToken: string; refreshToken: string; expiresTime: number } => {
  return !!(res.accessToken && res.refreshToken && res.expiresTime)
}

// 初始化状态
const tokenInfoState = isDoubleTokenMode()
  ? {
      accessToken: '',
      refreshToken: '',
      expiresTime: 0,
    }
  : {
      token: '',
      expiresIn: 0,
    }

export const useTokenStore = defineStore('token', () => {
  // 定义用户信息
  const tokenInfo = ref<IAuthLoginRes>({ ...tokenInfoState })

  // 设置用户信息
  const setTokenInfo = (val: IAuthLoginRes) => {
    tokenInfo.value = val

    // 计算并存储过期时间
    const now = Date.now()
    if (isSingleTokenRes(val)) {
      // 单token模式
      const expireTime = now + val.expiresIn * 1000
      uni.setStorageSync('accessTokenExpireTime', expireTime)
    } else if (isDoubleTokenRes(val)) {
      // 双token模式
      const accessExpireTime = val.expiresTime
      uni.setStorageSync('accessTokenExpireTime', accessExpireTime)
    }
  }

  /**
   * 判断token是否过期
   */
  const isTokenExpired = computed(() => {
    if (!tokenInfo.value) {
      return true
    }

    const now = Date.now()
    const expireTime = uni.getStorageSync('accessTokenExpireTime')

    if (!expireTime) return true
    return now >= expireTime
  })

  /**
   * 判断refreshToken是否过期
   */
  const isRefreshTokenExpired = computed(() => {
    if (!isDoubleTokenMode()) return true
    // 目前后端没有返回 refreshToken 的过期时间，所以这里暂时不做过期判断，先全部返回 false 非过期
    return false
  })

  /**
   * 登录成功后处理逻辑
   */
  async function postLoginAction(tokenInfoParam: IAuthLoginRes) {
    // 设置认证信息
    setTokenInfo(tokenInfoParam)

    // 这里可以添加获取用户信息等逻辑
    // const userStore = useUserStore()
    // await userStore.fetchUserInfo()
    // const globalState = useGlobalState()
    // await globalState.fetchGlobalInfo()
    // const dictStore = useDictStore()
    // dictStore.loadDictCache().then()
  }

  /**
   * 用户登录
   */
  const login = async (loginForm: any) => {
    try {
      // 这里应该调用登录API
      // const res = await loginApi(loginForm)
      // await postLoginAction(res)

      // 临时模拟
      const mockTokenInfo: IAuthLoginRes = {
        token: 'mock-token',
        expiresIn: 7200 // 2小时
      }
      await postLoginAction(mockTokenInfo)

      return mockTokenInfo
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  /**
   * 用户退出登录
   */
  const logout = async () => {
    try {
      // 这里可以调用退出登录API
      // await logoutApi()

      // 清除本地存储
      uni.removeStorageSync('accessTokenExpireTime')

      // 重置状态
      tokenInfo.value = { ...tokenInfoState }

      // 清除其他相关状态
      // const userStore = useUserStore()
      // userStore.clearUserInfo()
      // const dictStore = useDictStore()
      // dictStore.clearDictCache()
    } catch (error) {
      console.error('退出登录失败:', error)
      // 即使API调用失败，也要清除本地状态
      tokenInfo.value = { ...tokenInfoState }
    }
  }

  /**
   * 刷新token
   */
  const refreshToken = async () => {
    if (!isDoubleTokenMode()) {
      console.error('单token模式不支持刷新token')
      throw new Error('单token模式不支持刷新token')
    }

    try {
      // 安全检查，确保refreshToken存在
      if (!isDoubleTokenRes(tokenInfo.value) || !tokenInfo.value.refreshToken) {
        throw new Error('无效的refreshToken')
      }

      const refreshTokenValue = tokenInfo.value.refreshToken
      // 这里应该调用刷新token的API
      // const res = await refreshTokenApi(refreshTokenValue)
      // await postLoginAction(res)

      // 临时模拟
      const mockTokenInfo: IAuthLoginRes = {
        accessToken: 'new-access-token',
        refreshToken: refreshTokenValue,
        expiresTime: Date.now() + 7200 * 1000
      }
      await postLoginAction(mockTokenInfo)

      return mockTokenInfo
    } catch (error) {
      console.error('刷新token失败:', error)
      throw error
    }
  }

  /**
   * 获取有效的token
   */
  const getValidToken = computed(() => {
    // token已过期，返回空
    if (isTokenExpired.value) {
      return ''
    }

    if (!isDoubleTokenMode()) {
      return isSingleTokenRes(tokenInfo.value) ? tokenInfo.value.token : ''
    } else {
      return isDoubleTokenRes(tokenInfo.value) ? tokenInfo.value.accessToken : ''
    }
  })

  /**
   * 检查是否有登录信息（不考虑token是否过期）
   */
  const hasLoginInfo = computed(() => {
    if (!tokenInfo.value) {
      return false
    }
    if (isDoubleTokenMode()) {
      return isDoubleTokenRes(tokenInfo.value) && !!tokenInfo.value.accessToken
    } else {
      return isSingleTokenRes(tokenInfo.value) && !!tokenInfo.value.token
    }
  })

  /**
   * 检查是否已登录且token有效
   */
  const hasValidLogin = computed(() => {
    if (isDoubleTokenMode()) {
      // 双令牌场景下，以刷新令牌过期为准。而刷新令牌是否过期，通过请求时返回 401 来判断
      return hasLoginInfo.value
    }
    return hasLoginInfo.value && !isTokenExpired.value
  })

  /**
   * 是否已登录
   */
  const hasLogin = computed(() => {
    return hasValidLogin.value
  })

  /**
   * 有效token
   */
  const validToken = computed(() => {
    return getValidToken.value
  })

  /**
   * 清除token
   */
  const clearToken = () => {
    tokenInfo.value = { ...tokenInfoState }
    uni.removeStorageSync('accessTokenExpireTime')
  }

  /**
   * 尝试获取有效的token，如果过期且可刷新，则刷新token
   * @returns 有效的token或空字符串
   */
  const tryGetValidToken = async (): Promise<string> => {
    if (
      !getValidToken.value &&
      isDoubleTokenMode() &&
      !isRefreshTokenExpired.value
    ) {
      try {
        await refreshToken()
        return getValidToken.value
      } catch (error) {
        console.error("尝试刷新token失败:", error)
        return ""
      }
    }
    return getValidToken.value
  }

  /**
   * 微信登录
   */
  const wxLogin = async () => {
    try {
      // 这里应该调用微信登录API
      // const res = await _wxLogin()
      // await postLoginAction(res)

      // 临时模拟
      const mockTokenInfo: IAuthLoginRes = {
        accessToken: 'wx-access-token',
        refreshToken: 'wx-refresh-token',
        expiresTime: Date.now() + 7200 * 1000
      }
      await postLoginAction(mockTokenInfo)

      return mockTokenInfo
    } catch (error) {
      console.error('微信登录失败:', error)
      throw error
    }
  }

  return {
    // 核心API方法
    login,
    wxLogin,
    logout,

    // 认证状态判断（最常用的）
    hasLogin: hasValidLogin,

    // 内部系统使用的方法
    refreshToken,
    tryGetValidToken,
    validToken: getValidToken,

    // 调试或特殊场景可能需要直接访问的信息
    tokenInfo,
    setTokenInfo,
  }
}, {
  // 添加持久化配置，确保刷新页面后token信息不丢失
  persist: true,
})
