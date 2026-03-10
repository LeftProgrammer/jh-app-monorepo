<template>
  <view class="settings-page">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="全部功能"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    >
      <template #right>
        <text v-if="!isEdit" @click="toggleEditMode" class="edit-btn">编辑</text>
        <wd-button v-else @click="saveChanges" :round="false" size="small" type="primary">完成</wd-button>
      </template>
    </wd-navbar>

    <!-- 搜索框 -->
    <view class="search-container">
      <wd-search
        v-model="searchKeyword"
        placeholder="搜索功能"
        hide-cancel
        :placeholder-left="true"
        @search="handleSearch"
        @clear="handleSearchClear"
      />
    </view>

    <!-- 常用功能区域 -->
    <view v-if="favoriteMenus.length > 0" class="section">
      <view class="section-header">
        <text class="section-title">首页功能</text>
        <text class="section-count">({{ favoriteMenus.length }})</text>
      </view>
      
      <wd-grid :column="5" clickable :border="false" class="menu-grid">
        <wd-grid-item v-for="menu in favoriteMenus" :key="menu.key">
          <MenuSettingItem 
            :menu="menu" 
            :is-edit="isEdit"
            :is-favorite="true"
            @click="handleMenuClick"
            @toggle="handleToggleFavorite"
          />
        </wd-grid-item>
      </wd-grid>
    </view>

    <!-- 全部功能区域 -->
    <view class="section" id="menuGroups">
      <view class="section-header">
        <text class="section-title">全部功能</text>
        <text class="section-count">({{ totalMenuCount }})</text>
      </view>
      
      <view
        v-for="group in filteredMenuGroups"
        :key="group.key"
        class="group-section"
      >
        <view class="group-header">
          <text class="group-name">{{ group.name }}</text>
          <text class="group-count">({{ group.menus.length }})</text>
        </view>
        
        <wd-grid :column="5" clickable :border="false" class="menu-grid">
          <wd-grid-item v-for="menu in group.menus" :key="menu.key">
            <MenuSettingItem 
              :menu="menu" 
              :is-edit="isEdit"
              :is-favorite="isInFavorites(menu)"
              @click="handleMenuClick"
              @toggle="handleToggleFavorite"
            />
          </wd-grid-item>
        </wd-grid>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredMenuGroups.length === 0 && favoriteMenus.length === 0" class="empty-state">
      <wd-icon name="search" size="80rpx" color="#ddd" />
      <text class="empty-text">未找到相关功能</text>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom" />
  </view>
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from "../menu-config";
import { useToast } from "wot-design-uni";
import { useUserStore } from "../../../store/user";
import { navigateBackPlus } from "../../../utils";
import { getMenuGroups, getMenuItemByKey } from "../menu-config";
import { parseUrl, setTabParams } from "../../../utils/url";
import { isTabBarPage } from "../../../components/tabbar/config";

defineOptions({
  name: "FavoriteSettings"
});

definePage({
  style: {
    navigationStyle: "custom"
  }
});

// 组件引入
const MenuSettingItem = defineComponent({
  props: {
    menu: { type: Object, required: true },
    isEdit: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false }
  },
  emits: ['click', 'toggle'],
  setup(props, { emit }) {
    function handleClick() {
      emit('click', props.menu);
    }
    
    function handleToggle() {
      emit('toggle', props.menu);
    }
    
    return { handleClick, handleToggle };
  },
  template: `
    <view class="menu-item" @click="handleClick">
      <!-- 编辑模式下的操作按钮 -->
      <view v-if="isEdit" class="action-btn" @click.stop="handleToggle">
        <wd-icon 
          :name="isFavorite ? 'subtract' : 'plus'" 
          size="30rpx" 
          :color="isFavorite ? '#f5222d' : '#52c41a'"
        />
      </view>
      
      <!-- 菜单图标 -->
      <image
        class="menu-icon"
        :src="getMenuImageUrl(menu)"
        mode="aspectFill"
      />
      
      <!-- 菜单名称 -->
      <text class="menu-name">{{ menu.name }}</text>
    </view>
  `
});

// 响应式数据
const userStore = useUserStore();
const toast = useToast();

const searchKeyword = ref("");
const menuGroups = ref<MenuGroup[]>([]);
const favoriteMenus = ref<MenuItem[]>([]);
const isEdit = ref(false);
const pendingChanges = ref<{ add: MenuItem[], remove: MenuItem[] }>({ add: [], remove: [] });

// 计算属性
const filteredMenuGroups = computed(() => {
  if (!searchKeyword.value.trim()) {
    return menuGroups.value;
  }
  
  const keyword = searchKeyword.value.toLowerCase();
  return menuGroups.value
    .map((group) => ({
      ...group,
      menus: group.menus.filter((menu) => 
        menu.name.toLowerCase().includes(keyword) ||
        menu.key.toLowerCase().includes(keyword)
      )
    }))
    .filter((group) => group.menus.length > 0);
});

const totalMenuCount = computed(() => {
  return filteredMenuGroups.value.reduce((total, group) => total + group.menus.length, 0);
});

// 工具函数
function getMenuImageUrl(menu: MenuItem): string {
  if (menu.imageUrl) return menu.imageUrl;
  return `/static/images/menus/${menu.key}.png`;
}

function isInFavorites(menu: MenuItem): boolean {
  return favoriteMenus.value.some((m) => m.key === menu.key);
}

// 事件处理
function handleBack() {
  if (hasPendingChanges()) {
    uni.showModal({
      title: '提示',
      content: '您有未保存的更改，确定要离开吗？',
      success: (res) => {
        if (res.confirm) {
          navigateBackPlus();
        }
      }
    });
  } else {
    navigateBackPlus();
  }
}

function toggleEditMode() {
  if (favoriteMenus.value.length === 0) {
    toast.show('暂无常用功能');
    return;
  }
  isEdit.value = !isEdit.value;
  if (!isEdit.value) {
    // 退出编辑模式时重置待保存的更改
    pendingChanges.value = { add: [], remove: [] };
    refreshFavoriteMenus();
  }
}

function hasPendingChanges(): boolean {
  return pendingChanges.value.add.length > 0 || pendingChanges.value.remove.length > 0;
}

function handleMenuClick(menu: MenuItem) {
  if (isEdit.value) return;
  
  if (!menu.url) {
    toast.show("功能开发中");
    return;
  }

  navigateToPage(menu.url);
}

function handleToggleFavorite(menu: MenuItem) {
  if (!isEdit.value) return;
  
  const isFavorite = isInFavorites(menu);
  
  if (isFavorite) {
    // 从常用中移除
    removeFromFavorites(menu);
  } else {
    // 添加到常用
    addToFavorites(menu);
  }
}

function addToFavorites(menu: MenuItem) {
  // 检查是否在待移除列表中
  const removeIndex = pendingChanges.value.remove.findIndex(item => item.key === menu.key);
  if (removeIndex !== -1) {
    // 从待移除列表中移除
    pendingChanges.value.remove.splice(removeIndex, 1);
  } else {
    // 添加到待添加列表（如果不在其中）
    const addIndex = pendingChanges.value.add.findIndex(item => item.key === menu.key);
    if (addIndex === -1) {
      pendingChanges.value.add.push(menu);
    }
  }
  
  // 更新本地显示
  favoriteMenus.value.push(menu);
}

function removeFromFavorites(menu: MenuItem) {
  // 检查是否在待添加列表中
  const addIndex = pendingChanges.value.add.findIndex(item => item.key === menu.key);
  if (addIndex !== -1) {
    // 从待添加列表中移除
    pendingChanges.value.add.splice(addIndex, 1);
  } else {
    // 添加到待移除列表（如果不在其中）
    const removeIndex = pendingChanges.value.remove.findIndex(item => item.key === menu.key);
    if (removeIndex === -1) {
      pendingChanges.value.remove.push(menu);
    }
  }
  
  // 更新本地显示
  const index = favoriteMenus.value.findIndex(item => item.key === menu.key);
  if (index !== -1) {
    favoriteMenus.value.splice(index, 1);
  }
}

function saveChanges() {
  const { add, remove } = pendingChanges.value;
  
  // 执行添加操作
  add.forEach(menu => {
    const keys = [...userStore.favoriteMenus];
    if (!keys.includes(menu.key)) {
      keys.push(menu.key);
      userStore.setFavoriteMenus(keys);
    }
  });
  
  // 执行移除操作
  remove.forEach(menu => {
    const keys = [...userStore.favoriteMenus];
    const index = keys.indexOf(menu.key);
    if (index > -1) {
      keys.splice(index, 1);
      userStore.setFavoriteMenus(keys);
    }
  });
  
  // 重置状态
  pendingChanges.value = { add: [], remove: [] };
  isEdit.value = false;
  
  toast.success("保存成功");
}

function navigateToPage(url: string) {
  const { path, query } = parseUrl(url);

  if (isTabBarPage(path)) {
    if (Object.keys(query).length > 0) {
      setTabParams(query);
    }
    uni.switchTab({
      url: path,
      fail: () => toast.show("页面不存在")
    });
  } else {
    uni.navigateTo({
      url: url,
      fail: () => toast.show("页面不存在")
    });
  }
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword;
}

function handleSearchClear() {
  searchKeyword.value = "";
}

function refreshFavoriteMenus() {
  const keys = userStore.favoriteMenus;
  if (!keys || keys.length === 0) {
    favoriteMenus.value = [];
    return;
  }
  
  favoriteMenus.value = keys
    .map((key) => getMenuItemByKey(key))
    .filter(Boolean) as MenuItem[];
}

function initData() {
  menuGroups.value = getMenuGroups();
  refreshFavoriteMenus();
}

// 生命周期
onLoad(() => {
  initData();
});

onShow(() => {
  // 页面显示时刷新数据，以防在其他页面修改了常用功能
  if (!isEdit.value) {
    refreshFavoriteMenus();
  }
});
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-container {
  padding: 20rpx;
  background-color: white;
}

.section {
  margin-top: 20rpx;
  background-color: white;
  padding: 0 31rpx 23rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 23rpx 0;
}

.section-title {
  font-size: 31rpx;
  color: #1D2129;
  font-weight: 500;
}

.section-count {
  font-size: 24rpx;
  color: #999;
}

.group-section {
  margin-top: 20rpx;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.group-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.group-count {
  font-size: 24rpx;
  color: #999;
}

.menu-grid {
  margin-top: 20rpx;
}

.menu-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
}

.action-btn {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.menu-icon {
  width: 61rpx;
  height: 61rpx;
  margin-bottom: 8rpx;
}

.menu-name {
  font-size: 23rpx;
  color: #4E5969;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-btn {
  color: #1890ff;
  font-size: 28rpx;
  padding: 10rpx 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  background-color: white;
  margin-top: 20rpx;
}

.empty-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.safe-area-bottom {
  height: 40rpx;
}
</style>
