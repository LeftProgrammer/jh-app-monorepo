<template>
  <view class="yd-page-container px-16rpx">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <text class="user-name">欢迎使用 jinghe-sanjiaoroad App 框架</text>
    </view>

    <!-- 功能演示 -->
    <view class="demo-section">
      <text class="section-title">框架功能演示</text>

      <view class="demo-item">
        <text class="demo-label">HTTP 请求:</text>
        <button @click="testHttpRequest" class="demo-button">测试请求</button>
      </view>

      <view class="demo-item">
        <text class="demo-label">状态管理:</text>
        <button @click="testStore" class="demo-button">测试状态</button>
      </view>

      <view class="demo-item">
        <text class="demo-label">组件使用:</text>
        <button @click="testComponent" class="demo-button">测试组件</button>
      </view>

      <view class="demo-item">
        <text class="demo-label">工具函数:</text>
        <button @click="testUtils" class="demo-button">测试工具</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { httpClient, useUserStore, formatDate, JhButton } from '@jinghe-sanjiaoroad-app/app'

const httpResult = ref('')
const userStore = useUserStore()

const testHttpRequest = async () => {
  try {
    const response = await httpClient.get('https://api.github.com/users/vuejs')
    httpResult.value = `请求成功: ${response.data?.name || '未知'}`
    uni.showToast({
      title: 'HTTP 请求成功',
      icon: 'success'
    })
  } catch (error) {
    httpResult.value = `请求失败: ${error.message}`
    uni.showToast({
      title: 'HTTP 请求失败',
      icon: 'error'
    })
  }
}

const testStore = () => {
  userStore.setUserInfo({
    id: 1,
    nickname: '模板用户',
    avatar: '',
    token: 'template-token'
  })
  uni.showToast({
    title: '状态管理测试成功',
    icon: 'success'
  })
}

const testComponent = () => {
  uni.showToast({
    title: '组件测试成功',
    icon: 'success'
  })
}

const testUtils = () => {
  const formattedDate = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
  uni.showToast({
    title: `当前时间: ${formattedDate}`,
    icon: 'none',
    duration: 3000
  })
}
</script>

<style lang="scss" scoped>
.yd-page-container {
  background: linear-gradient(
    180deg,
    #22b5af 0%,
    #3fc5be 10.52%,
    #95e6ea 20.26%,
    #f5f5f5 30%,
    #f5f5f5 100%
  );
  min-height: 100vh;
  padding: 20rpx 0;
}

.user-header {
  text-align: center;
  padding: 40rpx 0;

  .user-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.demo-section {
  background: rgba(255, 255, 255, 0.9);
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    display: block;
  }

  .demo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 20rpx;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8rpx;

    .demo-label {
      font-size: 28rpx;
      color: #666;
      flex: 1;
    }

    .demo-button {
      background: #007aff;
      color: white;
      border: none;
      border-radius: 8rpx;
      padding: 16rpx 32rpx;
      font-size: 26rpx;

      &:active {
        background: #0056b3;
      }
    }
  }
}
</style>
