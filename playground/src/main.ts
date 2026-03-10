import { createSSRApp } from 'vue'
import App from './App.vue'

// 使用 App 包的整包导入
import { http, router } from '@jinghe-sanjiaoroad-app/app'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(router.routeInterceptor)
  app.use(http.requestInterceptor)

  return {
    app,
  }
}
