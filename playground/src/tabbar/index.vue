<script setup lang="ts">
/**
 * 自定义 Tabbar 组件
 *
 * 基于框架包 jh-tabbar，零 props 开箱即用。
 * 如需项目特定的定制（事件监听、动画、权限等），在此文件中扩展。
 */
import './config' // 触发 defineTabbar() 注册配置
</script>

<template>
  <jh-tabbar />
</template>
