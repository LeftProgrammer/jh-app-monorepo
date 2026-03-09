<template>
  <view class="pt-82rpx mb-16rpx">
    <!-- 用户信息区域 -->
    <view class="flex mb-19rpx">
      <image :src="userInfo.avatar" class="h-80rpx w-80rpx mr-18rpx" />
      <view class="text-#fff">
        <view class="text-31rpx">
          {{ userInfo.deptName || "暂无部门" }}
        </view>
        <view class="text-23rpx">
          {{ userInfo.nickname || userInfo.username }}
        </view>
      </view>
    </view>
    
    <!-- Banner 区域 -->
    <slot name="banner">
      <image :src="bannerImage" class="h-206rpx w-100% mb-15rpx" />
    </slot>
    
    <!-- 卡片区域 -->
    <slot name="cards">
      <view class="flex gap-18rpx">
        <!-- 待办卡片 -->
        <view
          class="flex-1 todo rounded-8rpx h-100% px-31rpx py-17rpx flex"
          @click="handleTodoClick"
        >
          <slot name="todo-icon">
            <image
              :src="todoIcon"
              class="w-103rpx h-103rpx mr-55rpx"
            />
          </slot>
          <view>
            <view class="text-46rpx text-#1D2129">
              {{ displayTodoNum }}
              <image class="w-19rpx h-19rpx" :src="todoCountIcon" />
            </view>
            <view class="text-27rpx text-#86909C"> 待办任务 </view>
          </view>
        </view>
        
        <!-- 消息卡片 -->
        <view
          class="h-100% flex-1 copy rounded-8rpx h-100% px-31rpx py-17rpx flex"
          @click="handleMessageClick"
        >
          <slot name="message-icon">
            <image
              :src="messageIcon"
              class="w-103rpx h-103rpx mr-50rpx"
            />
          </slot>
          <view>
            <view class="text-46rpx text-#1D2129">
              {{ displayMessageNum }}
              <image class="w-19rpx h-19rpx" src="/static/images/home/copy-icon.png" />
            </view>
            <view class="text-27rpx text-#86909C"> 未读消息 </view>
          </view>
        </view>
      </view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";
import { getTaskTodoPage } from "@/api/bpm/task";
import { getMyNotifyMessagePage } from "@/api/system/notify/message";
import { isTabBarPage } from "@/components/tabbar/config";
import { useToast } from "wot-design-uni";
import { parseUrl, setTabParams } from "@/utils/url";

defineOptions({
  name: "UserHeader"
});

interface Props {
  // 基础数据
  userInfo?: any;
  todoNum?: number;
  messageNum?: number;
  
  // 静态资源配置
  bannerImage?: string;
  todoIcon?: string;
  todoCountIcon?: string;
  messageIcon?: string;
  
  // 路由配置
  todoRoute?: string;
  messageRoute?: string;
  
  // 功能开关
  autoFetch?: boolean; // 是否自动获取数据
  showGreeting?: boolean; // 是否显示问候语（预留）
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: undefined,
  todoNum: undefined,
  messageNum: undefined,
  bannerImage: '/static/images/home/banner.png',
  todoIcon: '/static/images/home/todo.png',
  todoCountIcon: '/static/images/home/todo-icon.png',
  messageIcon: '/static/images/home/copy.png',
  todoRoute: '/pages/bpm/index?tab=todo',
  messageRoute: '/pages/message/index',
  autoFetch: true,
  showGreeting: true
});

// 事件
const emit = defineEmits<{
  todoClick: [todoNum: number];
  messageClick: [messageNum: number];
  todoFetched: [count: number];
  messageFetched: [count: number];
}>();

const toast = useToast();
const userStore = useUserStore();
const { userInfo: storeUserInfo } = storeToRefs(userStore);

// 计算属性
const userInfo = computed(() => props.userInfo || storeUserInfo.value);
const todoNum = ref(0);
const messageNum = ref(0);

// 显示的数据（优先使用传入的数据）
const displayTodoNum = computed(() => {
  return props.todoNum !== undefined ? props.todoNum : todoNum.value;
});

const displayMessageNum = computed(() => {
  return props.messageNum !== undefined ? props.messageNum : messageNum.value;
});

/** 根据时间获取问候语 */
const greeting = computed(() => {
  if (!props.showGreeting) return '';
  const hour = new Date().getHours();
  if (hour < 6) return "凌晨好";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 17) return "下午好";
  if (hour < 19) return "傍晚好";
  return "晚上好";
});

/** 路由跳转 */
function routerTo(url: string) {
  const { path, query } = parseUrl(url);
  if (isTabBarPage(path)) {
    if (Object.keys(query).length > 0) {
      setTabParams(query);
    }
    uni.switchTab({
      url: path,
      fail: () => toast.show("页面不存在")
    });
  } else {
    uni.navigateTo({
      url: path,
      fail: () => toast.show("页面不存在")
    });
  }
}

/** 获取待办数量 */
async function fetchTodoCount() {
  try {
    const data = await getTaskTodoPage({ pageNo: 1, pageSize: 1 });
    const count = data.total || 0;
    todoNum.value = count;
    emit('todoFetched', count);
    return count;
  } catch (error) {
    console.error('获取待办数量失败:', error);
    todoNum.value = 0;
    return 0;
  }
}

/** 获取消息数量 */
async function fetchMessageCount() {
  try {
    const data = await getMyNotifyMessagePage({ 
      pageNo: 1, 
      pageSize: 1, 
      readStatus: false 
    });
    const count = data.total || 0;
    messageNum.value = count;
    emit('messageFetched', count);
    return count;
  } catch (error) {
    console.error('获取消息数量失败:', error);
    messageNum.value = 0;
    return 0;
  }
}

/** 事件处理 */
function handleTodoClick() {
  emit('todoClick', displayTodoNum.value);
  routerTo(props.todoRoute);
}

function handleMessageClick() {
  emit('messageClick', displayMessageNum.value);
  routerTo(props.messageRoute);
}

/** 暴露方法给外部使用 */
defineExpose({
  fetchTodoCount,
  fetchMessageCount,
  refreshData: async () => {
    const results = await Promise.all([
      fetchTodoCount(),
      fetchMessageCount()
    ]);
    return { todoCount: results[0], messageCount: results[1] };
  }
});

/** 自动获取数据 */
onShow(async () => {
  if (!props.autoFetch) return;
  
  // 如果已经传入了数据，不需要自动获取
  if (props.todoNum !== undefined && props.messageNum !== undefined) return;
  
  // 并行获取数据
  await Promise.all([
    props.todoNum === undefined ? fetchTodoCount() : Promise.resolve(),
    props.messageNum === undefined ? fetchMessageCount() : Promise.resolve()
  ]);
});
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
