/**
 * 页面模块入口文件
 * 提供所有页面组件的统一导出
 * 
 * 使用方式：
 * import { index, user, message, general, bpm, contact } from '@jinghe-sanjiaoroad-app/framework/pages'
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
 *    import { IndexPage, UserHeader, configureMenus } from '@jinghe-sanjiaoroad-app/framework/pages'
 *    const { IndexPage } = index
 * 
 * 2. 用户中心模块：
 *    import { UserPage, formatUserName } from '@jinghe-sanjiaoroad-app/framework/pages'
 *    const { UserPage } = user
 * 
 * 3. 消息中心模块：
 *    import { MessagePage, MessageSearchForm } from '@jinghe-sanjiaoroad-app/framework/pages'
 *    const { MessagePage } = message
 * 
 * 4. 通用业务模块：
 *    import { LeaveApplyPage, MeetingPage } from '@jinghe-sanjiaoroad-app/framework/pages'
 *    const { LeaveApplyPage } = general
 * 
 * 5. BPM 工作流模块：
 *    import { BpmPage, TodoList } from '@jinghe-sanjiaoroad-app/framework/pages'
 *    const { BpmPage } = bpm
 * 
 * 6. 通讯录模块：
 *    import { ContactPage, ContactList } from '@jinghe-sanjiaoroad-app/framework/pages'
 *    const { ContactPage } = contact
 */