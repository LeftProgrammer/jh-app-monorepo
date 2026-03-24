<script setup lang="ts">
import { useTabbarStore } from '@jinghe-sanjiaoroad-app/framework/components/jh-tabbar'
import { useGlobalState } from '@/store'
/**
 * 自定义 Tabbar 组件
 *
 * 基于框架包 jh-tabbar，零 props 开箱即用。
 * 如需项目特定的定制（事件监听、动画、权限等），在此文件中扩展。
 */
import './config' // 触发 defineTabbar() 注册配置

// 注册角标取值函数（运行时设置，config.ts 构建时无法访问 @/store）
useTabbarStore().config.getBadgeValue = (key: string) => useGlobalState().globalConfig[key] || 0
</script>

<template>
  <jh-tabbar />
</template>
