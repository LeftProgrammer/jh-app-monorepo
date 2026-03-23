<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="任务"
      placeholder
      safe-area-inset-top
      fixed
      :bordered="false"
      class="bg-transparent"
    />

    <!-- Tabs 区域 -->
    <wd-tabs
      v-model="tabIndex"
      shrink
      color="#fff"
      inactive-color="#fff"
      @change="handleTabChange"
    >
      <wd-tab
        v-for="tab in activeTabs"
        :key="tab.key"
        :title="tab.title"
        :badge-props="tab.badgeProps"
      />
    </wd-tabs>

    <!-- 列表内容 -->
    <view class="content">
      <!-- 内置列表：按需渲染 -->
      <TodoList v-if="hasTab('todo')" v-show="tabType === 'todo'" ref="todoListRef" :detail-url="getDetailUrl('todo')" />
      <DoneList v-if="hasTab('done')" v-show="tabType === 'done'" ref="doneListRef" :detail-url="getDetailUrl('done')" />
      <MyList v-if="hasTab('my')" v-show="tabType === 'my'" ref="myListRef" :detail-url="getDetailUrl('my')" />
      <CopyList v-if="hasTab('copy')" v-show="tabType === 'copy'" ref="copyListRef" :detail-url="getDetailUrl('copy')" />
      <!-- 自定义 Tab 内容：通过 slot 注入（兼容小程序） -->
      <slot :tab-type="tabType" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useGlobalState } from '../../../store/global'
import CopyList from '../components/copy-list.vue'
import DoneList from '../components/done-list.vue'
import MyList from '../components/my-list.vue'
import TodoList from '../components/todo-list.vue'

defineOptions({
  name: 'BpmPage',
})

/** Tab 配置项 */
export interface BpmTabConfig {
  /** 唯一标识（内置 key: 'todo' | 'done' | 'my' | 'copy'，自定义 key 任意） */
  key: string
  /** Tab 标题 */
  title: string
  /** 详情页路径模板（仅内置 tab 有效，{id} 会被替换为实际 id） */
  detailUrl?: string
  /** Badge 配置 */
  badgeProps?: Record<string, any>
}

/** 内置 tab key 集合 */
const BUILTIN_KEYS = ['todo', 'done', 'my', 'copy'] as const

/** 内置 tab 默认详情路径 */
const DEFAULT_DETAIL_URLS: Record<string, string> = {
  todo: '/pages-bpm/detail/index?id={id}&type=todo',
  done: '/pages-bpm/detail/index?id={id}&type=done',
  my: '/pages-bpm/detail/index?id={id}&type=my',
  copy: '/pages-bpm/detail/index?id={id}&type=copy',
}

/** 内置 tab 默认标题 */
const DEFAULT_TITLES: Record<string, string> = {
  todo: '我的待办',
  done: '我的已办',
  my: '我的发起',
  copy: '抄送我的',
}

const props = withDefaults(defineProps<{
  /**
   * Tab 配置列表（数组顺序即显示顺序）
   * - 不传：默认显示 4 个内置 tab（我的待办、我的已办、我的发起、抄送我的）
   * - 传入：完全按数组配置，内置 key 使用内置组件，自定义 key 内容由 slot 提供
   */
  tabs?: BpmTabConfig[]
  /** 初始激活的 tab key */
  initialTab?: string
}>(), {
  initialTab: 'todo',
})

const globalState = useGlobalState()

const todoTotal = computed(() => {
  return globalState.globalConfig?.todoTotal || 0
})

/** 默认内置 tabs（不传 tabs prop 时使用） */
const defaultTabs: BpmTabConfig[] = [
  { key: 'todo', title: '我的待办' },
  { key: 'done', title: '我的已办' },
  { key: 'my', title: '我的发起' },
  { key: 'copy', title: '抄送我的' },
]

/** 最终激活的 tab 列表 */
const activeTabs = computed(() => {
  const tabs = props.tabs || defaultTabs
  return tabs.map((tab) => {
    const result = { ...tab }
    // 填充默认标题
    if (!result.title && DEFAULT_TITLES[tab.key]) {
      result.title = DEFAULT_TITLES[tab.key]
    }
    // 待办 tab 自动附加 badge
    if (tab.key === 'todo' && !result.badgeProps) {
      result.badgeProps = { modelValue: todoTotal, max: 99, right: '-8px' }
    }
    return result
  })
})

/** 判断某个内置 tab 是否在当前配置中 */
function hasTab(key: string): boolean {
  return activeTabs.value.some(t => t.key === key)
}

/** 获取内置 tab 的详情路径 */
function getDetailUrl(key: string): string {
  const tab = activeTabs.value.find(t => t.key === key)
  return tab?.detailUrl || DEFAULT_DETAIL_URLS[key] || ''
}

const tabIndex = ref(0)
const tabType = computed<string>(() => activeTabs.value[tabIndex.value]?.key || 'todo')

// 初始化 tabIndex
const initIdx = activeTabs.value.findIndex(t => t.key === props.initialTab)
if (initIdx !== -1) {
  tabIndex.value = initIdx
}

const todoListRef = ref<InstanceType<typeof TodoList>>()
const doneListRef = ref<InstanceType<typeof DoneList>>()
const myListRef = ref<InstanceType<typeof MyList>>()
const copyListRef = ref<InstanceType<typeof CopyList>>()

/** Tab 切换 */
function handleTabChange({ index }: { index: number }) {
  tabIndex.value = index
}

/** 刷新当前内置列表（自定义 tab 由外部自行管理刷新） */
function refresh() {
  const key = tabType.value
  switch (key) {
    case 'todo':
      todoListRef.value?.refresh()
      break
    case 'done':
      doneListRef.value?.refresh()
      break
    case 'my':
      myListRef.value?.refresh()
      break
    case 'copy':
      copyListRef.value?.refresh()
      break
  }
}

/** 刷新所有内置列表 */
function refreshAll() {
  if (hasTab('todo')) todoListRef.value?.refresh()
  if (hasTab('done')) doneListRef.value?.refresh()
  if (hasTab('my')) myListRef.value?.refresh()
  if (hasTab('copy')) copyListRef.value?.refresh()
}

/** 切换到指定 tab */
function switchTab(tab: string) {
  const index = activeTabs.value.findIndex(t => t.key === tab)
  if (index !== -1) {
    tabIndex.value = index
  }
}

/** 判断某个 key 是否为内置 tab */
function isBuiltinTab(key: string): boolean {
  return (BUILTIN_KEYS as readonly string[]).includes(key)
}

/** 暴露方法和状态供外部调用 */
defineExpose({
  /** 刷新当前内置列表 */
  refresh,
  /** 刷新所有内置列表 */
  refreshAll,
  /** 切换到指定 tab */
  switchTab,
  /** 当前活跃的 tab key */
  tabType,
  /** 判断是否为内置 tab */
  isBuiltinTab,
})
</script>

<style lang="scss" scoped>
:deep(.wd-navbar) {
  background-color: #22b5af;
  .wd-navbar__title {
    color: #fff;
  }
}
:deep(.wd-tabs) {
  background: #22b5af;
  .wd-tabs__nav {
    background-color: transparent;
  }
  .wd-tabs__line {
    background: #fff;
    width: 100rpx;
  }
  .wd-badge__content {
    border-width: 1px;
  }
}
.content {
  background: linear-gradient(180deg, #22b5af 0%, #3fc5be 10.52%, #95e6ea 20.26%, #f5f5f5 30%, #f5f5f5 100%);
}
</style>
