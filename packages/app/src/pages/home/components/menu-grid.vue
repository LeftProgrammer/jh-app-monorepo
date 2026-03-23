<template>
  <view>
    <wd-grid :column="column" clickable :border="false">
      <wd-grid-item
        v-for="menu in menus"
        :key="menu.key"
        :text="menu.name"
        @itemclick="handleClick(menu)"
      >
        <template #icon>
          <view
            class="h-80rpx w-80rpx flex items-center justify-center rounded-16rpx"
            :style="getIconStyle(menu)"
          >
            <wd-icon
              v-if="menu.icon"
              :name="menu.icon"
              size="50rpx"
              :color="menu.iconColor"
            />
            <image
              v-else
              class="w-100% h-100%"
              :src="getIconSrc(menu)"
            />
          </view>
        </template>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script lang="ts" setup>
import type { MenuItem } from '../types'

defineOptions({
  name: 'HomeMenuGrid',
})

const props = withDefaults(defineProps<{
  /** 菜单列表 */
  menus: MenuItem[]
  /** 列数 */
  column?: number
  /** 图标路径前缀 */
  iconPrefix?: string
}>(), {
  column: 5,
  iconPrefix: '/static/framework/menus/',
})

const emit = defineEmits<{
  'click': [menu: MenuItem]
}>()

/** 处理菜单点击 */
function handleClick(menu: MenuItem) {
  emit('click', menu)
}

/** 获取图标路径 */
function getIconSrc(menu: MenuItem): string {
  return `${props.iconPrefix}${menu.key}.png`
}

/** 获取图标样式 */
function getIconStyle(menu: MenuItem) {
  return {
    backgroundColor: menu.iconColor ? `${menu.iconColor}20` : '#f5f5f5',
    color: menu.iconColor || '#666',
  }
}
</script>

<style lang="scss" scoped>
:deep(.wd-grid-item__text) {
  font-size: 24rpx;
  color: #333;
  overflow: visible;
  white-space: nowrap;
}
</style>
