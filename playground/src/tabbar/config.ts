/**
 * Tabbar 配置文件
 *
 * - pages.config.ts 使用 tabBar 导出（构建时）
 * - index.vue 通过 import './config' 触发注册（运行时）
 *
 * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 不会更新导致配置不生效
 */
import { defineTabbar } from '@jinghe-sanjiaoroad-app/framework/components/jh-tabbar'
import { useGlobalState } from '@/store'

/**
 * 定义并注册 tabbar 配置（一步完成）
 *
 * 图标可到 https://icon-sets.iconify.design/carbon/ 选择
 * 需要在 uno.config.ts 的 safelist 中添加图标类名
 */
const { tabBar } = defineTabbar({
  // strategy: TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE, // 默认值，可省略
  customItems: [
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
  ],
  nativeItems: [
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
  ],
  // 角标取值：框架渲染时调用此函数，key 来自 customItems 中的 badge 字段
  // 如不需要角标，删除此行即可（框架默认不显示）
  getBadgeValue: (key: string) => useGlobalState().globalConfig[key] || 0,
})

// 供 pages.config.ts 使用
export { tabBar }
