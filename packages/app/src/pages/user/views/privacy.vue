<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="隐私协议"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 协议内容 -->
    <view class="p-32rpx">
      <view class="mb-40rpx text-center">
        <text class="text-36rpx text-gray-800 font-bold">{{ title }}</text>
      </view>

      <view class="text-28rpx text-gray-600 leading-relaxed">
        <slot>
          <!-- 默认隐私政策内容 -->
          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">引言</text>
            <text class="block">
              本应用非常重视用户的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
            </text>
          </view>

          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">一、我们收集的信息</text>
            <text class="block">
              1.1 账号信息：当您注册账号时，我们会收集您的手机号码、邮箱地址等信息。
            </text>
            <text class="mt-16rpx block">
              1.2 个人资料：您可以选择填写昵称、头像、性别等个人资料信息。
            </text>
            <text class="mt-16rpx block">
              1.3 设备信息：我们可能会收集您的设备型号、操作系统版本等信息。
            </text>
          </view>

          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">二、信息的使用</text>
            <text class="block">
              2.1 为您提供服务：我们使用收集的信息来提供、维护和改进我们的服务。
            </text>
            <text class="mt-16rpx block">
              2.2 安全保障：我们使用信息来验证身份、预防欺诈和保护账号安全。
            </text>
          </view>

          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">三、您的权利</text>
            <text class="block">
              3.1 访问权：您有权访问我们持有的关于您的个人信息。
            </text>
            <text class="mt-16rpx block">
              3.2 更正权：如果您发现我们持有的个人信息不准确，您有权要求更正。
            </text>
            <text class="mt-16rpx block">
              3.3 删除权：在特定情况下，您有权要求我们删除您的个人信息。
            </text>
          </view>

          <view class="mt-48rpx text-center text-24rpx text-gray-400">
            <text>最后更新日期：{{ updateDate }}</text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'UserPrivacyPage',
})

const props = withDefaults(defineProps<{
  /** 协议标题 */
  title?: string
  /** 更新日期 */
  updateDate?: string
  /** 返回页面路径 */
  backUrl?: string
}>(), {
  title: '隐私保护政策',
  updateDate: '2025 年 1 月 1 日',
  backUrl: '',
})

function handleBack() {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl })
  } else {
    uni.navigateBack()
  }
}
</script>
