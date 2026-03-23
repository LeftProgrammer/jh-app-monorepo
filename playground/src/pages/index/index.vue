<template>
  <view class="yd-page-container px-16rpx">
    <!-- 用户信息头部 -->
    <HomeUserHeader />
    <!-- 菜单区域 -->
    <HomeMenuSection :menu-groups="menuGroups" />
    <!-- 项目新闻 -->
    <HomeNewsList />
  </view>
</template>

<script lang="ts" setup>
import { HomeMenuSection, HomeNewsList, HomeUserHeader } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { getMenuGroups } from './index'

defineOptions({
  name: 'Home',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
  },
})

/** 菜单分组（带权限过滤） */
const menuGroups = computed(() => getMenuGroups())
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
}
</style>
