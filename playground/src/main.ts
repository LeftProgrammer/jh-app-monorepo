import { createSSRApp } from 'vue'
import { routeInterceptor } from './router'
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)

  return {
    app,
  }
}
