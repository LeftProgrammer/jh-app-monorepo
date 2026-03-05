/**
 * 在 uniapp 的 RequestOptions 基础上，添加自定义参数
 */
export type CustomRequestOptions = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  header?: Record<string, string>
  timeout?: number
  responseType?: 'text' | 'arraybuffer'
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
  /** 是否返回原始数据 add by panda 25.12.10 */
  original?: boolean
  /** 是否API加密 add by panda 25.12.24 */
  isEncrypt?: boolean
  // 上传文件相关属性
  filePath?: string
  name?: string
  formData?: Record<string, any>
}

// 通用响应格式（兼容 msg + message 字段）
export type IResponse<T = any> = {
  code: number
  data: T
  message: string
  [key: string]: any // 允许额外属性
} | {
  code: number
  data: T
  msg: string
  [key: string]: any // 允许额外属性
}

/** 分页参数 */
export interface PageParam {
  pageNo: number
  pageSize: number
  [key: string]: any // 允许额外属性
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[]
  total: number
}

// HTTP 响应配置（保持向后兼容）
export interface HttpResponse<T = any> {
  code: number
  data: T
  msg: string
}

// 请求拦截器类型
export type RequestInterceptor = (config: CustomRequestOptions) => CustomRequestOptions
export type ResponseInterceptor = (response: any) => any
export type ErrorInterceptor = (error: any) => any
