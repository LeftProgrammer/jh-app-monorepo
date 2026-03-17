/**
 * Playground Store 入口
 *
 * @description 创建 Pinia 实例并配置持久化,导出框架包的 store 模块
 * @note 框架包只提供 store 模块定义,Pinia 实例由应用层创建
 */
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const store = createPinia()

// 配置持久化插件
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

// 立即激活 Pinia 实例, 这样即使在 app.use(store)之前调用 store 也能正常工作 （解决APP端白屏问题）
setActivePinia(store)

// 默认导出 Pinia 实例
export default store

// 统一导出所有 store 模块（从框架包导出）
export * from '@jinghe-sanjiaoroad-app/framework/store'
