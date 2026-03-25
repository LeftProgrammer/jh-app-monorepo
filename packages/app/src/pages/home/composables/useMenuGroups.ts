/**
 * 菜单分组 composable
 * @description 封装菜单权限过滤和查询逻辑，外部项目只需传入菜单配置数据
 *
 * 过滤流程：
 * 后端返回菜单数据（userStore.menus）作为唯一权限来源，按路径匹配过滤本地菜单
 *
 * @example
 * // 外部项目使用
 * import { useMenuGroups } from '@jinghe-sanjiaoroad-app/framework/pages/home'
 *
 * const menuGroupsData: MenuGroup[] = [
 *   { key: 'general', name: '综合管理', menus: [...] },
 * ]
 *
 * const { menuGroups, getMenuItemByKey, getMenusByKeys } = useMenuGroups(menuGroupsData)
 */
import type { MenuGroup, MenuItem } from '../types'
import { useUserStore } from '../../../store'
import { filterMenuGroupsByBackendMenus, flattenAuthMenuPaths, getAllMenuItems } from '../utils'

/**
 * 菜单分组 composable
 * @param menuGroupsData 原始菜单分组配置数据
 * @returns 带权限过滤的菜单分组及查询方法
 */
export function useMenuGroups(menuGroupsData: MenuGroup[]) {
  const userStore = useUserStore()

  /** 后端菜单路径集合（响应式） */
  const backendMenuPaths = computed(() => {
    const menus = userStore.menus || []
    if (menus.length === 0) return null // 后端未返回菜单时不过滤，保持向后兼容
    return new Set(flattenAuthMenuPaths(menus))
  })

  /** 带权限过滤后的菜单分组（响应式） */
  const menuGroups = computed(() => {
    if (!backendMenuPaths.value) return menuGroupsData
    return filterMenuGroupsByBackendMenus(menuGroupsData, backendMenuPaths.value)
  })

  /** 根据 key 获取菜单项 */
  function getMenuItemByKey(key: string): MenuItem | undefined {
    return getAllMenuItems(menuGroups.value).find(item => item.key === key)
  }

  /** 根据 keys 批量获取菜单列表 */
  function getMenusByKeys(keys: string[]): MenuItem[] {
    return keys.map(key => getMenuItemByKey(key)).filter(Boolean) as MenuItem[]
  }

  return {
    /** 带权限过滤后的菜单分组（响应式 computed） */
    menuGroups,
    /** 根据 key 获取单个菜单项 */
    getMenuItemByKey,
    /** 根据 keys 批量获取菜单列表 */
    getMenusByKeys,
  }
}
