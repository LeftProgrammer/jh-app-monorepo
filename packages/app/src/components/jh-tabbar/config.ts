import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'
import type {
  CustomTabBarItem,
  NativeTabBarItem,
  TabbarConfigOptions,
  TabbarFullConfig,
} from './types'
import { TABBAR_STRATEGY_MAP } from './types'

// 导出类型和常量
export { TABBAR_STRATEGY_MAP }
export type { CustomTabBarItem, NativeTabBarItem, TabbarConfigOptions, TabbarFullConfig }

/** 默认主题 */
const defaultTheme = {
  activeColor: '#009688',
  inactiveColor: '#666',
}

/** 默认 tabBar 配置 */
const defaultTabBarConfig: Partial<TabBar> = {
  color: '#999999',
  selectedColor: '#009688',
  backgroundColor: '#F8F8F8',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
}

/**
 * 创建 Tabbar 配置
 * @param options 配置选项
 * @returns 完整的 Tabbar 配置
 */
export function createTabbarConfig(options: TabbarConfigOptions): TabbarFullConfig {
  const strategy = options.strategy ?? TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE
  const customItems = options.customItems
  const nativeItems = options.nativeItems ?? []
  const bulgeEnable = options.bulgeEnable ?? false
  const theme = { ...defaultTheme, ...options.theme }
  const tabBarConfig = { ...defaultTabBarConfig, ...options.tabBarConfig }
  const bulgeImage = options.bulgeImage ?? '/static/framework/tabbar/scan.png'
  const getBadgeValue = options.getBadgeValue ?? (() => undefined)
  const onBulgeClick = options.onBulgeClick ?? (() => {
    uni.showToast({ title: '点击了中间的鼓包', icon: 'none' })
  })
  const beforeNavigate = options.beforeNavigate ?? (() => true)
  const checkLogin = options.checkLogin ?? (() => true)

  // 派生属性
  const tabbarCacheEnable = (
    [TABBAR_STRATEGY_MAP.NATIVE_TABBAR, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE] as number[]
  ).includes(strategy)

  const customTabbarEnable = (
    [TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITHOUT_CACHE] as number[]
  ).includes(strategy)

  const needHideNativeTabbar = strategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE

  // tabbarList
  const tabbarList = customTabbarEnable ? customItems : nativeItems

  // pages.json 的 tabBar 配置
  const _tabbarListForPages = customTabbarEnable
    ? customItems.map(item => ({ text: item.text, pagePath: item.pagePath }))
    : nativeItems

  const tabBar: TabBar | undefined = tabbarCacheEnable
    ? {
        ...tabBarConfig,
        custom: strategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE, // 仅微信小程序生效，H5/App 通过 hideTabBar 处理
        list: _tabbarListForPages as TabBar['list'],
      }
    : undefined

  return {
    strategy,
    customItems,
    nativeItems,
    bulgeEnable,
    theme,
    tabBarConfig,
    bulgeImage,
    getBadgeValue,
    onBulgeClick,
    beforeNavigate,
    checkLogin,
    tabbarCacheEnable,
    customTabbarEnable,
    needHideNativeTabbar,
    tabbarList,
    tabBar,
  }
}
