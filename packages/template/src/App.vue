<template>
  <view class="jinghe-sanjiaoroad-app">
    <!-- 用户信息头部 -->
    <UserHeader />
    <!-- 菜单区域 -->
    <MenuSection />
    <!-- 项目新闻 -->
    <HomeNews />
  </view>
</template>

<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'

onLaunch((options) => {
  console.log('App.vue onLaunch', options)
})

onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
.jinghe-sanjiaoroad-app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
