import { createSSRApp } from 'vue'
import App from './App.vue'
import { initFramework } from './config/framework'
import { requestInterceptor } from './http/interceptor'
import { routeInterceptor } from './router'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

// 初始化框架配置（必须在使用框架功能之前调用）
initFramework({
  isDoubleTokenMode: import.meta.env.VITE_AUTH_MODE === 'double',
  baseUrl: import.meta.env.VITE_SERVER_BASEURL,
  debugLog: import.meta.env.DEV,
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
