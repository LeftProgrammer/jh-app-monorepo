// JH App 框架主入口文件
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 导出类型定义
export * from './types'

// 导出 HTTP 相关
export * from './http/types'
export * from './http/index'
export { requestInterceptor } from './http/interceptor'

// 导出路由相关
export { routeInterceptor, navigateToInterceptor, toLoginPage } from './router/interceptor'
export * from './router/config'

// 导出状态管理
export * from './store/token'
export * from './store/index'

// 导出工具函数
export * from './utils'
export * from './utils/encrypt'
export * from './utils/date'
export * from './utils/storage'
export * from './utils/device'
export * from './utils/validation'

// 导出配置管理
export * from './config'

// 导出组件
export * from './components'

/**
 * 创建 JH App 应用
 */
export function createJhApp(config: any = {}) {
  // 创建 Pinia 实例
  const store = createPinia()

  // 添加数据持久化插件
  store.use(
    createPersistedState({
      storage: {
        getItem: (key: string) => uni.getStorageSync(key),
        setItem: (key: string, value: string) => uni.setStorageSync(key, value),
      },
    }),
  )

  // 立即激活 Pinia 实例
  setActivePinia(store)

  // 返回插件对象
  return {
    install(app: any) {
      app.use(store)
      app.use(routeInterceptor)
      app.use(requestInterceptor)
    },
    store,
    config,
  }
}

/**
 * 创建 Pinia 实例（用于 uni-app）
 */
export function createAppStore() {
  const store = createPinia()
  store.use(
    createPersistedState({
      storage: {
        getItem: (key: string) => uni.getStorageSync(key),
        setItem: (key: string, value: string) => uni.setStorageSync(key, value),
      },
    }),
  )
  setActivePinia(store)
  return store
}

// 默认导出
export default {
  createJhApp,
  createAppStore,
}
