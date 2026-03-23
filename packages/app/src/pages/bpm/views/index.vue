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
      <wd-tab title="我的待办" :badge-props="todoBadgeProps" />
      <wd-tab title="我的已办" />
      <wd-tab title="我的发起" />
      <wd-tab title="抄送我的" />
    </wd-tabs>

    <!-- 列表内容 -->
    <view class="content">
      <TodoList v-show="tabType === 'todo'" ref="todoListRef" :detail-url="todoDetailUrl" />
      <DoneList v-show="tabType === 'done'" ref="doneListRef" :detail-url="doneDetailUrl" />
      <MyList v-show="tabType === 'my'" ref="myListRef" :detail-url="myDetailUrl" />
      <CopyList v-show="tabType === 'copy'" ref="copyListRef" :detail-url="copyDetailUrl" />
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

const props = withDefaults(defineProps<{
  /** 待办详情页路径模板 */
  todoDetailUrl?: string
  /** 已办详情页路径模板 */
  doneDetailUrl?: string
  /** 我的发起详情页路径模板 */
  myDetailUrl?: string
  /** 抄送详情页路径模板 */
  copyDetailUrl?: string
  /** 初始 tab 类型 */
  initialTab?: 'todo' | 'done' | 'my' | 'copy'
}>(), {
  todoDetailUrl: '/pages-bpm/detail/index?id={id}&type=todo',
  doneDetailUrl: '/pages-bpm/detail/index?id={id}&type=done',
  myDetailUrl: '/pages-bpm/detail/index?id={id}&type=my',
  copyDetailUrl: '/pages-bpm/detail/index?id={id}&type=copy',
  initialTab: 'todo',
})

const globalState = useGlobalState()
const tabTypes: string[] = ['todo', 'done', 'my', 'copy']
const tabIndex = ref(tabTypes.indexOf(props.initialTab))
const tabType = computed<string>(() => tabTypes[tabIndex.value])

const todoListRef = ref<InstanceType<typeof TodoList>>()
const doneListRef = ref<InstanceType<typeof DoneList>>()
const myListRef = ref<InstanceType<typeof MyList>>()
const copyListRef = ref<InstanceType<typeof CopyList>>()

/** Tab 切换 */
function handleTabChange({ index }: { index: number }) {
  tabIndex.value = index
}

const todoTotal = computed(() => {
  return globalState.globalConfig?.todoTotal || 0
})

const todoBadgeProps = ref({
  modelValue: todoTotal,
  max: 99,
  right: '-8px',
})

/** 刷新当前列表 */
function refresh() {
  switch (tabType.value) {
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

/** 刷新所有列表 */
function refreshAll() {
  todoListRef.value?.refresh()
  doneListRef.value?.refresh()
  myListRef.value?.refresh()
  copyListRef.value?.refresh()
}

/** 切换到指定 tab */
function switchTab(tab: 'todo' | 'done' | 'my' | 'copy') {
  const index = tabTypes.indexOf(tab)
  if (index !== -1) {
    tabIndex.value = index
  }
}

/** 暴露方法供外部调用 */
defineExpose({
  refresh,
  refreshAll,
  switchTab,
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
