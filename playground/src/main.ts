import { initFramework } from '@jinghe-sanjiaoroad-app/framework'
import { routeInterceptor } from '@jinghe-sanjiaoroad-app/framework/router'
import { createSSRApp } from 'vue'
import { requestInterceptor } from '@/http'
import App from './App.vue'
import store from './store'
import { getAllPages, HOME_PAGE } from './utils'
import '@jinghe-sanjiaoroad-app/framework/style'
import 'virtual:uno.css'

// 提前触发 defineTabbar()，确保路由拦截器可访问 tabbar 配置
// import './tabbar/config'

// 初始化框架配置（必须在使用框架功能之前调用）
initFramework({
  appTitle: import.meta.env.VITE_APP_TITLE,
  appLogo: '/static/logo.svg',
  // 认证模式，'single' | 'double' ==> 单token | 双token
  isDoubleTokenMode: import.meta.env.VITE_AUTH_MODE === 'double',
  // 后台请求地址
  baseUrl: import.meta.env.VITE_SERVER_BASEURL,
  // 静态资源基础 URL
  staticBaseUrl: import.meta.env.VITE_STATIC_BASEURL,
  // 代理配置（仅 H5 环境生效）
  proxyEnable: import.meta.env.VITE_APP_PROXY_ENABLE === 'true',
  proxyPrefix: import.meta.env.VITE_APP_PROXY_PREFIX || '/api',
  // 验证码开关
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'true',
  // 上传类型
  uploadType: (import.meta.env.VITE_UPLOAD_TYPE as 'server' | 'client') || 'server',
  // 租户配置
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE === 'true',
  // 默认账户密码
  defaultTenantId: import.meta.env.VITE_APP_DEFAULT_LOGIN_TENANT_ID || '',
  // debug
  debugLog: import.meta.env.DEV,
  // API 加密配置
  apiEncrypt: {
    enable: import.meta.env.VITE_APP_API_ENCRYPT_ENABLE === 'true',
    header: import.meta.env.VITE_APP_API_ENCRYPT_HEADER,
    algorithm: import.meta.env.VITE_APP_API_ENCRYPT_ALGORITHM as 'AES' | 'RSA',
    requestKey: import.meta.env.VITE_APP_API_ENCRYPT_REQUEST_KEY,
    responseKey: import.meta.env.VITE_APP_API_ENCRYPT_RESPONSE_KEY,
  },
  // 路由配置
  router: {
    homePage: HOME_PAGE,
    loginPage: '/pages-core/auth/login',
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
