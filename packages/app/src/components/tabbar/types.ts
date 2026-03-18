import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'

/**
 * 原生 tabbar 的单个选项配置
 */
export type NativeTabBarItem = TabBar['list'][number] & {
  pagePath: string
}

/** badge 显示一个数字或 小红点 或 字符串key（用于从外部状态获取） */
export type CustomTabBarItemBadge = number | 'dot' | string

/** 自定义 tabbar 的单个选项配置 */
export interface CustomTabBarItem {
  text: string
  pagePath: string
  /** 图标类型，不建议用 image 模式，因为需要配置 2 张图，更麻烦 */
  iconType: 'uiLib' | 'unocss' | 'iconfont' | 'image'
  /**
   * icon 的路径
   * - uiLib: wot-design-uni 图标的 icon prop
   * - unocss: unocss 图标的类名
   * - iconfont: iconfont 图标的类名
   * - image: 图片的路径
   */
  icon: string
  /** 只有在 image 模式下才需要，传递的是高亮的图片（PS： 不建议用 image 模式） */
  iconActive?: string
  /** badge 显示一个数字或 小红点 或 字符串key */
  badge?: CustomTabBarItemBadge
  /** 是否是中间的鼓包tabbarItem */
  isBulge?: boolean
}

/** Tabbar 策略枚举 */
export const TABBAR_STRATEGY_MAP = {
  /** 无 tabbar */
  NO_TABBAR: 0,
  /** 完全原生 tabbar */
  NATIVE_TABBAR: 1,
  /** 有缓存自定义 tabbar */
  CUSTOM_TABBAR_WITH_CACHE: 2,
  /** 无缓存自定义 tabbar */
  CUSTOM_TABBAR_WITHOUT_CACHE: 3,
} as const

export type TabbarStrategy = typeof TABBAR_STRATEGY_MAP[keyof typeof TABBAR_STRATEGY_MAP]

/** Tabbar Store 接口 */
export interface TabbarStoreInterface {
  /** 当前选中索引 */
  curIdx: number
  /** 上一个选中索引 */
  prevIdx: number
  /** 设置当前索引 */
  setCurIdx: (idx: number) => void
  /** 设置角标 */
  setTabbarItemBadge: (idx: number, badge: CustomTabBarItemBadge) => void
  /** 自动设置当前索引（根据路径） */
  setAutoCurIdx: (path: string) => void
  /** 恢复上一个索引 */
  restorePrevIdx: () => void
}

/** Tabbar 配置选项 */
export interface TabbarConfigOptions {
  /** 选择的策略 */
  strategy?: TabbarStrategy
  /** 自定义 tabbar 项目列表 */
  customItems: CustomTabBarItem[]
  /** 原生 tabbar 项目列表 */
  nativeItems?: NativeTabBarItem[]
  /** 是否启用鼓包 */
  bulgeEnable?: boolean
  /** 主题配置 */
  theme?: {
    activeColor?: string
    inactiveColor?: string
  }
  /** pages.json tabBar 配置 */
  tabBarConfig?: Partial<TabBar>
  /** 鼓包图片 */
  bulgeImage?: string
  /** 角标获取函数 */
  getBadgeValue?: (key: string) => number | undefined
  /** 鼓包点击回调 */
  onBulgeClick?: () => void
  /** 导航前回调，返回 false 阻止导航 */
  beforeNavigate?: (index: number, item: CustomTabBarItem) => boolean | void
  /** 登录检查函数（用于 setCurIdx 时判断是否允许切换） */
  checkLogin?: (pagePath: string) => boolean
}

/** 完整的 Tabbar 配置 */
export interface TabbarFullConfig {
  strategy: TabbarStrategy
  customItems: CustomTabBarItem[]
  nativeItems: NativeTabBarItem[]
  bulgeEnable: boolean
  theme: {
    activeColor: string
    inactiveColor: string
  }
  tabBarConfig: Partial<TabBar>
  bulgeImage: string
  getBadgeValue: (key: string) => number | undefined
  onBulgeClick: () => void
  beforeNavigate: (index: number, item: CustomTabBarItem) => boolean | void
  checkLogin: (pagePath: string) => boolean
  // 派生属性
  tabbarCacheEnable: boolean
  customTabbarEnable: boolean
  needHideNativeTabbar: boolean
  tabbarList: CustomTabBarItem[] | NativeTabBarItem[]
  tabBar: TabBar | undefined
}
