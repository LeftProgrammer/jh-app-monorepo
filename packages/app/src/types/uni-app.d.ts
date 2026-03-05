// uni-app 全局类型声明
declare global {
  const uni: {
    // 请求相关
    request(options: UniApp.RequestOptions): any
    uploadFile(options: UniApp.UploadFileOptions): any
    downloadFile(options: any): any

    // 存储相关
    getStorageSync(key: string): any
    setStorageSync(key: string, data: any): void
    removeStorageSync(key: string): void
    clearStorageSync(): void
    getStorageInfoSync(): {
      keys: string[]
      currentSize: number
      limitSize: number
    }

    // 路由相关
    navigateTo(options: any): void
    redirectTo(options: any): void
    reLaunch(options: any): void
    switchTab(options: any): void
    navigateBack(options?: any): void
    getCurrentPages(): any[]

    // 系统信息
    getSystemInfo(options: any): void
    getSystemInfoSync(): any
    getNetworkType(options: any): void

    // 拦截器
    addInterceptor(name: string, interceptor: any): void

    // 其他
    showToast(options: any): void
    showModal(options: any): void
    showLoading(options?: any): void
    hideLoading(): void
  }

  const getCurrentPages: () => any[]
}

// 环境变量类型声明
declare const importMeta: {
  env: {
    DEV: boolean
    PROD: boolean
    [key: string]: any
  }
}

// crypto-js 模块声明
declare module 'crypto-js' {
  const CryptoJS: any
  export default CryptoJS
}

// uni-app 命名空间类型
declare namespace UniApp {
  export interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    data?: any
    header?: Record<string, string>
    timeout?: number
    responseType?: 'text' | 'arraybuffer'
    [key: string]: any
  }

  export interface UploadFileOptions {
    url: string
    filePath: string
    name: string
    header?: Record<string, string>
    formData?: Record<string, any>
    [key: string]: any
  }
}

// uni-app 上传文件选项类型
interface IUniUploadFileOptions extends UniApp.UploadFileOptions {}

export {}
