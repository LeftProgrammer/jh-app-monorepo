<script setup lang="ts">
/**
 * 通用 Tabbar 组件
 *
 * 完整封装了 tabbar 的所有逻辑，外部只需提供配置即可使用
 */
import type {
  CustomTabBarItem,
  TabbarFullConfig,
  TabbarStoreInterface,
} from './types'

// ===================== Props =====================
interface Props {
  /** Tabbar 配置 */
  config: TabbarFullConfig
  /** Tabbar 列表（响应式） */
  tabbarList: CustomTabBarItem[]
  /** Tabbar Store */
  tabbarStore: TabbarStoreInterface
  /** 角标获取函数（从外部状态获取） */
  getBadgeValue?: (key: string) => number | undefined
}

const props = withDefaults(defineProps<Props>(), {
  getBadgeValue: () => undefined,
})

// ===================== Emits =====================
const emit = defineEmits<{
  /** 鼓包点击事件 */
  (e: 'bulge-click'): void
  /** 项目点击事件 */
  (e: 'item-click', index: number, item: CustomTabBarItem): void
}>()

// #ifdef MP-WEIXIN
defineOptions({ virtualHost: true })
// #endif

// ===================== 事件处理 =====================
function handleClickBulge() {
  emit('bulge-click')
  props.config.onBulgeClick()
}

function handleClick(index: number) {
  // 点击原来的不做操作
  if (index === props.tabbarStore.curIdx) {
    return
  }

  const item = props.tabbarList[index]

  if (item.isBulge) {
    handleClickBulge()
    return
  }

  // 触发导航前回调
  const shouldNavigate = props.config.beforeNavigate(index, item)
  if (shouldNavigate === false) {
    return
  }

  // 触发点击事件
  emit('item-click', index, item)

  // 更新状态并导航
  props.tabbarStore.setCurIdx(index)
  const url = item.pagePath
  if (props.config.tabbarCacheEnable) {
    uni.switchTab({ url })
  }
  else {
    uni.navigateTo({ url })
  }
}

// ===================== 隐藏原生 tabbar =====================
// #ifndef MP-WEIXIN || MP-ALIPAY
onLoad(() => {
  if (props.config.needHideNativeTabbar) {
    uni.hideTabBar({ fail: console.log })
  }
})
// #endif

// #ifdef MP-ALIPAY
onMounted(() => {
  if (props.config.customTabbarEnable) {
    uni.hideTabBar({ fail: console.log })
  }
})
// #endif

// ===================== 辅助函数 =====================
function getColorByIndex(index: number) {
  return props.tabbarStore.curIdx === index
    ? props.config.theme.activeColor
    : props.config.theme.inactiveColor
}

function getImageByIndex(index: number, item: CustomTabBarItem) {
  if (!item.iconActive) {
    console.warn('image 模式下，需要配置 iconActive (高亮时的图片），否则无法切换高亮图片')
    return item.icon
  }
  return props.tabbarStore.curIdx === index ? item.iconActive : item.icon
}

function getBadgeDisplay(badge: any) {
  if (!badge) return undefined
  if (badge === 'dot') return 'dot'

  // 如果是数字直接返回
  if (typeof badge === 'number') {
    return badge > 99 ? '99+' : badge
  }

  // 如果是字符串，从外部获取值
  const val = props.getBadgeValue?.(badge) ?? props.config.getBadgeValue(badge)
  if (!val) return undefined
  return val > 99 ? '99+' : val
}
</script>

<template>
  <view v-if="config.customTabbarEnable" class="h-50px pb-safe">
    <view class="border-and-fixed bg-white" @touchmove.stop.prevent>
      <view class="h-50px flex items-center">
        <view
          v-for="(item, index) in tabbarList"
          :key="index"
          class="flex flex-1 flex-col items-center justify-center"
          :style="{ color: getColorByIndex(index) }"
          @click="handleClick(index)"
        >
          <view v-if="item.isBulge" class="relative">
            <!-- 中间鼓包按钮 -->
            <view class="bulge">
              <image class="mt-6rpx h-200rpx w-200rpx" :src="config.bulgeImage" />
            </view>
          </view>
          <view v-else class="relative px-3 text-center">
            <template v-if="item.iconType === 'uiLib'">
              <wd-icon :name="item.icon" size="20" />
            </template>
            <template v-if="item.iconType === 'unocss' || item.iconType === 'iconfont'">
              <view :class="item.icon" class="text-20px" />
            </template>
            <template v-if="item.iconType === 'image'">
              <image
                :src="getImageByIndex(index, item)"
                mode="scaleToFill"
                class="h-20px w-20px"
              />
            </template>
            <view class="mt-2px text-12px">
              {{ item.text }}
            </view>
            <!-- 角标显示 -->
            <view v-if="item.badge">
              <template v-if="item.badge === 'dot'">
                <view class="absolute right-0 top-0 h-2 w-2 rounded-full bg-#f56c6c" />
              </template>
              <template v-else-if="getBadgeDisplay(item.badge)">
                <view
                  class="absolute top-0 box-border h-5 min-w-5 center rounded-full bg-#f56c6c px-1 text-center text-xs text-white -right-3"
                >
                  {{ getBadgeDisplay(item.badge) }}
                </view>
              </template>
            </view>
          </view>
        </view>
      </view>

      <view class="pb-safe" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.border-and-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top: 1px solid #eee;
  box-sizing: border-box;
}

.bulge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform-origin: top center;
  transform: translateX(-50%) scale(0.5) translateY(-33%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250rpx;
  height: 250rpx;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px #fefefe;

  &:active {
    opacity: 0.8;
  }
}
</style>
