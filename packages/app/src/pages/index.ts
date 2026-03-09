/**
 * 页面模块入口文件
 * 提供所有页面组件的统一导出
 * 
 * 使用方式：
 * import { index, user, message, general, bpm, contact } from '@jh-app/app/pages'
 */

// ==================== 工作台模块 ====================
export * as index from './index/index'

// ==================== 用户中心模块 ====================
export * as user from './user/index'

// ==================== 消息中心模块 ====================
export * as message from './message/index'

// ==================== 通用业务模块 ====================
export * as general from './general/index'

// ==================== BPM 工作流模块 ====================
export * as bpm from './bpm/index'

// ==================== 通讯录模块 ====================
export * as contact from './contact/index'

// ==================== 模块映射 ====================
/**
 * 模块使用说明：
 * 
 * 1. 工作台模块：
 *    import { IndexPage, UserHeader, configureMenus } from '@jh-app/app/pages'
 *    const { IndexPage } = index
 * 
 * 2. 用户中心模块：
 *    import { UserPage, formatUserName } from '@jh-app/app/pages'
 *    const { UserPage } = user
 * 
 * 3. 消息中心模块：
 *    import { MessagePage, MessageSearchForm } from '@jh-app/app/pages'
 *    const { MessagePage } = message
 * 
 * 4. 通用业务模块：
 *    import { LeaveApplyPage, MeetingPage } from '@jh-app/app/pages'
 *    const { LeaveApplyPage } = general
 * 
 * 5. BPM 工作流模块：
 *    import { BpmPage, TodoList } from '@jh-app/app/pages'
 *    const { BpmPage } = bpm
 * 
 * 6. 通讯录模块：
 *    import { ContactPage, ContactList } from '@jh-app/app/pages'
 *    const { ContactPage } = contact
 */