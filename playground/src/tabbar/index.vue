<script setup lang="ts">
/**
 * 自定义 Tabbar 组件
 *
 * 直接使用框架包的 Tabbar 组件，只需提供角标获取函数
 */
import { Tabbar } from '@jinghe-sanjiaoroad-app/framework/components/tabbar'
import { useGlobalState } from '@/store'
import { tabbarConfig } from './config'
import { tabbarList, tabbarStore } from './store'

const globalState = useGlobalState()

// 角标获取函数（项目特定逻辑，从全局状态获取）
function getBadgeValue(key: string) {
  return globalState.globalConfig[key] || 0
}
</script>

<template>
  <Tabbar
    :config="tabbarConfig"
    :tabbar-list="tabbarList"
    :tabbar-store="tabbarStore"
    :get-badge-value="getBadgeValue"
  />
</template>
