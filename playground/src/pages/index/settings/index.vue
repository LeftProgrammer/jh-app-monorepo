<template>
  <view class="yd-page-container">
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
        <text v-if="!isEdit" @click="isEdit = !isEdit">编辑</text>
        <wd-button v-else @click="save" :round="false" size="small">完成</wd-button>
      </template>
    </wd-navbar>

    <!-- 搜索框 -->
    <view>
      <wd-search
        v-model="searchKeyword"
        placeholder="搜索常用"
        hide-cancel
        :placeholder-left="true"
      />
    </view>
    <!-- 常用区域 -->
    <view class="mt-20rpx overflow-hidden bg-white px-31rpx py-23rpx">
      <view class="text-31rpx text-#1D2129 font-500"> 首页功能 </view>
      <!-- 常用分组 -->
      <wd-grid :column="5" clickable :border="false">
        <wd-grid-item v-for="menu in favoriteMenus" :key="menu.key">
          <view class="position-relative" @click="delMenu(menu)">
            <image
              v-if="isEdit"
              src="/static/images/home/subtract.png"
              class="w-30rpx h-30rpx position-absolute top-0 right-0"
            />
            <image
              class="w-61rpx h-61rpx"
              :src="`/static/images/menus/${menu.key}.png`"
            />
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
        <view class="text-31rpx text-#1D2129 font-500"> {{ group.name }} </view>
        <wd-grid :column="5" clickable :border="false">
          <wd-grid-item v-for="menu in group.menus" :key="menu.key" :text="menu.name">
            <view class="position-relative" @click="addMenu(menu)">
              <image
                v-if="isEdit && !favoriteMenus.find((x) => x.key === menu.key)"
                src="/static/images/home/plus.png"
                class="w-30rpx h-30rpx position-absolute top-0 right-0"
              />
              <image
                class="w-61rpx h-61rpx"
                :src="`/static/images/menus/${menu.key}.png`"
              />
              <view class="text-#4E5969 text-23rpx">{{ menu.name }}</view>
            </view>
            <!-- <template #icon>
              <view
                class="h-80rpx w-80rpx flex items-center justify-center rounded-16rpx"
              >
                <image
                  class="w-100% h-100%"
                  :src="`/static/images/menus/${menu.key}.png`"
                />
              </view>
            </template> -->
          </wd-grid-item>
        </wd-grid>
        <!-- <view class="menu-list">
          <view v-for="menu in group.menus" :key="menu.key" class="menu-item">
            <view class="menu-item__left">
              <view
                class="menu-item__icon"
                :style="{
                  backgroundColor: menu.iconColor ? `${menu.iconColor}20` : '#f5f5f5'
                }"
              >
                <wd-icon
                  v-if="menu.icon"
                  :name="menu.icon"
                  size="40rpx"
                  :color="menu.iconColor"
                />
                <image
                  v-else
                  class="w-100% h-100%"
                  :src="`/static/images/menus/${menu.key}.png`"
                />
              </view>
              <text class="menu-item__name">{{ menu.name }}</text>
            </view>
            <view class="menu-item__right">
              <wd-button
                v-if="isInFavorites(menu)"
                size="small"
                type="warning"
                plain
                @click="handleRemoveFavorite(menu)"
              >
                从常用移除
              </wd-button>
              <wd-button
                v-else
                size="small"
                type="primary"
                plain
                @click="handleAddFavorite(menu)"
              >
                添加至常用
              </wd-button>
            </view>
          </view> 
        </view>-->
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="h-40rpx" />
  </view>
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from "../index";
import { useToast } from "wot-design-uni";
import { useUserStore } from "@/store";
import { navigateBackPlus } from "@/utils";
import { getMenuGroups, getMenuItemByKey } from "../index";
import { parseUrl, setTabParams } from "@/utils";
import { isPageTabbar } from "@/tabbar/store";
defineOptions({
  name: "FavoriteSettings"
});

definePage({
  style: {
    navigationStyle: "custom"
  }
});

const userStore = useUserStore();
const toast = useToast();

const searchKeyword = ref(""); // 搜索关键词
const menuGroups = ref<MenuGroup[]>([]); // 菜单分组列表
const favoriteMenus = ref<MenuItem[]>([]);

/** 过滤后的菜单分组 */
const filteredMenuGroups = computed(() => {
  if (!searchKeyword.value) {
    return menuGroups.value;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return menuGroups.value
    .map((group) => ({
      ...group,
      menus: group.menus.filter((menu) => menu.name.toLowerCase().includes(keyword))
    }))
    .filter((group) => group.menus.length > 0);
});

/** 返回上一页 */
function handleBack() {
  navigateBackPlus();
}
const isEdit = ref(false);
const addMenus = ref([]);
const delMenus = ref([]);
function addMenu(menu) {
  if (!isEdit.value) {
    handleClick(menu);
    return;
  }
  const index1 = favoriteMenus.value.findIndex((item) => item.key === menu.key);
  if (index1 !== -1) return;
  const index = delMenus.value.findIndex((item) => item.key === menu.key);
  if (index === -1) {
    addMenus.value.push(menu);
  } else {
    delMenus.value.splice(index, 1);
  }
  favoriteMenus.value.push(menu);
}
function delMenu(menu) {
  if (!isEdit.value) {
    handleClick(menu);
    return;
  }
  const index = addMenus.value.findIndex((item) => item.key === menu.key);
  if (index === -1) {
    delMenus.value.push(menu);
  } else {
    addMenus.value.splice(index, 1);
  }
  const index1 = favoriteMenus.value.findIndex((item) => item.key === menu.key);
  favoriteMenus.value.splice(index1, 1);
}

function save() {
  // console.log(addMenus.value, delMenus.value, "添加和删除的菜单");
  addMenus.value.forEach((item) => {
    handleAddFavorite(item);
  });
  delMenus.value.forEach((item) => {
    handleRemoveFavorite(item);
  });
  toast.success("保存成功");
  isEdit.value = false;
}

/** 处理菜单点击 */
function handleClick(menu: MenuItem) {
  console.log("点击菜单：", menu);
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
/** 初始化数据 */
function initData() {
  menuGroups.value = getMenuGroups();
}

/** 处理添加常用服务 */
function handleAddFavorite(menu: MenuItem) {
  const keys = [...userStore.favoriteMenus];
  if (!keys.includes(menu.key)) {
    keys.push(menu.key);
    userStore.setFavoriteMenus(keys);
  }
  // toast.success("已添加");
}

/** 处理移除常用服务 */
function handleRemoveFavorite(menu: MenuItem) {
  const keys = [...userStore.favoriteMenus];
  const index = keys.indexOf(menu.key);
  if (index > -1) {
    keys.splice(index, 1);
    userStore.setFavoriteMenus(keys);
  }
  // toast.success("已移除");
}

/** 检查菜单是否已添加到常用服务 */
function isInFavorites(menu: MenuItem): boolean {
  return favoriteMenus.value.some((m) => m.key === menu.key);
}

/** 滚动到菜单分组区域 */
function scrollToGroups() {
  uni.pageScrollTo({
    selector: "#menuGroups",
    duration: 300
  });
}

onLoad(() => {
  initData();
  const keys = userStore.favoriteMenus;
  if (!keys || keys.length === 0) {
    return [];
  }
  favoriteMenus.value = keys
    .map((key) => getMenuItemByKey(key))
    .filter(Boolean) as MenuItem[];
});
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
