/**
 * 系统状态管理模块
 * 
 * @description 提供系统相关状态的管理，包括系统配置、环境信息等
 * @export useSystemState - 系统状态管理 Store
 * @export systemStores - 系统模块命名空间
 * @usage 系统配置管理、环境信息存储
 */
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
