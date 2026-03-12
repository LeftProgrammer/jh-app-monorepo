/**
 * 使用包内部封装的 store
 *
 * @description 直接使用 @jinghe-sanjiaoroad-app/framework 提供的 store 配置
 * @note 包内已包含完整的 Pinia 配置和持久化设置
 */
import { store } from '@jinghe-sanjiaoroad-app/framework'
import { setActivePinia } from 'pinia'

// 重新导出包内的 store（保持向后兼容）
export default store

// 导出包内的 store 命名空间（通过命名空间访问具体模块）
export { store as appStore } from '@jinghe-sanjiaoroad-app/framework'

// 导出具体的 store 模块（直接导入使用，保持原有使用方式）
export const useDictStore = store.useDictStore
export const useGlobalState = store.useGlobalState
export const useSystemState = store.useSystemState
export const useThemeStore = store.useThemeStore
export const useTokenStore = store.useTokenStore
export const useUserStore = store.useUserStore

// 在 playground 中激活 Pinia 实例（解决APP端白屏问题）
setActivePinia(store)
