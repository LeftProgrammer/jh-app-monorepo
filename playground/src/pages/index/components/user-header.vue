<template>
  <view class="mb-16rpx pt-82rpx">
    <view class="mb-19rpx flex">
      <image :src="userInfo.avatar" class="mr-18rpx h-80rpx w-80rpx" />
      <view class="text-#fff">
        <view class="text-31rpx">
          {{ userInfo.deptName || "暂无部门" }}
        </view>
        <view class="text-23rpx">
          {{ userInfo.nickname || userInfo.username }}
        </view>
      </view>
    </view>
    <image src="/static/images/home/banner.png" class="mb-15rpx h-206rpx w-100%" />
    <view class="flex gap-18rpx">
      <view
        class="todo h-100% flex flex-1 rounded-8rpx px-31rpx py-17rpx"
        @click="routerTo('/pages/bpm/index?tab=todo')"
      >
        <image
          src="/static/images/home/todo.png"
          class="mr-55rpx h-103rpx w-103rpx"
        />
        <view>
          <view class="text-46rpx text-#1D2129">
            {{ todoNum }}
            <image class="h-19rpx w-19rpx" src="/static/images/home/todo-icon.png" />
          </view>
          <view class="text-27rpx text-#86909C">
            待办任务
          </view>
        </view>
      </view>
      <view
        class="copy h-100% h-100% flex flex-1 rounded-8rpx px-31rpx py-17rpx"
        @click="routerTo('/pages/message/index')"
      >
        <image
          src="/static/images/home/copy.png"
          class="mr-50rpx h-103rpx w-103rpx"
        />
        <view>
          <view class="text-46rpx text-#1D2129">
            {{ messageNum }}
            <image class="h-19rpx w-19rpx" src="/static/images/home/copy-icon.png" />
          </view>
          <view class="text-27rpx text-#86909C">
            未读消息
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useToast } from 'wot-design-uni'
import { getTaskTodoPage } from '@/api/bpm/task'
import { getMyNotifyMessagePage } from '@/api/system/notify/message'
import { useUserStore } from '@/store'
import { isTabBarPage } from '@/tabbar/config'
import { parseUrl, setTabParams } from '@/utils'

defineOptions({
  name: 'UserHeader',
})

const toast = useToast()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

/** 根据时间获取问候语 */
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) {
    return '凌晨好'
  } else if (hour < 9) {
    return '早上好'
  } else if (hour < 12) {
    return '上午好'
  } else if (hour < 14) {
    return '中午好'
  } else if (hour < 17) {
    return '下午好'
  } else if (hour < 19) {
    return '傍晚好'
  } else {
    return '晚上好'
  }
})

/** 描述语 */
const description = computed(() => {
  const hour = new Date().getHours()
  if (hour < 9) {
    return '开始新的一天，加油！'
  } else if (hour < 12) {
    return '工作顺利，效率满满！'
  } else if (hour < 14) {
    return '午休时间，记得休息~'
  } else if (hour < 18) {
    return '继续努力，收获满满！'
  } else {
    return '辛苦了，注意休息！'
  }
})
function routerTo(url: string) {
  const { path, query } = parseUrl(url)
  // 判断是否是 tabBar 页面
  if (isTabBarPage(path)) {
    if (Object.keys(query).length > 0) {
      setTabParams(query)
    }
    uni.switchTab({
      url: path,
      fail: () => {
        toast.show('页面不存在')
      },
    })
  } else {
    // 普通页面：使用 navigateTo 跳转
    uni.navigateTo({
      url: path,
      fail: () => {
        toast.show('页面不存在')
      },
    })
  }
}
const todoNum = ref(0)
const messageNum = ref(0)
onShow(async () => {
  const data = await getTaskTodoPage({
    pageNo: 1,
    pageSize: 1,
  })
  todoNum.value = data.total || 0
  const messageData = await getMyNotifyMessagePage({
    pageNo: 1,
    pageSize: 1,
    readStatus: false,
  })
  messageNum.value = messageData.total || 0
})
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  border: 3rpx solid #f0f0f0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}
.todo {
  background: linear-gradient(180deg, #cee7ff 0%, #ffffff 100%);
  border: 2rpx solid #ffffff;
}
.copy {
  background: linear-gradient(180deg, #fff3eb 0%, #ffffff 100%);
  border: 2rpx solid #ffffff;
}
</style>
