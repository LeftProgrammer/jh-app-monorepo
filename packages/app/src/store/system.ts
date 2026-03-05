import { defineStore } from "pinia";
// 初始化状态
const systemState: any = {
  username: "", // 用户账户
  password: "", // 用户密码
};

export const useSystemState = defineStore(
  "system",
  () => {
    // 定义全局信息
    const systemConfig = ref({ ...systemState });

    /** 设置全局信息 */
    const setSystemInfo = async (obj: any) => {
      for (const key in obj) {
        systemConfig.value[key] = obj[key];
      }
    };

    /** 清空全局信息 */
    const clearSystemInfo = () => {
      systemConfig.value = { ...systemState };
    };

    return {
      systemConfig,
      clearSystemInfo,
      setSystemInfo,
    };
  },
  {
    persist: true,
  },
);
