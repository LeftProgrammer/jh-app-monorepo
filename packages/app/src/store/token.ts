import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', {
  state: () => ({
    token: '',
    refreshToken: '',
    tokenExpireTime: 0,
  }),

  getters: {
    // 是否已登录
    hasLogin: (state) => !!state.token,
    // 有效token
    validToken: (state) => {
      if (!state.token) return ''
      // 检查token是否过期
      if (state.tokenExpireTime > 0 && Date.now() > state.tokenExpireTime) {
        return ''
      }
      return state.token
    },
  },

  actions: {
    // 设置token
    setToken(token: string, refreshToken?: string, expireTime?: number) {
      this.token = token
      if (refreshToken) {
        this.refreshToken = refreshToken
      }
      if (expireTime) {
        this.tokenExpireTime = expireTime
      }
    },

    // 清除token
    clearToken() {
      this.token = ''
      this.refreshToken = ''
      this.tokenExpireTime = 0
    },

    // 刷新token
    async refreshTokenAction() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }
      
      try {
        // 这里应该调用刷新token的API
        // const response = await refreshTokenAPI(this.refreshToken)
        // this.setToken(response.data.token, response.data.refreshToken, response.data.expireTime)
        // return response.data
        
        // 临时实现
        console.log('Refresh token action called')
        return null
      } catch (error) {
        this.clearToken()
        throw error
      }
    },
  },

  persist: {
    key: 'jh-app-token-store',
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: string) => uni.setStorageSync(key, value),
    },
  },
})
