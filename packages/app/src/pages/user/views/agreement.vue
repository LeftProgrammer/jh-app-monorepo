<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="用户协议"
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
          <!-- 默认协议内容 -->
          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">一、总则</text>
            <text class="block">
              1.1 欢迎使用本应用。在使用本应用前，请您仔细阅读本协议。
            </text>
            <text class="mt-16rpx block">
              1.2 您在使用本应用时，即表示您已充分阅读、理解并接受本协议的全部内容。
            </text>
            <text class="mt-16rpx block">
              1.3 本应用有权根据需要不时地修订本协议，修订后的协议一经公布即生效。
            </text>
          </view>

          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">二、服务内容</text>
            <text class="block">
              2.1 本应用为用户提供企业管理、数据分析、业务处理等相关服务。
            </text>
            <text class="mt-16rpx block">
              2.2 本应用保留随时变更、中断或终止部分或全部服务的权利。
            </text>
          </view>

          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">三、用户账号</text>
            <text class="block">
              3.1 用户在使用本应用服务前需要注册账号。用户应当对其账号和密码的安全负责。
            </text>
            <text class="mt-16rpx block">
              3.2 用户不得将账号转让、出借或以任何方式提供给他人使用。
            </text>
          </view>

          <view class="mb-32rpx">
            <text class="mb-16rpx block text-gray-800 font-bold">四、用户行为规范</text>
            <text class="block">
              4.1 用户在使用本应用服务时，必须遵守国家法律法规，不得利用本应用从事违法违规活动。
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
  name: 'UserAgreementPage',
})

const props = withDefaults(defineProps<{
  /** 协议标题 */
  title?: string
  /** 更新日期 */
  updateDate?: string
  /** 返回页面路径 */
  backUrl?: string
}>(), {
  title: '用户服务协议',
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
