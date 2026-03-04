// HTTP 请求配置
export interface CustomRequestOptions extends UniApp.RequestOptions {
  // 自定义配置
  query?: Record<string, any>
  isToken?: boolean // 是否需要 token，默认 true
  isEncrypt?: boolean // 是否加密请求
  header?: Record<string, string>
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
