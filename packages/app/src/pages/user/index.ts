/**
 * 用户中心模块导出
 * 提供用户个人中心相关的组件和功能
 * 
 * 使用方式：
 * import { UserPage } from '@jh-app/app/pages/user'
 */

// ==================== 页面组件 ====================
export { default as UserPage } from './index.vue'

// ==================== 类型定义 ====================
export interface UserProfile {
  id: string
  username: string
  nickname: string
  avatar?: string
  mobile?: string
  email?: string
  gender?: number
  birthday?: string
  dept?: {
    id: string
    name: string
    code?: string
  }
  roles?: Array<{
    id: string
    name: string
    code?: string
  }>
  createTime: string
  updateTime?: string
}

export interface UserProfileVO {
  user: UserProfile
  permissions?: string[]
  roles?: string[]
  dept?: {
    id: string
    name: string
    code?: string
  }
}

export interface MenuItem {
  id: string
  title: string
  icon?: string
  url?: string
  badge?: string | number
  color?: string
  disabled?: boolean
  children?: MenuItem[]
}

export interface UserStats {
  todoCount: number
  messageCount: number
  favoriteCount: number
  loginCount: number
  lastLoginTime: string
}

// ==================== 工具函数 ====================
export function formatUserName(user: UserProfile): string {
  return user.nickname || user.username || '未知用户'
}

export function getUserAvatar(user: UserProfile, size: number = 120): string {
  if (user.avatar) {
    return user.avatar
  }
  
  // 生成默认头像
  const firstChar = (user.nickname || user.username || '?').charAt(0)
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16']
  const colorIndex = (user.username?.charCodeAt(0) || 0) % colors.length
  
  // 这里可以返回一个头像生成服务的URL，或者让调用方自己处理
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${colors[colorIndex]}"/>
      <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="central" 
            fill="white" font-size="${size/2}" font-family="Arial">
        ${firstChar.toUpperCase()}
      </text>
    </svg>
  `)}`
}

export function getUserDeptName(user: UserProfile): string {
  return user.dept?.name || '暂无部门'
}

export function getUserRoleNames(user: UserProfile): string[] {
  return user.roles?.map(role => role.name).filter(Boolean) || []
}

export function isUserOnline(lastLoginTime: string): boolean {
  if (!lastLoginTime) return false
  
  const lastLogin = new Date(lastLoginTime)
  const now = new Date()
  const diffMinutes = (now.getTime() - lastLogin.getTime()) / (1000 * 60)
  
  // 30分钟内登录视为在线
  return diffMinutes <= 30
}

export function formatLastLoginTime(lastLoginTime: string): string {
  if (!lastLoginTime) return '从未登录'
  
  const lastLogin = new Date(lastLoginTime)
  const now = new Date()
  const diff = now.getTime() - lastLogin.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else if (days < 365) {
    return `${Math.floor(days / 30)}个月前`
  } else {
    return `${Math.floor(days / 365)}年前`
  }
}

export function getUserMenuItems(): MenuItem[] {
  return [
    {
      id: 'profile',
      title: '个人资料',
      icon: 'user',
      url: '/pages/user/profile'
    },
    {
      id: 'security',
      title: '账号安全',
      icon: 'lock-on',
      url: '/pages/user/security'
    },
    {
      id: 'feedback',
      title: '意见反馈',
      icon: 'edit',
      url: '/pages/user/feedback'
    },
    {
      id: 'settings',
      title: '应用设置',
      icon: 'setting',
      url: '/pages/user/settings'
    }
  ]
}
