// API 模块统一导出

// API 类型定义
export * from './types'

// 登录相关
export * from './login'

// 业务流程管理 (BPM) - 命名空间导出避免冲突
export * as bpm from './bpm'

// 通用业务模块
export * as general from './general'

// 基础设施模块
export * as infra from './infra'

// 项目管理模块 (PMS)
export * as pms from './pms'

// 系统管理模块
export * as system from './system'
