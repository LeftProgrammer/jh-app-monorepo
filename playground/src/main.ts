import { createApp } from 'vue'
import App from './App.vue'
import { createJhApp } from '@jh-app/core'

const app = createApp(App)

// 使用 JH App 框架
const jhApp = createJhApp({
  baseURL: 'https://api.example.com',
  timeout: 10000
})

app.use(jhApp)

app.mount('#app')
