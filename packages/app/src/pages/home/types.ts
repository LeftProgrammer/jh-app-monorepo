/**
 * 首页模块类型定义
 */

/** 菜单项类型 */
export interface MenuItem {
  /** 菜单唯一标识 */
  key: string
  /** 菜单名称 */
  name: string
  /** 菜单图标（支持图标名或图片路径） */
  icon?: string
  /** 跳转路径 */
  url?: string
  /** 图标颜色（可选） */
  iconColor?: string
  /** 是否启用（可选，默认 true） */
  enabled?: boolean
  /** 权限标识（可选） */
  permission?: string
}

/** 菜单分组类型 */
export interface MenuGroup {
  /** 分组唯一标识 */
  key: string
  /** 分组名称 */
  name: string
  /** 分组下的菜单列表 */
  menus: MenuItem[]
}

/** 统计卡片配置 */
export interface StatCardConfig {
  /** 标签 */
  label: string
  /** 数量 */
  count: number
  /** 图标路径 */
  iconSrc: string
  /** 箭头图标路径 */
  arrowIconSrc?: string
  /** 点击跳转路径 */
  url?: string
}

/** 新闻项类型 */
export interface NewsItem {
  /** 唯一标识 */
  id: string | number
  /** 标题 */
  name: string
  /** 发布日期 */
  publishDate: string
  /** 图片列表 */
  picture?: Array<{ url: string }> | string[]
}
