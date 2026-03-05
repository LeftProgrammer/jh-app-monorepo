import { defineStore } from "pinia";
import { getTaskTodoPage } from "@/api/bpm/task";
import { getMyNotifyMessagePage } from "@/api/system/notify/message";
// 初始化状态
const globalState: any = {
  todoTotal: 0, // 待办数量
  msgTotal: 0, // 消息数量
};

export const useGlobalState = defineStore(
  "global",
  () => {
    // 定义全局信息
    const globalConfig = ref({ ...globalState });

    /** 设置全局信息 */
    const setGlobalInfo = async (field: string, val: any) => {
      globalConfig[field] = val;
    };

    /** 清空全局信息 */
    const clearGlobalInfo = () => {
      globalConfig.value = { ...globalState };
    };

    const fetchGlobalInfo = async () => {
      const todoData = await getTaskTodoPage({ pageNo: 1, pageSize: 1 });
      const msgData = await getMyNotifyMessagePage({
        pageNo: 1,
        pageSize: 1,
        readStatus: false,
      });
      globalConfig.value.todoTotal = todoData.total;
      globalConfig.value.msgTotal = msgData.total;
    };

    return {
      globalConfig,
      clearGlobalInfo,
      setGlobalInfo,
      fetchGlobalInfo,
    };
  },
  {
    persist: true,
  },
);
