/* eslint-disable brace-style */ // 原因：unibest 官方维护的代码，尽量不要大概，避免难以合并
import type { CustomTabBarItem, CustomTabBarItemBadge } from './types'
import { reactive } from 'vue'

import { isDebugLog, isNeedLoginMode } from '../../config/framework'
import { judgeIsExcludePath } from '../../router/interceptor'
import { useTokenStore } from '../../store/token'
import { tabbarList as _tabbarList, customTabbarEnable, selectedTabbarStrategy, TABBAR_STRATEGY_MAP } from './config'

// TODO 1/2: 中间的鼓包tabbarItem的开关
const BULGE_ENABLE = false

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const tabbarListStore = reactive<CustomTabBarItem[]>(_tabbarList.map(item => ({
  ...item,
  pagePath: item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
})))

if (customTabbarEnable && BULGE_ENABLE) {
  if (tabbarListStore.length % 2) {
    console.error('有鼓包时 tabbar 数量必须是偶数，否则样式很奇怪！！')
  }
  tabbarListStore.splice(tabbarListStore.length / 2, 0, {
    isBulge: true,
  } as CustomTabBarItem)
}

export function isPageTabbarStore(path: string) {
  if (selectedTabbarStrategy === TABBAR_STRATEGY_MAP.NO_TABBAR) {
    return false
  }
  const _path = path.split('?')[0]
  return tabbarListStore.some(item => item.pagePath === _path)
}

/**
 * 自定义 tabbar 的状态管理，原生 tabbar 无需关注本文件
 * tabbar 状态，增加 storageSync 保证刷新浏览器时在正确的 tabbar 页面
 * 使用reactive简单状态，而不是 pinia 全局状态
 */
const tabbarStore = reactive({
  curIdx: uni.getStorageSync('app-tabbar-index') || 0,
  prevIdx: uni.getStorageSync('app-tabbar-index') || 0,
  setCurIdx(index: number) {
    if (index === this.curIdx)
      return
    this.prevIdx = this.curIdx
    this.curIdx = index
    uni.setStorageSync('app-tabbar-index', index)
  },
  setTabbarItemBadge(index: number, badge: CustomTabBarItemBadge) {
    if (index >= 0 && index < tabbarListStore.length) {
      tabbarListStore[index].badge = badge
    }
  },
  setAutoCurIdx(path: string) {
    if (path === '/') {
      this.setCurIdx(0)
      return
    }
    const index = tabbarListStore.findIndex(item => item.pagePath === path)
    isDebugLog() && console.log('index:', index, path)
    // console.log('tabbarList:', tabbarList)
    if (index === -1) {
      const pagesPathList = getCurrentPages().map(item => item.route.startsWith('/') ? item.route : `/${item.route}`)
      // console.log(pagesPathList)
      const flag = tabbarListStore.some(item => pagesPathList.includes(item.pagePath))
      if (!flag) {
        this.setCurIdx(0)
        return
      }
    }
    else {
      this.setCurIdx(index)
    }
  },
  restorePrevIdx() {
    if (this.prevIdx === this.curIdx)
      return
    this.setCurIdx(this.prevIdx)
    this.prevIdx = uni.getStorageSync('app-tabbar-index') || 0
  },
})

export { tabbarListStore, tabbarStore }

/**
 * 创建自定义 Tabbar 状态
 * @param customItems 自定义 tabbar 项目
 * @param bulgeEnable 是否启用鼓包
 * @returns Tabbar 状态和 store
 */
export function createTabbarStore(customItems?: CustomTabBarItem[], bulgeEnable = false) {
  const items = customItems || _tabbarList
  const processedItems = reactive<CustomTabBarItem[]>(items.map(item => ({
    ...item,
    pagePath: item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
  })))

  // 处理鼓包
  if (customTabbarEnable && bulgeEnable) {
    if (processedItems.length % 2) {
      console.error('有鼓包时 tabbar 数量必须是偶数，否则样式很奇怪！！')
    }
    processedItems.splice(processedItems.length / 2, 0, {
      isBulge: true,
    } as CustomTabBarItem)
  }

  const tabbarInstance = reactive({
    curIdx: uni.getStorageSync('app-tabbar-index') || 0,
    prevIdx: uni.getStorageSync('app-tabbar-index') || 0,
    setCurIdx(idx: number) {
      const tokenStore = useTokenStore()
      if (tokenStore.hasLogin || (isNeedLoginMode() && judgeIsExcludePath(processedItems[idx].pagePath)) || (!isNeedLoginMode() && !judgeIsExcludePath(processedItems[idx].pagePath))) {
        this.curIdx = idx
        uni.setStorageSync('app-tabbar-index', idx)
      }
    },
    setTabbarItemBadge(idx: number, badge: CustomTabBarItemBadge) {
      if (processedItems[idx]) {
        processedItems[idx].badge = badge
      }
    },
    setAutoCurIdx(path: string) {
      if (path === '/') {
        this.setCurIdx(0)
        return
      }
      const index = processedItems.findIndex(item => item.pagePath === path)
      if (index === -1) {
        const pagesPathList = getCurrentPages().map(item => item.route.startsWith('/') ? item.route : `/${item.route}`)
        const flag = processedItems.some(item => pagesPathList.includes(item.pagePath))
        if (!flag) {
          this.setCurIdx(0)
          return
        }
      }
      else {
        this.setCurIdx(index)
      }
    },
    restorePrevIdx() {
      if (this.prevIdx === this.curIdx)
        return
      this.setCurIdx(this.prevIdx)
      this.prevIdx = uni.getStorageSync('app-tabbar-index') || 0
    },
  })

  return {
    tabbarList: processedItems,
    tabbarStore: tabbarInstance,
  }
}
