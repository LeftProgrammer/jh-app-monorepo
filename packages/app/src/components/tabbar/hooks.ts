import type { CustomTabBarItem } from './types'
import { activeRouterConfig } from '../../router/config'
import { judgeIsExcludePath } from '../../router/interceptor'
import { useGlobalState } from '../../store/global'
import { useTokenStore } from '../../store/token'

/**
 * Tabbar 钩子函数配置
 */
export interface TabbarHooks {
  /** 导航前钩子，返回 false 阻止导航 */
  beforeNavigate?: (index: number, item: CustomTabBarItem) => boolean | Promise<boolean>
  /** 导航后钩子 */
  afterNavigate?: (index: number, item: CustomTabBarItem) => void
  /** 鼓包按钮点击钩子 */
  onBulgeClick?: () => void
  /** 角标计算钩子 */
  getBadge?: (item: CustomTabBarItem) => number | 'dot' | undefined
  /** 自定义样式钩子 */
  getCustomStyles?: (index: number, item: CustomTabBarItem, isActive: boolean) => Record<string, any>
}

/**
 * 默认钩子配置
 */
export const defaultTabbarHooks: Required<TabbarHooks> = {
  beforeNavigate: async (index: number, item: CustomTabBarItem) => {
    const tokenStore = useTokenStore()

    // 默认权限检查逻辑
    const hasPermission = tokenStore.hasLogin
      || (activeRouterConfig.isNeedLoginMode && judgeIsExcludePath(item.pagePath))
      || (!activeRouterConfig.isNeedLoginMode && !judgeIsExcludePath(item.pagePath))

    return hasPermission
  },

  afterNavigate: () => {},

  onBulgeClick: () => {
    uni.showToast({
      title: '点击了中间的鼓包tabbarItem',
      icon: 'none',
    })
  },

  getBadge: (item: CustomTabBarItem) => {
    const globalState = useGlobalState()

    if (typeof item.badge === 'number') {
      return item.badge
    }
    if (typeof item.badge === 'string') {
      return globalState.globalConfig[item.badge] as number | 'dot' | undefined
    }
    return undefined
  },

  getCustomStyles: () => ({}),
}

/**
 * 使用 Tabbar 钩子
 * @param hooks 自定义钩子配置
 * @returns 合并后的钩子对象
 * 创建 Tabbar 钩子配置
 * @param hooks 外部钩子覆盖
 * @returns 完整的钩子配置
 */
export function createTabbarHooks(hooks: TabbarHooks = {}) {
  return {
    ...defaultTabbarHooks,
    ...hooks,
  }
}

/**
 * Tabbar 组合式钩子
 * @param config Tabbar 配置
 * @returns Tabbar 相关的状态和方法
 */
export function useTabbarHooks(config: { items: CustomTabBarItem[], hooks?: TabbarHooks }) {
  const hooks = createTabbarHooks(config.hooks)

  // 当前选中状态
  const currentIndex = ref(0)

  // 处理鼓包点击
  const handleBulgeClick = () => {
    hooks.onBulgeClick?.()
  }

  // 处理项目点击
  const handleItemClick = async (index: number, item: CustomTabBarItem) => {
    if (index === currentIndex.value)
      return

    if (item.isBulge) {
      handleBulgeClick()
      return
    }

    // 执行前置钩子
    const canNavigate = await hooks.beforeNavigate?.(index, item)
    if (canNavigate === false)
      return

    // 更新状态
    currentIndex.value = index

    // 导航
    const url = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
    uni.switchTab({ url })
  }

  // 获取颜色
  const getItemColor = (index: number, activeColor: string, inactiveColor: string) => {
    return currentIndex.value === index ? activeColor : inactiveColor
  }

  // 获取图标
  const getItemIcon = (index: number, item: CustomTabBarItem) => {
    if (item.iconType === 'image' && item.iconActive) {
      return currentIndex.value === index ? item.iconActive : item.icon
    }
    return item.icon
  }

  // 获取角标
  const getItemBadge = (item: CustomTabBarItem, enableBadge: boolean) => {
    if (!enableBadge)
      return undefined

    const badge = hooks.getBadge?.(item)
    if (!badge)
      return undefined

    if (badge === 'dot')
      return 'dot'
    if (typeof badge === 'number')
      return badge > 99 ? '99+' : badge
    return badge
  }

  return {
    currentIndex,
    handleItemClick,
    handleBulgeClick,
    getItemColor,
    getItemIcon,
    getItemBadge,
  }
}
