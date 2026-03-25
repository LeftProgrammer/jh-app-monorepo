<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="title"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    >
      <template #right>
        <text v-if="!isEdit" @click="isEdit = !isEdit">编辑</text>
        <wd-button v-else :round="false" size="small" @click="handleSave">完成</wd-button>
      </template>
    </wd-navbar>

    <!-- 搜索框 -->
    <view>
      <wd-search
        v-model="searchKeyword"
        :placeholder="searchPlaceholder"
        hide-cancel
        :placeholder-left="true"
      />
    </view>

    <!-- 常用区域 -->
    <view class="mt-20rpx overflow-hidden bg-white px-31rpx py-23rpx">
      <view class="text-31rpx text-#1D2129 font-500">{{ favoriteTitle }}</view>
      <wd-grid :column="column" clickable :border="false">
        <wd-grid-item v-for="menu in currentFavoriteMenus" :key="menu.key">
          <view class="position-relative" @click="handleFavoriteClick(menu)">
            <image
              v-if="isEdit"
              :src="removeIconSrc"
              class="w-30rpx h-30rpx position-absolute top-0 right-0"
            />
            <image class="w-61rpx h-61rpx" :src="getIconSrc(menu)" />
            <view class="text-#4E5969 text-23rpx">{{ menu.name }}</view>
          </view>
        </wd-grid-item>
      </wd-grid>
    </view>

    <!-- 菜单分组 -->
    <view id="menuGroups">
      <view
        v-for="group in filteredMenuGroups"
        :key="group.key"
        class="mt-20rpx overflow-hidden bg-white px-31rpx py-23rpx"
      >
        <view class="text-31rpx text-#1D2129 font-500">{{ group.name }}</view>
        <wd-grid :column="column" clickable :border="false">
          <wd-grid-item v-for="menu in group.menus" :key="menu.key" :text="menu.name">
            <view class="position-relative" @click="handleMenuClick(menu)">
              <image
                v-if="isEdit && !isFavorite(menu)"
                :src="addIconSrc"
                class="w-30rpx h-30rpx position-absolute top-0 right-0"
              />
              <image class="w-61rpx h-61rpx" :src="getIconSrc(menu)" />
              <view class="text-#4E5969 text-23rpx">{{ menu.name }}</view>
            </view>
          </wd-grid-item>
        </wd-grid>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="h-40rpx" />
  </view>
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from '../types'
import { useUserStore } from '../../../store'
import { defaultNavigateTo, getAllMenuItems } from '../utils'

defineOptions({
  name: 'HomeMenuPage',
})

const props = withDefaults(
  defineProps<{
    /** 菜单分组列表（必传） */
    menuGroups: MenuGroup[]
    /** 常用菜单列表（可选，默认从 store 获取） */
    favoriteMenus?: MenuItem[]
    /** 页面标题 */
    title?: string
    /** 搜索框占位符 */
    searchPlaceholder?: string
    /** 常用功能标题 */
    favoriteTitle?: string
    /** 菜单点击处理函数（可选，默认跳转菜单 url） */
    onMenuClick?: (menu: MenuItem) => void
    /** 保存常用菜单的回调（可选，默认保存到 store） */
    onSave?: (keys: string[]) => void
    /** 列数 */
    column?: number
    /** 图标路径前缀 */
    iconPrefix?: string
    /** 添加图标路径 */
    addIconSrc?: string
    /** 移除图标路径 */
    removeIconSrc?: string
    /** 路由跳转函数（可选，默认使用 uni.navigateTo） */
    navigateTo?: (url: string) => void
    /** 显示 toast（可选，默认使用 uni.showToast） */
    showToast?: (message: string) => void
    /** 显示成功 toast（可选，默认使用 uni.showToast） */
    showSuccess?: (message: string) => void
  }>(),
  {
    title: '全部功能',
    searchPlaceholder: '搜索常用',
    favoriteTitle: '首页功能',
    column: 5,
    iconPrefix: '/static/framework/menus/',
    addIconSrc: '/static/framework/home/plus.png',
    removeIconSrc: '/static/framework/home/subtract.png',
  }
)

const userStore = useUserStore()

/** 根据 keys 获取菜单列表 */
function getMenusByKeys(keys: string[]): MenuItem[] {
  const allMenus = getAllMenuItems(props.menuGroups || [])
  return keys.map(key => allMenus.find(m => m.key === key)).filter(Boolean) as MenuItem[]
}

const searchKeyword = ref('')
const isEdit = ref(false)
const addedMenus = ref<MenuItem[]>([])
const removedMenus = ref<MenuItem[]>([])

/** 本地常用菜单（用于编辑时的临时状态） */
const localFavoriteMenus = ref<MenuItem[]>([])

/** 从 props 或 store 获取常用菜单列表 */
const propFavoriteMenus = computed<MenuItem[]>(() => {
  if (props.favoriteMenus) return props.favoriteMenus
  const keys = userStore.favoriteMenus || []
  return getMenusByKeys(keys)
})

/** 初始化本地常用菜单 */
watch(
  propFavoriteMenus,
  newVal => {
    localFavoriteMenus.value = [...newVal]
  },
  { immediate: true }
)

/** 过滤后的菜单分组 */
const filteredMenuGroups = computed(() => {
  const groups = props.menuGroups || []
  if (!searchKeyword.value) {
    return groups
  }
  const keyword = searchKeyword.value.toLowerCase()
  return groups
    .map(group => ({
      ...group,
      menus: group.menus.filter(menu => menu.name.toLowerCase().includes(keyword)),
    }))
    .filter(group => group.menus.length > 0)
})

/** 当前显示的常用菜单（编辑模式使用本地状态） */
const currentFavoriteMenus = computed(() => {
  return isEdit.value ? localFavoriteMenus.value : propFavoriteMenus.value
})

/** 获取图标路径 */
function getIconSrc(menu: MenuItem): string {
  return `${props.iconPrefix}${menu.key}.png`
}

/** 检查是否已添加到常用 */
function isFavorite(menu: MenuItem): boolean {
  return localFavoriteMenus.value.some(m => m.key === menu.key)
}

/** 返回上一页 */
function handleBack() {
  uni.navigateBack()
}

/** 路由跳转 */
function navigate(url: string) {
  if (props.navigateTo) {
    props.navigateTo(url)
  } else {
    defaultNavigateTo(url)
  }
}

/** 默认成功 toast */
function toastSuccess(message: string) {
  if (props.showSuccess) {
    props.showSuccess(message)
  } else {
    uni.showToast({ title: message, icon: 'success' })
  }
}

/** 保存 */
function handleSave() {
  // 计算最终的 keys
  const currentKeys = propFavoriteMenus.value.map(m => m.key)
  const addedKeys = addedMenus.value.map(m => m.key)
  const removedKeys = removedMenus.value.map(m => m.key)
  const finalKeys = [...currentKeys.filter(k => !removedKeys.includes(k)), ...addedKeys]

  if (props.onSave) {
    props.onSave(finalKeys)
  } else {
    // 默认保存到 store
    userStore.setFavoriteMenus(finalKeys)
    toastSuccess('保存成功')
  }
  addedMenus.value = []
  removedMenus.value = []
  isEdit.value = false
}

/** 点击常用菜单 */
function handleFavoriteClick(menu: MenuItem) {
  if (!isEdit.value) {
    if (props.onMenuClick) {
      props.onMenuClick(menu)
    } else if (menu.url) {
      navigate(menu.url)
    }
    return
  }
  // 编辑模式：移除
  const addedIndex = addedMenus.value.findIndex(item => item.key === menu.key)
  if (addedIndex === -1) {
    removedMenus.value.push(menu)
  } else {
    addedMenus.value.splice(addedIndex, 1)
  }
  const localIndex = localFavoriteMenus.value.findIndex(item => item.key === menu.key)
  if (localIndex !== -1) {
    localFavoriteMenus.value.splice(localIndex, 1)
  }
}

/** 点击菜单分组中的菜单 */
function handleMenuClick(menu: MenuItem) {
  if (!isEdit.value) {
    if (props.onMenuClick) {
      props.onMenuClick(menu)
    } else if (menu.url) {
      navigate(menu.url)
    }
    return
  }
  // 编辑模式：添加
  if (isFavorite(menu)) return

  const removedIndex = removedMenus.value.findIndex(item => item.key === menu.key)
  if (removedIndex === -1) {
    addedMenus.value.push(menu)
  } else {
    removedMenus.value.splice(removedIndex, 1)
  }
  localFavoriteMenus.value.push(menu)
}
</script>

<style lang="scss" scoped>
.menu-list {
  padding: 0 30rpx 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__icon {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    margin-right: 24rpx;
  }

  &__name {
    font-size: 30rpx;
    color: #333;
  }

  &__right {
    display: flex;
    align-items: center;
  }
}
</style>
