/**
 * 菜单分组 composable
 * @description 封装菜单权限过滤和查询逻辑，外部项目只需传入菜单配置数据
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
import { useAccess } from '../../../hooks'
import { filterMenuGroupsByPermission, getAllMenuItems } from '../utils'

/**
 * 菜单分组 composable
 * @param menuGroupsData 原始菜单分组配置数据
 * @returns 带权限过滤的菜单分组及查询方法
 */
export function useMenuGroups(menuGroupsData: MenuGroup[]) {
  const { hasAccessByCodes } = useAccess()

  /** 带权限过滤后的菜单分组（响应式） */
  const menuGroups = computed(() =>
    filterMenuGroupsByPermission(menuGroupsData, hasAccessByCodes),
  )

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
