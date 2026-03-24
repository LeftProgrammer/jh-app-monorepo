<template>
  <view class="yd-page-container" :class="containerClass">
    <!-- 用户信息头部 -->
    <slot name="header">
      <HomeUserHeader v-bind="userHeaderProps" />
    </slot>
    <!-- 菜单区域 -->
    <slot name="menu">
      <HomeMenuSection :menu-groups="menuGroups" v-bind="menuSectionProps" />
    </slot>
    <!-- 项目新闻 -->
    <slot name="news">
      <HomeNewsList v-bind="newsListProps" />
    </slot>
    <!-- 额外内容插槽 -->
    <slot />
  </view>
</template>

<script lang="ts" setup>
import type { MenuGroup } from '../types'
import HomeMenuSection from '../components/menu-section.vue'
import HomeNewsList from '../components/news-list.vue'
import HomeUserHeader from '../components/user-header.vue'

defineOptions({
  name: 'HomeDefaultPage',
})

withDefaults(defineProps<{
  /** 菜单分组数据（带权限过滤后的） */
  menuGroups: MenuGroup[]
  /** 容器额外的 class */
  containerClass?: string
  /** 传递给 HomeUserHeader 的 props */
  userHeaderProps?: Record<string, any>
  /** 传递给 HomeMenuSection 的 props */
  menuSectionProps?: Record<string, any>
  /** 传递给 HomeNewsList 的 props */
  newsListProps?: Record<string, any>
}>(), {
  containerClass: 'px-16rpx',
  userHeaderProps: () => ({}),
  menuSectionProps: () => ({}),
  newsListProps: () => ({}),
})
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
