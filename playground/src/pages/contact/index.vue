<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="navbarTitle"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="handleBack"
    />
    <!-- 面包屑导航 -->
    <Breadcrumb
      ref="breadcrumbRef"
      v-model="currentDeptId"
      v-model:current-dept="currentDep"
      class="hidden"
    />
    <!-- 通讯录列表 -->
    <view class="p-24rpx">
      <!-- 部门列表 -->
      <view
        v-for="item in currentDeptList"
        :key="`dept-${item.id}`"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleEnterDept(item)"
      >
        <view class="flex items-center p-24rpx">
          <view class="mr-16rpx h-80rpx w-80rpx rounded-8rpx">
            <image src="/static/images/contact/contact.png" class="h-full w-full" />
          </view>
          <view class="flex-1">
            <view class="text-28rpx text-[#333] font-medium">
              {{ item.name }}
            </view>
            <view
              v-if="item.children && item.children.length > 0"
              class="mt-8rpx text-24rpx text-[#999]"
            >
              {{ item.children.length }} 个子部门
            </view>
          </view>
          <image src="/static/images/contact/contact-right.png" class="w-19rpx h-19rpx" />
        </view>
      </view>

      <!-- 用户列表 -->
      <view
        v-if="currentDeptList.length > 0 && currentUserList.length > 0"
        class="my-24rpx flex items-center"
      >
        <view class="h-1rpx flex-1 bg-[#ddd]" />
        <text class="mx-16rpx text-24rpx text-[#999]">部门成员</text>
        <view class="h-1rpx flex-1 bg-[#ddd]" />
      </view>
      <view
        v-for="item in currentUserList"
        :key="`user-${item.id}`"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleUserClick(item)"
      >
        <view class="flex items-center p-24rpx">
          <view
            v-if="item.avatar"
            class="mr-16rpx h-80rpx w-80rpx overflow-hidden rounded-full"
          >
            <image :src="item.avatar" class="h-full w-full" mode="aspectFill" />
          </view>
          <view
            v-else
            class="mr-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-full bg-[#1890ff] text-32rpx text-white"
          >
            {{ item.nickname?.charAt(0) || item.username?.charAt(0) }}
          </view>
          <view class="flex-1">
            <view class="text-28rpx text-[#1D2129] font-medium">
              {{ item.nickname }}
            </view>
            <view class="text-23rpx text-[#86909C]">{{ item.mobile }}</view>
          </view>
          <image src="/static/images/contact/phone.png" class="w-61rpx h-61rpx" />
        </view>
      </view>

      <!-- 空状态 -->
      <view
        v-if="!loading && currentDeptList.length === 0 && currentUserList.length === 0"
        class="py-100rpx text-center"
      >
        <wd-status-tip image="content" tip="暂无数据" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { Dept } from "@/api/system/dept";
import type { User } from "@/api/system/user";
import { computed, onMounted, ref } from "vue";
import { useToast } from "wot-design-uni";
import { getSimpleDeptList } from "@/api/system/dept";
import { getUserPage, getUser } from "@/api/system/user";
import { findChildren, handleTree } from "@/utils";
import Breadcrumb from "./components/breadcrumb.vue";
import { navigateBackPlus } from "@/utils";
import { useUserStore } from "@/store";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const userStore = useUserStore();
const loading = ref(false);
const deptList = ref<Dept[]>([]); // 完整部门列表（树形结构）
const toast = useToast();
const userList = computed(() => userStore.userList);

const currentDep = ref(); // 当前层级的部门编号
const currentDeptId = ref(0); // 当前层级的部门编号
const breadcrumbRef = ref<InstanceType<typeof Breadcrumb>>();
const navbarTitle = computed(() => {
  return currentDep.value?.name || "通讯录";
});
/** 当前层级的部门列表 */
const currentDeptList = computed(() => {
  if (currentDeptId.value === 0) {
    return deptList.value.filter((item) => item.parentId === 0);
  }
  return findChildren(deptList.value, currentDeptId.value);
});

/** 当前层级的用户列表 */
const currentUserList = computed(() => {
  if (currentDeptId.value === 0) {
    // 根层级不显示用户，只显示部门
    return [];
  }
  return userList.value.filter((item) => item.deptId === currentDeptId.value);
});

/** 进入部门层级 */
function handleEnterDept(item: Dept) {
  breadcrumbRef.value?.enter({ id: item.id!, name: item.name });
}
function handleBack() {
  if (currentDeptId.value === 0) {
    navigateBackPlus();
    return;
  }
  breadcrumbRef.value?.back();
}
/** 点击用户：弹出联系方式;获取用户时已经获取到了手机号，不用再次获取 */
async function handleUserClick(item: User) {
  if (!item.mobile) {
    toast.show("暂无联系方式");
    return;
  }
  // #ifdef APP-PLUS
  uni.makePhoneCall({
    phoneNumber: item.mobile //仅为示例
  });
  // #endif
}

/** 初始化 */
onMounted(async () => {
  loading.value = true;
  try {
    // 获取部门列表
    const deptData = await getSimpleDeptList();
    deptList.value = handleTree(deptData);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
