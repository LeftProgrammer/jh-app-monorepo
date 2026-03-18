<template>
  <view class="bg-#FFF rounded-8rpx">
    <wd-swiper
      :list="favoriteMenuItems"
      :indicator="{ type: 'dots-bar' }"
      :autoplay="false"
      height="280rpx"
    >
      <template #default="{ item }">
        <wd-grid :column="5" clickable :border="false" class="w-100% !h-100%">
          <wd-grid-item
            v-for="menu in item"
            :key="menu.key"
            :text="menu.name"
            @itemclick="handleClick(menu)"
          >
            <view>
              <image
                class="w-61rpx h-61rpx"
                :src="`/static/images/menus/${menu.key}.png`"
              />
              <view class="text-#4E5969 text-23rpx">{{ menu.name }}</view>
            </view>
          </wd-grid-item>
        </wd-grid>
      </template>
    </wd-swiper>
  </view>
  <!-- <scroll-view class="min-h-0 flex-1" scroll-y scroll-with-animation> -->
  <!-- 常用分组 -->
  <!-- <view class="mx-20rpx mt-20rpx overflow-hidden rounded-16rpx bg-white"> -->
  <!-- <view class="flex items-center justify-between px-24rpx">
        <text class="text-31rpx text-#1D2129 font-500">常用功能</text>
        <view class="p-10rpx" @click="handleGotoFavoriteSettings">
          <wd-icon name="setting" size="32rpx" color="#4E5969" />
        </view>
      </view> -->
  <!-- <MenuGrid v-if="favoriteMenuItems.length > 0" :menus="favoriteMenuItems" /> -->
  <!-- <view
        v-else
        class="mx-24rpx mb-24rpx flex items-center border-1rpx border-#ddd rounded-12rpx border-dashed px-24rpx py-12rpx"
        @click="handleGotoFavoriteSettings"
      >
        <wd-icon name="add" size="32rpx" color="#999" />
        <text class="pl-10rpx text-28rpx text-#999">添加我常用的</text>
      </view> -->
  <!-- </view> -->

  <!-- 菜单分组 -->
  <!-- <view
      v-for="group in menuGroups"
      :key="group.key"
      class="mx-20rpx mt-20rpx overflow-hidden rounded-16rpx bg-white"
    >
      <view class="px-24rpx pb-0 pt-20rpx">
        <text class="text-31rpx text-#1D2129 font-500">{{ group.name }}</text>
      </view>
      <MenuGrid :menus="group.menus" />
    </view> -->

  <!-- 底部安全区域 -->
  <!-- <view class="h-40rpx" /> -->
  <!-- </scroll-view> -->
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from "../index";
import { useUserStore } from '@/store';
import { getMenuGroups, getMenuItemByKey } from "../index";
import MenuGrid from "./menu-grid.vue";
import { useToast } from "wot-design-uni";
import { parseUrl, setTabParams } from "@/utils";
import { isPageTabbar } from "@/tabbar/store";

defineOptions({
  name: "MenuSection"
});

const userStore = useUserStore();
const toast = useToast();

/** 菜单分组列表 */
const menuGroups = ref<MenuGroup[]>([]);

/** 常用服务菜单（从 store 中计算得出） */
const favoriteMenuItems = computed<MenuItem[]>(() => {
  const keys = userStore.favoriteMenus;
  let menus = [];
  if (keys && keys.length >= 0) {
    menus = keys.map((key) => getMenuItemByKey(key)).filter(Boolean) as MenuItem[];
  }
  function chunk(arr, size) {
    const result = [];
    let index = 0;
    while (index < arr.length) {
      result.push([...arr.slice(index, index + size), { name: "更多", key: "more" }]);
      index += size;
    }
    if (arr.length === 0) {
      result.push([{ name: "更多", key: "more" }]);
    }
    return result;
  }
  return chunk(menus, 9);
});

/** 初始化数据 */
function initData() {
  menuGroups.value = getMenuGroups();
}
/** 处理菜单点击 */
function handleClick(menu: MenuItem) {
  console.log("点击菜单：", menu);
  if (menu.key === "more") {
    handleGotoFavoriteSettings();
    return;
  }
  if (!menu.url) {
    toast.show("功能开发中");
    return;
  }

  // 解析 URL，提取路径和参数
  const { path, query } = parseUrl(menu.url);

  // 判断是否是 tabBar 页面
  if (isPageTabbar(path)) {
    // tabBar 页面：通过 globalData 传参，使用 switchTab 跳转
    if (Object.keys(query).length > 0) {
      setTabParams(query);
    }
    uni.switchTab({
      url: path,
      fail: () => {
        toast.show("页面不存在");
      }
    });
  } else {
    // 普通页面：使用 navigateTo 跳转
    uni.navigateTo({
      url: menu.url,
      fail: () => {
        toast.show("页面不存在");
      }
    });
  }
}
/** 跳转到常用服务设置页面 */
function handleGotoFavoriteSettings() {
  uni.navigateTo({
    url: "/pages/index/settings/index"
  });
}

/**
 * 初始化
 *
 * 不使用 onMounted 的原因是：登录后，页面可能已经挂载，但数据需要重新初始化
 */
onShow(() => {
  initData();
});
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
