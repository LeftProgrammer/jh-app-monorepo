import { defineStore } from 'pinia'
import { ref } from 'vue'

// 初始化状态
const globalState: Record<string, any> = {
  todoTotal: 0, // 待办数量
  msgTotal: 0, // 消息数量
}

export const useGlobalState = defineStore('global', () => {
  // 定义全局信息
  const globalConfig = ref({ ...globalState })

  /** 设置全局信息 */
  const setGlobalInfo = async (field: string, val: any) => {
    globalConfig.value[field] = val
  }

  /** 清空全局信息 */
  const clearGlobalInfo = () => {
    globalConfig.value = { ...globalState }
  }

  /** 获取全局信息 */
  const fetchGlobalInfo = async () => {
    try {
      // 这里应该调用获取待办和消息的API
      // const todoData = await getTaskTodoPage({ pageNo: 1, pageSize: 1 })
      // const msgData = await getMyNotifyMessagePage({ pageNo: 1, pageSize: 1 })

      // 临时模拟
      const todoTotal = 5
      const msgTotal = 3

      await setGlobalInfo('todoTotal', todoTotal)
      await setGlobalInfo('msgTotal', msgTotal)

      return globalConfig.value
    } catch (error) {
      console.error('获取全局信息失败:', error)
      throw error
    }
  }

  /** 获取待办数量 */
  const getTodoTotal = () => {
    return globalConfig.value.todoTotal || 0
  }

  /** 获取消息数量 */
  const getMsgTotal = () => {
    return globalConfig.value.msgTotal || 0
  }

  /** 设置待办数量 */
  const setTodoTotal = (total: number) => {
    globalConfig.value.todoTotal = total
  }

  /** 设置消息数量 */
  const setMsgTotal = (total: number) => {
    globalConfig.value.msgTotal = total
  }

  return {
    // 状态
    globalConfig,
    // 方法
    setGlobalInfo,
    clearGlobalInfo,
    fetchGlobalInfo,
    getTodoTotal,
    getMsgTotal,
    setTodoTotal,
    setMsgTotal,
  }
}, {
  persist: true,
})
