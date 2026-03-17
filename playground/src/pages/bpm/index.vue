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
    <!-- 搜索区 -->
    <!-- 列表内容 -->
    <view class="content" :style="{ paddingTop: `${getNavbarHeight()}px` }">
      <TodoList v-show="tabType === 'todo'" />
      <DoneList v-show="tabType === 'done'" />
      <MyList v-show="tabType === 'my'" />
      <CopyList v-show="tabType === 'copy'" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getNavbarHeight } from "@/utils";
import { computed, ref } from "vue";
import { getAndClearTabParams } from "@/utils";
import CopyList from "./components/copy-list.vue";
import DoneList from "./components/done-list.vue";
import MyList from "./components/my-list.vue";
import TodoList from "./components/todo-list.vue";
import { useGlobalState } from "@/store";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const globalState = useGlobalState();
const tabTypes: string[] = ["todo", "done", "my", "copy"];
const tabIndex = ref(0);
const tabType = computed<string>(() => tabTypes[tabIndex.value]);

/** Tab 切换 */
function handleTabChange({ index }: { index: number }) {
  tabIndex.value = index;
}

const todoTotal = computed(() => {
  return 0 || globalState.globalConfig.todoTotal;
});
const todoBadgeProps = ref({
  modelValue: todoTotal,
  max: 99,
  right: "-8px"
});

/** 初始化：根据 tab 参数设置默认 tab */
onShow(() => {
  // 从 globalData 获取参数（switchTab 跳转时使用）
  const tabParams = getAndClearTabParams();
  if (tabParams?.tab) {
    const index = tabTypes.indexOf(tabParams.tab);
    if (index !== -1) {
      tabIndex.value = index;
    }
  }
});
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
  z-index: 10;
  position: fixed;
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
  background: linear-gradient(
    180deg,
    #22b5af 0%,
    #3fc5be 10.52%,
    #95e6ea 20.26%,
    #f5f5f5 30%,
    #f5f5f5 100%
  );
}
</style>
