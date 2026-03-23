<template>
  <view class="mb-16rpx pt-82rpx">
    <view class="mb-19rpx flex">
      <image :src="currentUserInfo.avatar" class="mr-18rpx h-80rpx w-80rpx" />
      <view class="text-#fff">
        <view class="text-31rpx">
          {{ currentUserInfo.deptName || '暂无部门' }}
        </view>
        <view class="text-23rpx">
          {{ currentUserInfo.nickname || currentUserInfo.username }}
        </view>
      </view>
    </view>
    <image v-if="bannerSrc" :src="bannerSrc" class="mb-15rpx h-206rpx w-100%" />
    <slot name="banner" />
    <view class="flex gap-18rpx">
      <view
        class="todo h-100% flex flex-1 rounded-8rpx px-31rpx py-17rpx"
        @click="handleTodoClick"
      >
        <image
          :src="todoIconSrc"
          class="mr-55rpx h-103rpx w-103rpx"
        />
        <view>
          <view class="text-46rpx text-#1D2129">
            {{ todoNum }}
            <image v-if="todoArrowIconSrc" class="h-19rpx w-19rpx" :src="todoArrowIconSrc" />
          </view>
          <view class="text-27rpx text-#86909C">
            {{ todoLabel }}
          </view>
        </view>
      </view>
      <view
        class="copy h-100% flex flex-1 rounded-8rpx px-31rpx py-17rpx"
        @click="handleMessageClick"
      >
        <image
          :src="messageIconSrc"
          class="mr-50rpx h-103rpx w-103rpx"
        />
        <view>
          <view class="text-46rpx text-#1D2129">
            {{ messageNum }}
            <image v-if="messageArrowIconSrc" class="h-19rpx w-19rpx" :src="messageArrowIconSrc" />
          </view>
          <view class="text-27rpx text-#86909C">
            {{ messageLabel }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getTaskTodoPage } from '../../../api/bpm/task'
import { getMyNotifyMessagePage } from '../../../api/system/notify/message'
import { useUserStore } from '../../../store'
import { defaultNavigateTo } from '../utils'

defineOptions({
  name: 'HomeUserHeader',
})

const props = withDefaults(defineProps<{
  /** 用户信息对象（可选，默认从 store 获取） */
  userInfo?: { avatar?: string, nickname?: string, username?: string, deptName?: string }
  /** Banner 图片 */
  bannerSrc?: string
  /** 待办标签 */
  todoLabel?: string
  /** 待办图标 */
  todoIconSrc?: string
  /** 待办箭头图标 */
  todoArrowIconSrc?: string
  /** 消息标签 */
  messageLabel?: string
  /** 消息图标 */
  messageIconSrc?: string
  /** 消息箭头图标 */
  messageArrowIconSrc?: string
  /** 待办页面路径 */
  todoUrl?: string
  /** 消息页面路径 */
  messageUrl?: string
  /** 获取待办数量的函数（可选，默认使用内置 API） */
  fetchTodoCount?: () => Promise<number>
  /** 获取消息数量的函数（可选，默认使用内置 API） */
  fetchMessageCount?: () => Promise<number>
  /** 路由跳转函数（可选，默认使用 uni.navigateTo） */
  navigateTo?: (url: string) => void
}>(), {
  bannerSrc: '/static/images/home/banner.png',
  todoLabel: '待办任务',
  todoIconSrc: '/static/images/home/todo.png',
  todoArrowIconSrc: '/static/images/home/todo-icon.png',
  messageLabel: '未读消息',
  messageIconSrc: '/static/images/home/copy.png',
  messageArrowIconSrc: '/static/images/home/copy-icon.png',
  todoUrl: '/pages/bpm/index?tab=todo',
  messageUrl: '/pages/message/index',
})

const userStore = useUserStore()

/** 实际使用的用户信息 */
const currentUserInfo = computed(() => props.userInfo || userStore.userInfo)

const todoNum = ref(0)
const messageNum = ref(0)

/** 路由跳转 */
function navigate(url: string) {
  if (props.navigateTo) {
    props.navigateTo(url)
  } else {
    defaultNavigateTo(url)
  }
}

function handleTodoClick() {
  navigate(props.todoUrl!)
}

function handleMessageClick() {
  navigate(props.messageUrl!)
}

/** 默认获取待办数量 */
async function defaultFetchTodoCount(): Promise<number> {
  const data = await getTaskTodoPage({ pageNo: 1, pageSize: 1 })
  return data.total || 0
}

/** 默认获取消息数量 */
async function defaultFetchMessageCount(): Promise<number> {
  const data = await getMyNotifyMessagePage({ pageNo: 1, pageSize: 1, readStatus: false })
  return data.total || 0
}

/** 刷新数据 */
async function refreshData() {
  const fetchTodo = props.fetchTodoCount || defaultFetchTodoCount
  const fetchMessage = props.fetchMessageCount || defaultFetchMessageCount
  todoNum.value = await fetchTodo()
  messageNum.value = await fetchMessage()
}

onMounted(() => {
  refreshData()
})

onShow(() => {
  refreshData()
})

defineExpose({
  refreshData,
})
</script>

<style lang="scss" scoped>
.todo {
  background: linear-gradient(180deg, #cee7ff 0%, #ffffff 100%);
  border: 2rpx solid #ffffff;
}
.copy {
  background: linear-gradient(180deg, #fff3eb 0%, #ffffff 100%);
  border: 2rpx solid #ffffff;
}
</style>
