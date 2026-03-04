<template>
  <view class="mt-16rpx bg-white">
    <view class="p-24rpx">
      <view
        class="relative mb-16rpx border-b-2rpx border-#E5E6EB border-b-solid pb-10rpx pl-20rpx"
      >
        <view class="absolute left-0 top-18rpx w-8rpx h-20rpx bg-#00B42A"></view>
        <text class="text-32rpx text-[#1D2129] font-bold">流转记录</text>
      </view>
      <!-- 任务列表 -->
      <view
        v-for="(task, index) in sortedTasks"
        :key="task.id || index"
        class="flex gap-12px"
      >
        <!-- 状态-时间 -->
        <view class="w-25%">
          <view class="text-14px mb-4px" :class="getStatusTextClass(task.status)">
            {{ getStatusText(task.status) }}
          </view>
          <view class="text-12px text-#4E5969">
            {{ formatDate(task.endTime, "MM-DD HH:mm") }}
          </view>
        </view>
        <!-- 时间线 -->
        <view class="flex flex-col items-center">
          <view class="h-16rpx w-16rpx rounded-full" :class="getTaskDotClass(task)" />
          <view
            v-if="index < sortedTasks.length - 1"
            class="w-2rpx bg-[#e5e5e5] h-[calc(100%-16rpx)]"
          />
        </view>
        <!-- 任务内容 -->
        <view class="flex-1 pb-16rpx">
          <view class="text-28rpx text-#1D2129 font-bold">{{ task.name }}</view>
          <view v-if="task.assigneeUser" class="text-#4E5969 text-28rpx mt-8rpx">
            {{ task.assigneeUser?.nickname }}
          </view>
          <view v-if="task.reason" class="mt-4rpx text-#4E5969 text-28rpx mt-8rpx">
            {{ task.reason }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { formatDate, formatPast } from "@/utils/date";
import type { Task } from "@/api/bpm/task";

const props = defineProps({
  runningTask: {
    type: Object
  },
  sortedTasks: {
    type: Array
  }
});

function getTaskDotClass(task: Task) {
  if ([1, 6, 7].includes(task.status)) {
    return "bg-[#1890ff]";
  }
  if (task.status === 2) {
    return "bg-[#52c41a]";
  }
  if (task.status === 3) {
    return "bg-[#ff4d4f]";
  }
  if (task.status === 5) {
    return "bg-[#faad14]";
  }
  return "bg-[#d9d9d9]";
}
function getStatusTextClass(status: number) {
  if ([1, 6, 7].includes(status)) {
    return "text-[#1890ff]";
  }
  if (status === 2) {
    return "text-[#52c41a]";
  }
  if (status === 3) {
    return "text-[#ff4d4f]";
  }
  if (status === 5) {
    return "text-[#faad14]";
  }
  return "text-[#999]";
}

function getStatusText(status?: number) {
  const map: Record<number, string> = {
    0: "待审批",
    1: "审批中",
    2: "审批通过",
    3: "审批不通过",
    4: "已取消",
    5: "已退回",
    6: "委派中",
    7: "审批通过中"
  };
  return map[status ?? 0] || "待审批";
}
</script>

<style scoped lang="scss"></style>
