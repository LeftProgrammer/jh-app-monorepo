import { defineStore } from 'pinia'
import { ref } from 'vue'

// 初始化状态
const systemState: Record<string, any> = {
  username: '', // 用户账户
  password: '', // 用户密码
  platform: '', // 平台信息
  version: '', // 版本信息
}

export const useSystemState = defineStore('system', () => {
  // 定义系统信息
  const systemConfig = ref({ ...systemState })

  /** 设置系统信息 */
  const setSystemInfo = async (obj: Record<string, any>) => {
    for (const key in obj) {
      systemConfig.value[key] = obj[key]
    }
  }

  /** 清空系统信息 */
  const clearSystemInfo = () => {
    systemConfig.value = { ...systemState }
  }

  /** 获取系统信息 */
  const getSystemInfo = () => {
    return systemConfig.value
  }

  /** 设置平台信息 */
  const setPlatform = (platform: string) => {
    systemConfig.value.platform = platform
  }

  /** 获取平台信息 */
  const getPlatform = () => {
    return systemConfig.value.platform || ''
  }

  /** 设置版本信息 */
  const setVersion = (version: string) => {
    systemConfig.value.version = version
  }

  /** 获取版本信息 */
  const getVersion = () => {
    return systemConfig.value.version || ''
  }

  return {
    // 状态
    systemConfig,
    // 方法
    setSystemInfo,
    clearSystemInfo,
    getSystemInfo,
    setPlatform,
    getPlatform,
    setVersion,
    getVersion,
  }
}, {
  persist: true,
})
