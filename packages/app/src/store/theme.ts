/**
 * 主题状态管理模块
 *
 * @description 提供应用主题的管理，包括明暗主题切换、主题变量配置等功能
 * @export useThemeStore - 主题状态管理 Store
 * @export themeStores - 主题模块命名空间
 * @usage 主题切换、主题变量配置、界面样式管理
 */
import type { ConfigProviderThemeVars } from 'wot-design-uni'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore(
  'theme-store',
  () => {
    /** 主题 */
    const theme = ref<'light' | 'dark'>('light')

    /** 主题变量 */
    const themeVars = ref<ConfigProviderThemeVars>({
      colorTheme: '#009688',
      colorDanger: '#F53F3F',
    })

    /** 设置主题变量 */
    const setThemeVars = (partialVars: Partial<ConfigProviderThemeVars>) => {
      themeVars.value = { ...themeVars.value, ...partialVars }
    }

    /** 切换主题 */
    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    return {
      /** 设置主题变量 */
      setThemeVars,
      /** 切换主题 */
      toggleTheme,
      /** 主题变量 */
      themeVars,
      /** 主题 */
      theme,
    }
  },
  {
    persist: true,
  },
)
