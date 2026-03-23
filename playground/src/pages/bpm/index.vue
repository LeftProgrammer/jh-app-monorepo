<template>
  <BpmPage ref="bpmPageRef" :tabs="tabs">
    <!-- 自定义 Tab 内容：通过 slot 注入，兼容小程序 -->
    <template #default="{ tabType }">
      <CirculateList v-show="tabType === 'circulate'" ref="circulateListRef" />
    </template>
  </BpmPage>
</template>

<script lang="ts" setup>
import type { BpmTabConfig } from '@jinghe-sanjiaoroad-app/framework/pages/bpm'
import { BpmPage } from '@jinghe-sanjiaoroad-app/framework/pages/bpm'
import { ref } from 'vue'
import CirculateList from './components/circulate-list.vue'
import { getAndClearTabParams } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

/** Tab 配置：数组顺序即显示顺序 */
const tabs: BpmTabConfig[] = [
  { key: 'todo', title: '我的待办' },
  { key: 'done', title: '我的已办' },
  { key: 'my', title: '我的发起' },
  { key: 'circulate', title: '我的传阅' },
  { key: 'copy', title: '抄送我的' },
]

const bpmPageRef = ref<InstanceType<typeof BpmPage>>()
const circulateListRef = ref<InstanceType<typeof CirculateList>>()

/** 初始化：根据 tab 参数设置默认 tab */
onShow(() => {
  // 从 globalData 获取参数（switchTab 跳转时使用）
  const tabParams = getAndClearTabParams()
  if (tabParams?.tab) {
    bpmPageRef.value?.switchTab(tabParams.tab)
  }
  // 刷新当前列表（内置 tab 由框架刷新，自定义 tab 自行刷新）
  bpmPageRef.value?.refresh()
  if (!bpmPageRef.value?.isBuiltinTab(bpmPageRef.value?.tabType)) {
    circulateListRef.value?.refresh()
  }
})
</script>
