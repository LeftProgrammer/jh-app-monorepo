// JH App 框架主入口文件
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 导入 uni-app 类型声明
import './types/uni-app'

// 导出类型定义
export type {
  JhAppConfig,
  HttpResponse,
  PaginationParams,
  PaginationResponse,
  RouteMeta,
  UserInfo
} from './types'

// 按模块导出 - 命名空间方式
export * as Http from './http'
export * as Store from './store'
export * as Router from './router'
export * as Utils from './utils'
export * as Config from './config'

// 兼容性导出 - 保持向后兼容
export type {
  CustomRequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor
} from './http/types'
export { http, httpGet, httpPost, httpPut, httpDelete } from './http/index'
export { routeInterceptor, navigateToInterceptor, toLoginPage } from './router/interceptor'
export * from './router/config'
export * from './store/token'
export * from './store/index'
export * from './utils'
export * from './utils/encrypt'
export * from './utils/date'
export * from './config'

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
        getItem: (key: string) => (globalThis as any).uni?.getStorageSync(key),
        setItem: (key: string, value: string) => (globalThis as any).uni?.setStorageSync(key, value),
      },
    }),
  )

  // 立即激活 Pinia 实例
  setActivePinia(store)

  // 返回插件对象
  return {
    install(app: any) {
      app.use(store)
      // 动态导入拦截器，避免循环依赖
      import('./router/interceptor').then(({ routeInterceptor }) => {
        app.use(routeInterceptor)
      })
      import('./http/interceptor').then(({ requestInterceptor }) => {
        app.use(requestInterceptor)
      })
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
        getItem: (key: string) => (globalThis as any).uni?.getStorageSync(key),
        setItem: (key: string, value: string) => (globalThis as any).uni?.setStorageSync(key, value),
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
