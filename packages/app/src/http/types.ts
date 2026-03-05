// HTTP 请求配置
export interface CustomRequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: Record<string, any>
  query?: Record<string, any>
  header?: Record<string, string>
  timeout?: number
  responseType?: 'text' | 'arraybuffer'
  isToken?: boolean // 是否需要 token，默认 true
  isEncrypt?: boolean // 是否加密请求
}

// HTTP 响应配置
export interface HttpResponse<T = any> {
  code: number
  data: T
  msg: string
}

// 请求拦截器类型
export type RequestInterceptor = (config: CustomRequestOptions) => CustomRequestOptions
export type ResponseInterceptor = (response: any) => any
export type ErrorInterceptor = (error: any) => any
