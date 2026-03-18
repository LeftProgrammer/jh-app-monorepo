import type {
  CustomTabBarItem,
  CustomTabBarItemBadge,
  TabbarFullConfig,
  TabbarStoreInterface,
} from './types'
import { reactive } from 'vue'
import { TABBAR_STRATEGY_MAP } from './types'

/**
 * 创建 Tabbar Store
 * @param config Tabbar 配置
 * @returns tabbarList 和 tabbarStore
 */
export function createTabbarStore(config: TabbarFullConfig) {
  // 处理 tabbarList，统一添加 / 前缀
  const tabbarList = reactive<CustomTabBarItem[]>(
    (config.customItems as CustomTabBarItem[]).map(item => ({
      ...item,
      pagePath: item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
    })),
  )

  // 处理鼓包
  if (config.customTabbarEnable && config.bulgeEnable) {
    if (tabbarList.length % 2) {
      console.error('有鼓包时 tabbar 数量必须是偶数，否则样式很奇怪！！')
    }
    tabbarList.splice(tabbarList.length / 2, 0, {
      isBulge: true,
    } as CustomTabBarItem)
  }

  // 判断是否是 tabbar 页面
  function isPageTabbar(path: string): boolean {
    if (config.strategy === TABBAR_STRATEGY_MAP.NO_TABBAR) {
      return false
    }
    const _path = path.split('?')[0]
    return tabbarList.some(item => item.pagePath === _path)
  }

  // Tabbar 状态管理
  const tabbarStore: TabbarStoreInterface = reactive({
    curIdx: uni.getStorageSync('app-tabbar-index') || 0,
    prevIdx: uni.getStorageSync('app-tabbar-index') || 0,

    setCurIdx(idx: number) {
      // 使用外部提供的登录检查函数
      if (config.checkLogin(tabbarList[idx]?.pagePath || '')) {
        this.prevIdx = this.curIdx
        this.curIdx = idx
        uni.setStorageSync('app-tabbar-index', idx)
      }
    },

    setTabbarItemBadge(idx: number, badge: CustomTabBarItemBadge) {
      if (tabbarList[idx]) {
        tabbarList[idx].badge = badge
      }
    },

    setAutoCurIdx(path: string) {
      // '/' 当做首页
      if (path === '/') {
        this.setCurIdx(0)
        return
      }
      const index = tabbarList.findIndex(item => item.pagePath === path)
      if (index === -1) {
        const pagesPathList = getCurrentPages().map(
          item => item.route?.startsWith('/') ? item.route : `/${item.route}`,
        )
        const flag = tabbarList.some(item => pagesPathList.includes(item.pagePath))
        if (!flag) {
          this.setCurIdx(0)
          return
        }
      } else {
        this.setCurIdx(index)
      }
    },

    restorePrevIdx() {
      if (this.prevIdx === this.curIdx) {
        return
      }
      this.setCurIdx(this.prevIdx)
      this.prevIdx = uni.getStorageSync('app-tabbar-index') || 0
    },
  })

  return {
    tabbarList,
    tabbarStore,
    isPageTabbar,
  }
}

export type TabbarStoreReturn = ReturnType<typeof createTabbarStore>
