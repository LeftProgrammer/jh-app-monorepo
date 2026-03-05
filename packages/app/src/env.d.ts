/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

// UniApp 全局变量声明
declare const uni: {
  request(options: any): void
  uploadFile(options: any): any
  navigateTo(options: any): void
  navigateBack(options?: any): void
  switchTab(options: any): void
  reLaunch(options: any): void
  getSystemInfoSync(): any
  getWindowInfo(): any
  getMenuButtonBoundingClientRect(): any
  getAccountInfoSync(): any
  getFileSystemManager(): any
  chooseImage(options: any): void
  chooseMedia(options: any): void
  [key: string]: any
}

declare const wx: {
  canIUse(api: string): boolean
  getUpdateManager(): any
  showModal(options: any): void
  [key: string]: any
}

declare const getCurrentPages: () => any[]
declare const getApp: () => any

// UniApp 类型声明
declare namespace UniApp {
  interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    data?: any
    header?: Record<string, string>
    timeout?: number
    dataType?: 'json' | 'text' | 'arraybuffer'
    responseType?: 'text' | 'arraybuffer'
    success?: (result: any) => void
    fail?: (result: any) => void
    complete?: (result: any) => void
  }

  interface IUniUploadFileOptions {
    url: string
    filePath?: string
    name?: string
    header?: Record<string, string>
    formData?: Record<string, any>
    success?: (result: any) => void
    fail?: (result: any) => void
    complete?: (result: any) => void
  }

  interface GeneralCallbackResult {
    errMsg?: string
    errCode?: number
  }
}

declare namespace UniNamespace {
  export type RequestOptions = UniApp.RequestOptions
  export type IUniUploadFileOptions = UniApp.IUniUploadFileOptions
}

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** 服务端口号 */
  readonly VITE_SERVER_PORT: string
  /** 后台接口地址 */
  readonly VITE_SERVER_BASEURL: string
  /** H5是否需要代理 */
  readonly VITE_APP_PROXY_ENABLE: 'true' | 'false'
  /** H5是否需要代理，需要的话有个前缀 */
  readonly VITE_APP_PROXY_PREFIX: string
  /** 后端是否有统一前缀 /api */
  readonly VITE_SERVER_HAS_API_PREFIX: 'true' | 'false'
  /** 认证模式，'single' | 'double' ==> 单token | 双token */
  readonly VITE_AUTH_MODE: 'single' | 'double'
  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __VITE_APP_PROXY__: 'true' | 'false'
