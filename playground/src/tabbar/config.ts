/**
 * Tabbar 配置文件
 *
 * 统一管理 tabbar 的所有配置
 * - pages.config.ts 使用 tabBar 导出（构建时）
 * - 组件和 store 使用 tabbarConfig 导出（运行时）
 *
 * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 不会更新导致配置不生效
 */

// 构建时配置：使用框架包的子路径，不会加载整个框架包
import type {
  CustomTabBarItem,
  NativeTabBarItem,
  TabbarFullConfig,
} from '@jinghe-sanjiaoroad-app/framework/components/tabbar/config'
import {
  createTabbarConfig,
  TABBAR_STRATEGY_MAP,
} from '@jinghe-sanjiaoroad-app/framework/components/tabbar/config'

// ===================== 项目配置 =====================

/** 原生 tabbar 项目列表 */
export const nativeTabbarList: NativeTabBarItem[] = [
  {
    iconPath: 'static/tabbar/home.png',
    selectedIconPath: 'static/tabbar/homeHL.png',
    pagePath: 'pages/index/index',
    text: '首页',
  },
  {
    iconPath: 'static/tabbar/personal.png',
    selectedIconPath: 'static/tabbar/personalHL.png',
    pagePath: 'pages/user/index',
    text: '个人',
  },
]

/**
 * 自定义 tabbar 项目列表
 * 图标可到 https://icon-sets.iconify.design/carbon/ 选择
 * 需要在 uno.config.ts 的 safelist 中添加图标类名
 */
export const customTabbarList: CustomTabBarItem[] = [
  {
    text: '首页',
    pagePath: 'pages/index/index',
    iconType: 'unocss',
    icon: 'i-carbon-home',
  },
  {
    text: '任务',
    pagePath: 'pages/bpm/index',
    iconType: 'unocss',
    icon: 'i-carbon-document',
    badge: 'todoTotal',
  },
  {
    text: '消息',
    pagePath: 'pages/message/index',
    iconType: 'unocss',
    icon: 'i-carbon-chat',
    badge: 'msgTotal',
  },
  {
    text: '我的',
    pagePath: 'pages/user/index',
    iconType: 'unocss',
    icon: 'i-carbon-user',
  },
]

/** 当前使用的策略 */
export const selectedStrategy = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE

// ===================== 创建配置 =====================

/**
 * 完整的 tabbar 配置
 * 注意：onBulgeClick 使用了 uni API，但它是在函数内部，不会在模块加载时执行
 */
export const tabbarConfig: TabbarFullConfig = createTabbarConfig({
  strategy: selectedStrategy,
  customItems: customTabbarList,
  nativeItems: nativeTabbarList,
  bulgeEnable: false,
  bulgeImage: '/static/tabbar/scan.png',
  onBulgeClick: () => {
    uni.showToast({ title: '点击了中间的鼓包', icon: 'none' })
  },
})

// 导出 tabBar 配置供 pages.config.ts 使用
export const { tabBar } = tabbarConfig
