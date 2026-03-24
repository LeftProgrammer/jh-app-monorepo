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
function createTabbarStore(config: TabbarFullConfig) {
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

  // 所有 tabbar 页面路径（统一添加 / 前缀），兼容原生和自定义 tabbar
  const allTabbarPaths = (config.tabbarList as { pagePath: string }[]).map(
    item => item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
  )

  // 判断是否是 tabbar 页面
  function isPageTabbar(path: string): boolean {
    if (config.strategy === TABBAR_STRATEGY_MAP.NO_TABBAR) {
      return false
    }
    const _path = path.split('?')[0]
    return allTabbarPaths.includes(_path)
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

/** useTabbarStore() 的返回类型 */
export type UseTabbarStoreReturn = ReturnType<typeof createTabbarStore> & { config: TabbarFullConfig }

// ===================== 模块级状态 =====================

let _config: TabbarFullConfig | null = null
let _instance: UseTabbarStoreReturn | null = null

/**
 * 注册 Tabbar 配置（由 defineTabbar 内部调用）
 *
 * 仅存储配置引用，不调用 Vue API，build-time safe。
 */
export function initTabbarStore(config: TabbarFullConfig): void {
  _config = config
  _instance = null
}

/**
 * 获取 Tabbar Store
 *
 * 首次调用时懒创建 reactive store。
 * @throws 未调用 defineTabbar() 时抛出错误
 */
export function useTabbarStore(): UseTabbarStoreReturn {
  if (!_instance) {
    if (!_config) {
      throw new Error(
        '[jh-tabbar] 未初始化，请先在 tabbar/config.ts 中调用 defineTabbar()',
      )
    }
    _instance = { ...createTabbarStore(_config), config: _config }
  }
  return _instance
}
