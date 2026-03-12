/**
 * 通用业务模块导出
 * 提供请假、会议、新闻、用印、接待等通用业务组件和功能
 * 
 * 使用方式：
 * import { LeaveApplyPage, MeetingPage, NewsPage, SealPage, CampPage } from '@jinghe-sanjiaoroad-app/framework/pages/general'
 */

// ==================== 请假申请模块 ====================
export { default as LeaveApplyPage } from './leaveApply/index.vue'
export { default as LeaveApplyForm } from './leaveApply/dataForm.vue'

// ==================== 会议管理模块 ====================
export { default as MeetingSubscribePage } from './meeting/subscribe/index.vue'
export { default as MeetingSubscribeForm } from './meeting/subscribe/SubscribeForm.vue'

// ==================== 新闻资讯模块 ====================
export { default as NewsPage } from './news/index.vue'

// ==================== 用印申请模块 ====================
export { default as SealDeclarationPage } from './sealdeclaration/index.vue'
export { default as SealDeclarationForm } from './sealdeclaration/SealDeclarationForm.vue'

// ==================== 接待管理模块 ====================
export { default as CampReceptionApplyPage } from './camp/receptionapply/index.vue'
export { default as CampReceptionApplyForm } from './camp/receptionapply/ReceptionApplyForm.vue'
export { default as CampSafetyPage } from './camp/safety/index.vue'

// ==================== 类型定义 ====================
export interface LeaveApply {
  id: string
  createName: string
  leaveType: string
  startTime: string
  endTime: string
  days: number
  reason: string
  status: number
  createTime: string
  updateTime?: string
}

export interface LeaveApplyForm {
  id?: string
  leaveType: string
  startTime?: string
  endTime?: string
  reason: string
  files?: string[]
}

export interface MeetingSubscribe {
  id: string
  meetingName: string
  meetingRoom: string
  startTime: string
  endTime: string
  participants: string[]
  status: number
  createTime: string
  organizer?: string
}

export interface MeetingSubscribeForm {
  id?: string
  meetingName: string
  meetingRoom: string
  startTime?: string
  endTime?: string
  participants: string[]
  description?: string
  files?: string[]
}

export interface NewsItem {
  id: string
  name: string
  content: string
  picture: Array<{
    url: string
    name?: string
  }>
  author?: string
  publishTime: string
  createTime: string
  category?: string
  tags?: string[]
}

export interface SealDeclaration {
  id: string
  sealName: string
  sealType: string
  useCount: number
  reason: string
  status: number
  createTime: string
  applicant?: string
  approver?: string
}

export interface SealDeclarationForm {
  id?: string
  sealName: string
  sealType: string
  reason: string
  files?: string[]
  urgentLevel?: number
}

export interface CampReceptionApply {
  id: string
  receptionType: string
  receptionDate: string
  receptionObject: string
  participantCount: number
  contactPerson: string
  contactPhone: string
  purpose: string
  status: number
  createTime: string
  applicant?: string
}

export interface CampReceptionApplyForm {
  id?: string
  receptionType: string
  receptionDate?: string
  receptionObject: string
  participantCount: number
  contactPerson: string
  contactPhone: string
  purpose: string
  requirements?: string
  files?: string[]
}

export interface CampSafety {
  id: string
  safetyType: string
  location: string
  description: string
  severity: number
  status: number
  reportTime: string
  reporter?: string
  handler?: string
  handleTime?: string
}

// ==================== 工具函数 ====================
export function getLeaveTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'sick': '病假',
    'personal': '事假',
    'annual': '年假',
    'marriage': '婚假',
    'maternity': '产假',
    'bereavement': '丧假',
    'injury': '工伤假'
  }
  return typeMap[type] || '其他'
}

export function getLeaveStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: '待审批',
    1: '已通过',
    2: '已驳回',
    3: '已撤销',
    4: '进行中'
  }
  return statusMap[status] || '未知状态'
}

export function getMeetingStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '已取消'
  }
  return statusMap[status] || '未知状态'
}

export function getSealStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: '待审批',
    1: '已通过',
    2: '已驳回',
    3: '用印中',
    4: '已完成'
  }
  return statusMap[status] || '未知状态'
}

export function getReceptionStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: '待审批',
    1: '已通过',
    2: '已驳回',
    3: '接待中',
    4: '已完成'
  }
  return statusMap[status] || '未知状态'
}

export function getSafetySeverityText(severity: number): string {
  const severityMap: Record<number, string> = {
    1: '一般',
    2: '较重',
    3: '严重',
    4: '特别严重'
  }
  return severityMap[severity] || '未知'
}

export function formatDate(date: string | undefined, format: string = 'YYYY-MM-DD'): string {
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
