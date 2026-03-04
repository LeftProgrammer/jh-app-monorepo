<template>
  <div class="app">
    <h1>JH App 框架示例</h1>

    <div class="demo-section">
      <h2>HTTP 请求示例</h2>
      <button @click="testHttpRequest">测试 HTTP 请求</button>
      <p v-if="httpResult">请求结果: {{ httpResult }}</p>
    </div>

    <div class="demo-section">
      <h2>状态管理示例</h2>
      <button @click="testStore">测试状态管理</button>
      <p>用户信息: {{ userStore.nickname || '未设置' }}</p>
    </div>

    <div class="demo-section">
      <h2>组件示例</h2>
      <JhButton type="primary" @click="handleButtonClick">
        点击按钮
      </JhButton>
    </div>

    <div class="demo-section">
      <h2>工具函数示例</h2>
      <button @click="testUtils">测试工具函数</button>
      <p v-if="formattedDate">格式化日期: {{ formattedDate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { JhButton, httpClient, useUserStore, formatDate } from '@jh-app/app'

const httpResult = ref('')
const formattedDate = ref('')

const userStore = useUserStore()

const testHttpRequest = async () => {
  try {
    const response = await httpClient.get('https://api.github.com/users/vuejs')
    httpResult.value = `请求成功: ${response.data?.name || '未知'}`
  } catch (error) {
    httpResult.value = `请求失败: ${error.message}`
  }
}

const testStore = () => {
  userStore.setUserInfo({
    id: 1,
    nickname: '测试用户',
    avatar: '',
    token: 'test-token'
  })
}

const handleButtonClick = () => {
  console.log('按钮被点击了!')
}

const testUtils = () => {
  formattedDate.value = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
}

.demo-section button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.demo-section button:hover {
  background: #0056b3;
}

.demo-section p {
  margin-top: 10px;
  color: #666;
}
</style>
