<template>
  <view class="header flex flex-col items-center pb-60rpx pt-120rpx">
    <image class="mb-24rpx h-160rpx w-160rpx" :src="logo" mode="aspectFit" />
    <view class="text-44rpx text-[#1890ff] font-bold">
      {{ title }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getAppLogo, getAppTitle } from '../../../config/framework'

const title = getAppTitle()
const logo = getAppLogo()
</script>
