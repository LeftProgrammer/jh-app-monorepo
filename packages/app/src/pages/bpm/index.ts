/**
 * BPM 工作流模块导出
 * 提供工作流任务管理相关的组件和功能
 * 
 * 使用方式：
 * import { BpmPage, TodoList, DoneList, MyList, CopyList } from '@jinghe-sanjiaoroad-app/framework/pages/bpm'
 */

// ==================== 页面组件 ====================
export { default as BpmPage } from './index.vue'

// ==================== 列表组件 ====================
export { default as TodoList } from './components/todo-list.vue'
export { default as DoneList } from './components/done-list.vue'
export { default as MyList } from './components/my-list.vue'
export { default as CopyList } from './components/copy-list.vue'

// ==================== 搜索表单组件 ====================
export { default as TodoSearchForm } from './components/todo-search-form.vue'
export { default as DoneSearchForm } from './components/done-search-form.vue'
export { default as MySearchForm } from './components/my-search-form.vue'
export { default as CopySearchForm } from './components/copy-search-form.vue'

// ==================== 类型定义 ====================
export interface BpmTask {
  id: string
  processInstance?: {
    id: string
    name: string
    createTime: string
    startUser?: {
      nickname: string
    }
  }
  processDefinition?: {
    name: string
    key: string
  }
  assignee?: string
  taskName?: string
  description?: string
  priority?: string
  createTime?: string
  dueDate?: string
}

export interface BpmSearchForm {
  name?: string
  processDefinitionKey?: string
  category?: string
  status?: number
  createTime?: [string, string] | [undefined, undefined]
}

export interface BpmCategory {
  id: string
  name: string
  code?: string
}

export interface BpmProcessDefinition {
  id: string
  name: string
  key: string
  category?: string
  version?: string
  description?: string
}

// ==================== 工具函数 ====================
export function formatDate(date: string | undefined, format: string): string {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
}

export function getTaskStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    1: '待办',
    2: '已办', 
    3: '已完成',
    4: '已取消',
    5: '已驳回'
  }
  return statusMap[status] || '未知状态'
}

export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    'high': '#ff4d4f',
    'medium': '#faad14', 
    'low': '#52c41a',
    'urgent': '#722ed1'
  }
  return colorMap[priority] || '#1890ff'
}
