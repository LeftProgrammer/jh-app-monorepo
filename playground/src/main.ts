import { routeInterceptor } from '@jinghe-sanjiaoroad-app/framework/router'
import { createSSRApp } from 'vue'
import App from './App.vue'
import { initFramework } from './config/framework'
import { requestInterceptor } from './http/interceptor'
import store from './store'
import { getAllPages, HOME_PAGE } from './utils'

import '@/style/index.scss'
import 'virtual:uno.css'

// 初始化框架配置（必须在使用框架功能之前调用）
initFramework({
  isDoubleTokenMode: import.meta.env.VITE_AUTH_MODE === 'double',
  baseUrl: import.meta.env.VITE_SERVER_BASEURL,
  debugLog: import.meta.env.DEV,
  // API 加密配置
  apiEncrypt: {
    enable: import.meta.env.VITE_APP_API_ENCRYPT_ENABLE === 'true',
    header: import.meta.env.VITE_APP_API_ENCRYPT_HEADER,
    algorithm: import.meta.env.VITE_APP_API_ENCRYPT_ALGORITHM as 'AES' | 'RSA',
    requestKey: import.meta.env.VITE_APP_API_ENCRYPT_REQUEST_KEY,
    responseKey: import.meta.env.VITE_APP_API_ENCRYPT_RESPONSE_KEY,
  },
  // 上传配置
  upload: {
    type: (import.meta.env.VITE_UPLOAD_TYPE as 'server' | 'client') || 'server',
  },
  // 静态资源配置
  static: {
    baseUrl: import.meta.env.VITE_STATIC_BASEURL,
  },
  // 代理配置（仅 H5 环境生效）
  proxy: {
    enable: import.meta.env.VITE_APP_PROXY_ENABLE === 'true',
    prefix: import.meta.env.VITE_APP_PROXY_PREFIX || '/api',
  },
  // 租户配置
  tenant: {
    enable: import.meta.env.VITE_APP_TENANT_ENABLE === 'true',
  },
  // 路由配置
  router: {
    loginPage: '/pages-core/auth/login',
    homePage: HOME_PAGE,
    notFoundPage: '/pages-core/error/404',
    registerPage: '/pages-core/auth/register',
    codeLoginPage: '/pages-core/auth/code-login',
    forgetPasswordPage: '/pages-core/auth/forget-password',
    onlyPcPage: '/pages-core/error/only-pc',
    isNeedLoginMode: true,
    excludeLoginPathList: [],
    loginPageEnableInMp: true,
  },
  // 路由依赖注入
  routerDeps: {
    getAllPages,
  },
})

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)

  return {
    app,
  }
}
