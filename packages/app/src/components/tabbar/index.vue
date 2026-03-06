<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { CustomTabBarItem } from "./types";
import { 
  createTabbarConfig, 
  type TabbarPackageConfig
} from "./config";
import { 
  createTabbarHooks,
  type TabbarHooks
} from "./hooks";
import { 
  createTabbarStore
} from "./store";

interface Props {
  /** Tabbar 配置 */
  config?: TabbarPackageConfig
  /** Tabbar 钩子 */
  hooks?: TabbarHooks
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  hooks: () => ({}),
})

// 合并配置
const config = computed(() => createTabbarConfig(props.config))

// 创建钩子
const tabbarHooks = computed(() => createTabbarHooks(props.hooks))

// 创建状态
const { tabbarList, tabbarStore } = createTabbarStore(
  config.value.items,
  config.value.features.bulge
)

// 当前选中状态
const currentIndex = ref(tabbarStore.curIdx)

// #ifdef MP-WEIXIN
defineOptions({ virtualHost: true });
// #endif

/**
 * 鼓包点击事件
 */
function handleClickBulge() {
  tabbarHooks.value.onBulgeClick?.()
}

/**
 * 项目点击事件
 */
async function handleClick(index: number) {
  if (index === currentIndex.value) return
  
  const item = tabbarList[index]
  
  if (item.isBulge) {
    handleClickBulge()
    return
  }
  
  // 执行前置钩子
  const canNavigate = await tabbarHooks.value.beforeNavigate?.(index, item)
  if (canNavigate === false) return
  
  // 更新状态
  tabbarStore.setCurIdx(index)
  currentIndex.value = index
  
  // 导航
  const url = item.pagePath
  if (config.value.features.cache) {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}

/**
 * 获取颜色
 */
const getColorByIndex = (index: number) => {
  return currentIndex.value === index 
    ? config.value.theme.activeColor 
    : config.value.theme.inactiveColor
}

/**
 * 获取图标
 */
function getImageByIndex(index: number, item: CustomTabBarItem) {
  if (!item.iconActive) {
    console.warn("image 模式下，需要配置 iconActive")
    return item.icon
  }
  return currentIndex.value === index ? item.iconActive : item.icon
}

/**
 * 获取角标
 */
const getTotal = computed(() => {
  return (item: CustomTabBarItem) => {
    if (!config.value.features.badge) return undefined
    
    const badge = tabbarHooks.value.getBadge?.(item)
    if (!badge) return undefined
    
    if (typeof badge === 'number') return badge > 99 ? "99+" : badge
    return badge
  }
})

// 隐藏原生 tabbar
// #ifndef MP-WEIXIN || MP-ALIPAY
onMounted(() => {
  if (config.value.features.hideNative) {
    uni.hideTabBar({
      fail: (err: any) => console.log("hideTabBar fail: ", err),
      success: () => console.log('hideTabBar success')
    })
  }
})
// #endif

onMounted(() => {
  // 支付宝小程序需要在 onMounted 中隐藏
  // #ifdef MP-ALIPAY
  if (config.value.features.hideNative) {
    uni.hideTabBar({
      fail: (err: any) => console.log("hideTabBar fail: ", err),
      success: () => console.log('hideTabBar success')
    })
  }
  // #endif
})
</script>

<template>
  <view v-if="config.strategy === 2 || config.strategy === 3" class="h-50px pb-safe">
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
              <image class="mt-6rpx h-200rpx w-200rpx" src="/static/tabbar/scan.png" />
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
            <view v-if="getTotal(item)">
              <template v-if="getTotal(item) === 'dot'">
                <view class="absolute right-0 top-0 h-2 w-2 rounded-full bg-#f56c6c" />
              </template>
              <template v-else>
                <view
                  class="absolute top-0 box-border h-5 min-w-5 center rounded-full bg-#f56c6c px-1 text-center text-xs text-white -right-3"
                >
                  {{ getTotal(item) }}
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
