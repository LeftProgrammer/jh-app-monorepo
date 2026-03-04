import { createSSRApp } from 'vue'
import App from './App.vue'
import { createJhApp } from '@jh-app/app'

export function createApp() {
  const app = createSSRApp(App)
  
  // 使用 JH App 框架
  const jhApp = createJhApp({
    baseURL: import.meta.env.VITE_APP_BASE_URL || '',
    timeout: 10000,
    platform: 'h5'
  })
  
  app.use(jhApp)

  return {
    app,
  }
}
