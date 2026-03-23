<template>
  <view class="mx-20rpx mt-20rpx overflow-hidden rounded-16rpx bg-white">
    <wd-swiper
      :list="list"
      :autoplay="autoplay"
      :interval="interval"
      :indicator-position="indicatorPosition"
      :image-mode="imageMode"
      :height="height"
      custom-class="rounded-16rpx overflow-hidden"
      @click="handleClick"
    />
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HomeBanner',
})

withDefaults(defineProps<{
  /** 轮播图列表 */
  list: string[]
  /** 是否自动播放 */
  autoplay?: boolean
  /** 自动播放间隔（毫秒） */
  interval?: number
  /** 指示器位置 */
  indicatorPosition?: string
  /** 图片模式 */
  imageMode?: string
  /** 高度 */
  height?: string
}>(), {
  autoplay: true,
  interval: 5000,
  indicatorPosition: 'bottom-right',
  imageMode: 'aspectFill',
  height: '300rpx',
})

const emit = defineEmits<{
  'click': [index: number]
}>()

/** 处理点击 */
function handleClick(index: number) {
  emit('click', index)
}
</script>
