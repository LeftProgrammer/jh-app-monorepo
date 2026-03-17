/**
 * 全局状态管理模块
 *
 * @description 提供全局状态的管理，包括待办数量、消息数量等全局信息
 * @export useGlobalState - 全局状态管理 Store
 * @export globalStores - 全局模块命名空间
 * @usage 全局状态管理、待办消息管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTaskTodoPage } from '../api/bpm/task'
import { getMyNotifyMessagePage } from '../api/system/notify/message'
import { useUserStore } from './user'
// 初始化状态
const globalState: any = {
  todoTotal: 0, // 待办数量
  msgTotal: 0, // 消息数量
}

export const useGlobalState = defineStore(
  'global',
  () => {
    // 定义全局信息
    const globalConfig = ref({ ...globalState })

    /** 设置全局信息 */
    const setGlobalInfo = async (field: string, val: any) => {
      globalConfig[field] = val
    }

    /** 清空全局信息 */
    const clearGlobalInfo = () => {
      globalConfig.value = { ...globalState }
    }

    const fetchGlobalInfo = async () => {
      const todoData = await getTaskTodoPage({ pageNo: 1, pageSize: 1 })
      const userStore = useUserStore()
      const msgData = await getMyNotifyMessagePage({
        pageNo: 1,
        pageSize: 1,
        userId: userStore.userInfo.id,
        readStatus: false,
      })
      globalConfig.value.todoTotal = todoData.total
      globalConfig.value.msgTotal = msgData.total
    }

    return {
      globalConfig,
      clearGlobalInfo,
      setGlobalInfo,
      fetchGlobalInfo,
    }
  },
  {
    persist: true,
  },
)
