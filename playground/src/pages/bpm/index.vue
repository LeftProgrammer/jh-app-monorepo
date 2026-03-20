<template>
  <BpmPage ref="bpmPageRef" />
</template>

<script lang="ts" setup>
import { BpmPage } from '@jinghe-sanjiaoroad-app/framework/pages/bpm'
import { ref } from 'vue'
import { getAndClearTabParams } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const bpmPageRef = ref<InstanceType<typeof BpmPage>>()

/** 初始化：根据 tab 参数设置默认 tab */
onShow(() => {
  // 从 globalData 获取参数（switchTab 跳转时使用）
  const tabParams = getAndClearTabParams()
  if (tabParams?.tab && ['todo', 'done', 'my', 'copy'].includes(tabParams.tab)) {
    bpmPageRef.value?.switchTab(tabParams.tab as 'todo' | 'done' | 'my' | 'copy')
  }
  // 刷新当前列表
  bpmPageRef.value?.refresh()
})
</script>
