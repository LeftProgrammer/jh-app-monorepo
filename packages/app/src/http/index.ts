import type { JhAppConfig, HttpResponse } from '../types'

// HTTP 请求配置
export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: 'text' | 'arraybuffer';
}

// 请求拦截器类型
export type RequestInterceptor = (config: RequestOptions) => RequestOptions;
export type ResponseInterceptor = (response: any) => any;
export type ErrorInterceptor = (error: any) => any;

class HttpClient {
  private config: JhAppConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor() {
    this.config = {
      baseURL: '',
      timeout: 10000,
      platform: 'h5'
    };
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // 添加错误拦截器
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // 执行请求拦截器
  private async processRequest(config: RequestOptions): Promise<RequestOptions> {
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    return processedConfig;
  }

  // 执行响应拦截器
  private async processResponse(response: any): Promise<any> {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  // 执行错误拦截器
  private async processError(error: any): Promise<any> {
    let processedError = error;
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    throw processedError;
  }

  // 基础请求方法
  private async request<T = any>(options: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const config = await this.processRequest(options);

      const response = await uni.request({
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        header: config.headers,
        timeout: config.timeout || this.config.timeout,
      });

      const processedResponse = await this.processResponse(response);

      return processedResponse as HttpResponse<T>;
    } catch (error) {
      return this.processError(error);
    }
  }

  // GET 请求
  async get<T = any>(url: string, params?: Record<string, any>, options?: Partial<RequestOptions>): Promise<HttpResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>({
      url: url + queryString,
      method: 'GET',
      ...options,
    });
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options,
    });
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options,
    });
  }

  // DELETE 请求
  async delete<T = any>(url: string, options?: Partial<RequestOptions>): Promise<HttpResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...options,
    });
  }
}

// 创建默认实例
export const httpClient = new HttpClient();

// 导出类型
export { HttpClient };
