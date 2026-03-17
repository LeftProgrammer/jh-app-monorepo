<template>
  <view class="yd-page-container">
    <!-- 顶部背景区域 -->
    <view class="header-bg h-366rpx w-full flex items-center">
      <!-- 用户信息卡片 -->
      <view
        class="user-card flex items-center rounded-12rpx px-50rpx w-full content-box"
        @click="handleGoProfile"
      >
        <view
          class="avatar-wrapper mr-24rpx h-120rpx w-120rpx overflow-hidden rounded-full"
        >
          <image :src="userInfo.avatar" mode="aspectFill" class="h-full w-full" />
        </view>
        <view class="max-w-[calc(100%-220rpx)]">
          <view class="mb-8rpx text-40rpx text-[#fff] font-semibold">
            {{ userInfo.nickname || userInfo.username }}
          </view>
          <view
            class="text-30rpx text-[#fff] bg-[#F5AB66] h-46rpx line-height-46rpx rounded-23rpx px-32rpx py-4rpx text-ellipsis"
          >
            {{ userProfile ? userProfile.dept?.name || "暂无部门" : "" }}
          </view>
        </view>
      </view>
    </view>

    <!-- 菜单区域 -->
    <view class="mx-24rpx -mt-56rpx">
      <wd-cell-group custom-class="menu-group" border>
        <wd-cell title="个人资料" is-link @click="handleGoProfile">
          <template #icon>
            <wd-icon name="user" size="16px" color="#4E5969" class="mr-16rpx" />
          </template>
        </wd-cell>
        <wd-cell title="账号安全" is-link @click="handleGoSecurity">
          <template #icon>
            <wd-icon name="lock-on" size="16px" color="#4E5969" class="mr-16rpx" />
          </template>
        </wd-cell>
      </wd-cell-group>
      <wd-cell-group custom-class="menu-group mt-24rpx" border>
        <wd-cell title="意见反馈" is-link @click="handleGoFeedback">
          <template #icon>
            <wd-icon name="edit" size="16px" color="#4E5969" class="mr-16rpx" />
          </template>
        </wd-cell>
        <wd-cell title="应用设置" is-link @click="handleGoSettings">
          <template #icon>
            <wd-icon name="setting" size="16px" color="#4E5969" class="mr-16rpx" />
          </template>
        </wd-cell>
      </wd-cell-group>
      <view class="mt-48rpx">
        <wd-button
          block
          type="error"
          class-prefix="login"
          :round="false"
          :plain="true"
          @click="handleLogout"
        >
          退出登录
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>

import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useToast } from "wot-design-uni";
import { useMessage } from "wot-design-uni";
import type { UserProfileVO } from "../../api/system/user/profile";
import { getUserProfile } from "../../api/system/user/profile";
import { getLoginPage } from "../../config/framework";
import { useUserStore } from "../../store";
import { useTokenStore } from "../../store/token";

definePage({
  style: {
    navigationStyle: "custom"
  }
});

const userStore = useUserStore();
const message = useMessage();
const tokenStore = useTokenStore();
const toast = useToast();
const { userInfo } = storeToRefs(userStore);
const userProfile = ref<UserProfileVO | null>(null); // 用户详细信息

/** 页面加载时获取用户信息 */
onMounted(async () => {
  userProfile.value = await getUserProfile();
  await userStore.fetchUserInfo();
});

/** 跳转到个人资料 */
function handleGoProfile() {
  uni.navigateTo({ url: "/pages-core/user/profile/index" });
}

/** 跳转到账号安全 */
function handleGoSecurity() {
  uni.navigateTo({ url: "/pages-core/user/security/index" });
}

/** 跳转到意见反馈 */
function handleGoFeedback() {
  uni.navigateTo({ url: "/pages-core/user/feedback/index" });
}

/** 跳转到应用设置 */
function handleGoSettings() {
  uni.navigateTo({ url: "/pages-core/user/settings/index" });
}

/** 退出登录 */
function handleLogout() {
  message
    .confirm({
      msg: "您确认退出当前账号吗？",
      title: "提示"
    })
    .then(async () => {
      console.log("点击了确定按钮");
      await tokenStore.logout();
      toast.success("退出登录成功");
      setTimeout(() => {
        uni.reLaunch({ url: getLoginPage() });
      }, 500);
    })
    .catch(() => {
      console.log("点击了取消按钮");
    });
  // uni.showModal({
  //   title: "提示",
  //   content: "确定要退出登录吗？",
  //   success: async (res) => {
  //     if (!res.confirm) {
  //       return;
  //     }
  //     toast.success("退出登录成功");
  //     setTimeout(() => {
  //       uni.reLaunch({ url: getLoginPage() });
  //     }, 500);
  //   }
  // });
}
</script>

<style lang="scss" scoped>
// 顶部渐变背景
.header-bg {
  background: linear-gradient(180deg, #0eb5a5 0%, #6dd5ce 100%);
  border-radius: 0 0 60rpx 60rpx;
}

// 用户卡片阴影
.user-card {
  // box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
}

// 头像边框
.avatar-wrapper {
  // border: 4rpx solid #f5f5f5;
  // box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}
.wd-button {
  background: #ffefef !important;
  border-radius: 8rpx 8rpx 8rpx 8rpx;
  border: 2rpx solid #f53f3f;
}
// 菜单组样式
:deep(.menu-group) {
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 8rpx rgba(24, 144, 255, 0.06);
}
</style>
