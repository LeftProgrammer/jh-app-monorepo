/**
 * 消息中心模块导出
 * 提供消息通知相关的组件和功能
 * 
 * 使用方式：
 * import { MessagePage, MessageSearchForm, MessageDetailPopup } from '@jh-app/app/pages/message'
 */

// ==================== 页面组件 ====================
export { default as MessagePage } from './index.vue'

// ==================== 消息组件 ====================
export { default as MessageSearchForm } from './components/search-form.vue'
export { default as MessageDetailPopup } from './components/detail-popup.vue'

// ==================== 类型定义 ====================
export interface MessageItem {
  id: string
  templateNickname: string
  templateType: string
  templateContent: string
  templateParams?: Record<string, any>
  readStatus: boolean
  createTime: string
  updateTime?: string
  senderId?: string
  senderName?: string
  receiverId?: string
  receiverName?: string
  category?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export interface MessageSearchForm {
  keyword?: string
  templateType?: string
  readStatus?: boolean
  startTime?: string
  endTime?: string
  category?: string
  priority?: string
}

export interface MessageTemplate {
  type: string
  name: string
  description?: string
  content?: string
  params?: string[]
}

// ==================== 工具函数 ====================
export function formatDateTime(date: string | undefined): string {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

export function getMessageTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'system': '系统通知',
    'approval': '审批通知',
    'task': '任务提醒',
    'meeting': '会议通知',
    'notice': '公告通知',
    'reminder': '提醒事项'
  }
  return typeMap[type] || '其他消息'
}

export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    'low': '#52c41a',
    'medium': '#1890ff',
    'high': '#faad14',
    'urgent': '#ff4d4f'
  }
  return colorMap[priority] || '#1890ff'
}

export function getUnreadCount(messages: MessageItem[]): number {
  return messages.filter(msg => !msg.readStatus).length
}

export function markAsRead(messageId: string): void {
  // 标记消息为已读的逻辑
  // 可以调用API或更新本地状态
  console.log('标记消息为已读:', messageId)
}

export function markAllAsRead(messageIds: string[]): void {
  // 批量标记消息为已读的逻辑
  messageIds.forEach(id => markAsRead(id))
}
