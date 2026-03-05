import { defineStore } from 'pinia'
import { ref } from 'vue'

// 主题变量类型
interface ThemeVars {
  colorTheme?: string
  colorDanger?: string
  colorWarning?: string
  colorSuccess?: string
  colorInfo?: string
  bgColor?: string
  textColor?: string
  [key: string]: any
}

export const useThemeStore = defineStore('theme-store', () => {
  /** 主题 */
  const theme = ref<'light' | 'dark'>('light')

  /** 主题变量 */
  const themeVars = ref<ThemeVars>({
    colorTheme: '#009688',
    colorDanger: '#F53F3F',
    colorWarning: '#FF7D00',
    colorSuccess: '#00B42A',
    colorInfo: '#165DFF',
    bgColor: '#ffffff',
    textColor: '#333333',
  })

  /** 设置主题变量 */
  const setThemeVars = (partialVars: Partial<ThemeVars>) => {
    themeVars.value = { ...themeVars.value, ...partialVars }
  }

  /** 切换主题 */
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    updateThemeColors()
  }

  /** 设置主题 */
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    updateThemeColors()
  }

  /** 更新主题颜色 */
  const updateThemeColors = () => {
    if (theme.value === 'dark') {
      setThemeVars({
        bgColor: '#1a1a1a',
        textColor: '#ffffff',
        colorTheme: '#00bfa5',
      })
    } else {
      setThemeVars({
        bgColor: '#ffffff',
        textColor: '#333333',
        colorTheme: '#009688',
      })
    }
  }

  /** 重置主题变量 */
  const resetThemeVars = () => {
    themeVars.value = {
      colorTheme: '#009688',
      colorDanger: '#F53F3F',
      colorWarning: '#FF7D00',
      colorSuccess: '#00B42A',
      colorInfo: '#165DFF',
      bgColor: '#ffffff',
      textColor: '#333333',
    }
  }

  return {
    // 状态
    theme,
    themeVars,
    // 方法
    setThemeVars,
    toggleTheme,
    setTheme,
    updateThemeColors,
    resetThemeVars,
  }
}, {
  persist: true,
})
