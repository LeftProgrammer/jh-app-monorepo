<template>
  <view class="bg-#FFF rounded-8rpx">
    <wd-swiper
      :list="chunkedMenus"
      :indicator="{ type: 'dots-bar' }"
      :autoplay="false"
      :height="height"
    >
      <template #default="{ item }">
        <wd-grid :column="column" clickable :border="false" class="w-100% !h-100%">
          <wd-grid-item
            v-for="menu in item"
            :key="menu.key"
            :text="menu.name"
            @itemclick="handleClick(menu)"
          >
            <view>
              <image
                class="w-61rpx h-61rpx"
                :src="getIconSrc(menu)"
              />
              <view class="text-#4E5969 text-23rpx">{{ menu.name }}</view>
            </view>
          </wd-grid-item>
        </wd-grid>
      </template>
    </wd-swiper>
  </view>
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from '../types'
import { useUserStore } from '../../../store'
import { defaultNavigateTo, getAllMenuItems } from '../utils'

defineOptions({
  name: 'HomeMenuSection',
})

const props = withDefaults(defineProps<{
  /** 常用菜单列表（可选，默认从 store 获取） */
  menus?: MenuItem[]
  /** 菜单分组数据（用于根据 key 查找菜单，当 menus 未传入时使用） */
  menuGroups?: MenuGroup[]
  /** 列数 */
  column?: number
  /** 每页行数 */
  rows?: number
  /** 高度 */
  height?: string
  /** 图标路径前缀 */
  iconPrefix?: string
  /** 是否显示更多按钮 */
  showMore?: boolean
  /** 更多按钮文字 */
  moreText?: string
  /** 更多按钮 key */
  moreKey?: string
  /** 设置页面路径 */
  settingsUrl?: string
  /** 菜单点击处理函数（可选，默认跳转菜单 url） */
  onMenuClick?: (menu: MenuItem) => void
  /** 路由跳转函数（可选，默认使用 uni.navigateTo） */
  navigateTo?: (url: string) => void
  /** 显示 toast（可选，默认使用 uni.showToast） */
  showToast?: (message: string) => void
}>(), {
  column: 5,
  rows: 2,
  height: '280rpx',
  iconPrefix: '/static/framework/menus/',
  showMore: true,
  moreText: '更多',
  moreKey: 'more',
  settingsUrl: '/pages/home/menu',
})

const userStore = useUserStore()

/** 根据 keys 获取菜单列表 */
function getMenusByKeys(keys: string[]): MenuItem[] {
  if (!props.menuGroups) return []
  const allMenus = getAllMenuItems(props.menuGroups)
  return keys.map(key => allMenus.find(m => m.key === key)).filter(Boolean) as MenuItem[]
}

/** 实际使用的菜单列表 */
const actualMenus = computed(() => {
  if (props.menus) return props.menus
  const keys = userStore.favoriteMenus || []
  return getMenusByKeys(keys)
})

/** 每页菜单数量 */
const pageSize = computed(() => props.column * props.rows - (props.showMore ? 1 : 0))

/** 分块后的菜单（用于分页轮播） */
const chunkedMenus = computed(() => {
  const result: MenuItem[][] = []
  let index = 0
  const menus = actualMenus.value

  while (index < menus.length) {
    const chunk = menus.slice(index, index + pageSize.value)
    if (props.showMore) {
      chunk.push({ name: props.moreText, key: props.moreKey })
    }
    result.push(chunk)
    index += pageSize.value
  }

  // 如果没有菜单，也显示更多按钮
  if (menus.length === 0 && props.showMore) {
    result.push([{ name: props.moreText, key: props.moreKey }])
  }

  return result
})

/** 获取图标路径 */
function getIconSrc(menu: MenuItem): string {
  return `${props.iconPrefix}${menu.key}.png`
}

/** 路由跳转 */
function navigate(url: string) {
  if (props.navigateTo) {
    props.navigateTo(url)
  } else {
    defaultNavigateTo(url)
  }
}

/** 默认 toast */
function toast(message: string) {
  if (props.showToast) {
    props.showToast(message)
  } else {
    uni.showToast({ title: message, icon: 'none' })
  }
}

/** 处理菜单点击 */
function handleClick(menu: MenuItem) {
  if (menu.key === props.moreKey) {
    navigate(props.settingsUrl!)
    return
  }
  if (props.onMenuClick) {
    props.onMenuClick(menu)
  } else if (menu.url) {
    navigate(menu.url)
  } else {
    toast('功能开发中')
  }
}
</script>

<style lang="scss" scoped>
:deep(.wd-swiper) {
  .wd-swiper__item {
    align-items: flex-start;
    padding: 20rpx 0;
  }
  .wd-swiper-nav {
    bottom: 16rpx;
    .wd-swiper-nav__item--dots-bar {
      background: #e0e0e0;
      &.is-active {
        background-color: #009688;
      }
    }
  }
}
:deep(.wd-grid) {
  .wd-grid-item {
    height: 50%;
  }
  .wd-grid-item__content {
    padding: 15rpx 0;
  }
}
</style>
