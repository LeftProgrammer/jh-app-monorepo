/**
 * 通讯录模块导出
 * 提供通讯录相关的组件和功能
 * 
 * 使用方式：
 * import { ContactPage, ContactList, Breadcrumb } from '@jinghe-sanjiaoroad-app/app/pages/contact'
 */

// ==================== 页面组件 ====================
export { default as ContactPage } from './index.vue'

// ==================== 通讯录组件 ====================
export { default as ContactList } from './components/contact-list.vue'
export { default as Breadcrumb } from './components/breadcrumb.vue'

// ==================== 类型定义 ====================
export interface ContactUser {
  id: number
  nickname?: string
  username?: string
  displayName?: string
  avatar?: string
  mobile?: string
  email?: string
  deptId?: number
}

export interface ContactDepartment {
  id: number
  name: string
  children?: ContactDepartment[]
  parentId?: number
}

export interface ContactBreadcrumbItem {
  id: number
  name: string
}
