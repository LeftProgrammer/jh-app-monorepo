import { createApp } from 'vue'
import App from './App.vue'
import { createJhApp } from '@jinghe-sanjiaoroad-app/core'

const app = createApp(App)

// 使用 jinghe-sanjiaoroad App 框架
const jhApp = createJhApp({
  baseURL: 'https://api.example.com',
  timeout: 10000
})

app.use(jhApp)

app.mount('#app')
