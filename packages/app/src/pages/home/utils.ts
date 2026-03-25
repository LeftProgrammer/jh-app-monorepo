/**
 * 首页模块工具函数
 */
import type { AuthMenuItem } from '../../api/types/login'
import type { MenuGroup, MenuItem } from './types'

/**
 * 根据权限过滤菜单分组
 * @param menuGroups 菜单分组列表
 * @param hasAccess 权限检查函数
 */
export function filterMenuGroupsByPermission(
  menuGroups: MenuGroup[],
  hasAccess: (permissions: string[]) => boolean
): MenuGroup[] {
  return menuGroups
    .map(group => ({
      ...group,
      menus: group.menus.filter(menu => {
        if (!menu.permission) {
          return true
        }
        return hasAccess([menu.permission])
      }),
    }))
    .filter(group => group.menus.length > 0)
}

/**
 * 获取所有菜单项（扁平化）
 * @param menuGroups 菜单分组列表
 */
export function getAllMenuItems(menuGroups: MenuGroup[]): MenuItem[] {
  return menuGroups.flatMap(group => group.menus)
}

/**
 * 根据 key 获取菜单项
 * @param menuGroups 菜单分组列表
 * @param key 菜单 key
 */
export function getMenuItemByKey(menuGroups: MenuGroup[], key: string): MenuItem | undefined {
  return getAllMenuItems(menuGroups).find(item => item.key === key)
}

/**
 * 将数组分块（用于菜单分页）
 * @param arr 数组
 * @param size 每块大小
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  let index = 0
  while (index < arr.length) {
    result.push(arr.slice(index, index + size))
    index += size
  }
  return result
}

/**
 * 解析 URL，提取路径和查询参数
 */
export function parseUrl(url: string): { path: string; query: Record<string, any> } {
  const [path, queryString] = url.split('?')
  const query: Record<string, any> = {}
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key) {
        query[key] = value ? decodeURIComponent(value) : ''
      }
    })
  }
  return { path, query }
}

/** 统一路径格式：确保以 / 开头 */
function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * 递归扁平化后端菜单树，提取所有路径（已标准化）
 * @param menus 后端返回的菜单树
 */
export function flattenAuthMenuPaths(menus: AuthMenuItem[]): string[] {
  const paths: string[] = []
  for (const menu of menus) {
    if (menu.path) {
      paths.push(normalizePath(menu.path))
    }
    if (menu.children && menu.children.length > 0) {
      paths.push(...flattenAuthMenuPaths(menu.children))
    }
  }
  return paths
}

/**
 * 根据后端菜单路径过滤本地菜单分组
 * 本地菜单的 url（去掉 query，标准化）与后端菜单的 path 做匹配
 * @param menuGroups 本地菜单分组
 * @param backendPaths 后端菜单路径集合（已标准化）
 */
export function filterMenuGroupsByBackendMenus(
  menuGroups: MenuGroup[],
  backendPaths: Set<string>
): MenuGroup[] {
  return menuGroups
    .map(group => ({
      ...group,
      menus: group.menus.filter(menu => {
        if (!menu.url) return true
        const path = normalizePath(menu.url.split('?')[0])
        return backendPaths.has(path)
      }),
    }))
    .filter(group => group.menus.length > 0)
}

/**
 * 默认路由跳转（简单版，不处理 tabBar）
 */
export function defaultNavigateTo(url: string) {
  uni.navigateTo({
    url,
    fail: () => {
      uni.switchTab({ url: url.split('?')[0] })
    },
  })
}
