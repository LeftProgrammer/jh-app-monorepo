<template>
  <view :class="containerClass">
    <wd-swiper
      :list="swiperList"
      :indicator="indicatorConfig"
      :autoplay="autoplay"
      :height="height"
      v-bind="swiperProps"
      @click="handleSwiperClick"
      @change="handleSwiperChange"
    >
      <template #default="{ item }">
        <wd-grid 
          :column="column" 
          :clickable="clickable" 
          :border="border"
          v-bind="gridProps"
          class="w-100% !h-100%"
        >
          <wd-grid-item
            v-for="menu in item"
            :key="menu.key || menu.name"
            :text="menu.name"
            v-bind="getItemProps(menu)"
            @itemclick="handleClick(menu)"
          >
            <!-- 透传所有插槽 -->
            <template v-for="(_, name) in $slots" #[name]="slotData">
              <slot :name="name" :menu="menu" v-bind="slotData" />
            </template>
            
            <!-- 默认图标插槽 -->
            <template #icon v-if="!$slots.icon">
              <view class="menu-item">
                <image
                  v-if="menu.imageUrl || (!disableDefaultIcon && menu.key)"
                  class="menu-icon"
                  :src="getImageUrl(menu)"
                  :mode="imageMode"
                />
                <wd-icon
                  v-else-if="menu.icon"
                  :name="menu.icon"
                  :size="iconSize"
                  :color="menu.iconColor"
                />
              </view>
            </template>
          </wd-grid-item>
        </wd-grid>
      </template>
    </wd-swiper>
  </view>
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from "../menu-config";
import { useUserStore } from "../../../store/user";
import { getMenuGroups, getMenuItemByKey } from "../menu-config";
import { useToast } from "wot-design-uni";
import { parseUrl, setTabParams } from "../../../utils/url";
import { isTabBarPage } from "../../../components/tabbar/config";

defineOptions({
  name: "MenuSection"
});

interface Props {
  // 菜单数据
  favoriteMenus?: string[];
  chunkSize?: number;
  showMoreButton?: boolean;
  moreButtonText?: string;
  
  // Swiper 配置
  height?: string;
  autoplay?: boolean;
  indicatorConfig?: any;
  
  // Grid 配置
  column?: number;
  clickable?: boolean;
  border?: boolean;
  
  // 图标配置
  iconSize?: string | number;
  imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'none';
  disableDefaultIcon?: boolean;
  
  // 样式配置
  containerClass?: string;
  
  // 功能配置
  autoNavigate?: boolean;
  moreRoute?: string;
  
  // 透传属性
  swiperProps?: Record<string, any>;
  gridProps?: Record<string, any>;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  favoriteMenus: () => [],
  chunkSize: 9,
  showMoreButton: true,
  moreButtonText: '更多',
  
  height: '280rpx',
  autoplay: false,
  indicatorConfig: { type: 'dots-bar' },
  
  column: 5,
  clickable: true,
  border: false,
  
  iconSize: '61rpx',
  imageMode: 'aspectFill',
  disableDefaultIcon: false,
  
  containerClass: 'bg-#FFF rounded-8rpx',
  
  autoNavigate: true,
  moreRoute: '/pages/index/settings/index',
  
  swiperProps: () => ({}),
  gridProps: () => ({})
});

// 事件
const emit = defineEmits<{
  // 菜单点击事件
  click: [menu: MenuItem];
  // 更多按钮点击事件
  moreClick: [];
  // Swiper 事件
  swiperClick: [data: any];
  swiperChange: [index: number];
  // 自定义事件
  menuClick: [menu: MenuItem];
  settingsClick: [];
}>();

const userStore = useUserStore();
const toast = useToast();

// 计算属性
const menuGroups = ref<MenuGroup[]>([]);

/** 常用服务菜单（从 store 中计算得出） */
const favoriteMenuItems = computed<MenuItem[]>(() => {
  const keys = props.favoriteMenus.length > 0 ? props.favoriteMenus : userStore.favoriteMenus;
  let menus = [];
  if (keys && keys.length >= 0) {
    menus = keys.map((key) => getMenuItemByKey(key)).filter(Boolean) as MenuItem[];
  }
  
  function chunk(arr, size) {
    const result = [];
    let index = 0;
    while (index < arr.length) {
      const chunk = arr.slice(index, index + size);
      if (props.showMoreButton) {
        chunk.push({ name: props.moreButtonText, key: "more" });
      }
      result.push(chunk);
      index += size;
    }
    
    if (arr.length === 0 && props.showMoreButton) {
      result.push([{ name: props.moreButtonText, key: "more" }]);
    }
    return result;
  }
  
  return chunk(menus, props.chunkSize);
});

/** Swiper 列表 */
const swiperList = computed(() => favoriteMenuItems.value);

/** 获取菜单项属性 */
function getItemProps(menu: MenuItem) {
  return {
    // 可以根据需要返回 wd-grid-item 的额外属性
  };
}

/** 获取图片 URL */
function getImageUrl(menu: MenuItem) {
  if (menu.imageUrl) {
    return menu.imageUrl;
  }
  if (menu.key && !props.disableDefaultIcon) {
    return `/static/images/menus/${menu.key}.png`;
  }
  return '';
}

/** 初始化数据 */
function initData() {
  menuGroups.value = getMenuGroups();
}

/** 处理菜单点击 */
function handleClick(menu: MenuItem) {
  // 发出事件
  emit('click', menu);
  emit('menuClick', menu);
  
  console.log("点击菜单：", menu);
  
  if (menu.key === "more") {
    handleGotoFavoriteSettings();
    return;
  }
  
  if (!menu.url) {
    if (props.autoNavigate) {
      toast.show("功能开发中");
    }
    return;
  }

  // 自动导航
  if (props.autoNavigate) {
    navigateToPage(menu.url);
  }
}

/** 页面导航 */
function navigateToPage(url: string) {
  // 解析 URL，提取路径和参数
  const { path, query } = parseUrl(url);

  // 判断是否是 tabBar 页面
  if (isTabBarPage(path)) {
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
      url: url,
      fail: () => {
        toast.show("页面不存在");
      }
    });
  }
}

/** 处理 Swiper 点击 */
function handleSwiperClick(data: any) {
  emit('swiperClick', data);
}

/** 处理 Swiper 切换 */
function handleSwiperChange(index: number) {
  emit('swiperChange', index);
}

/** 跳转到常用服务设置页面 */
function handleGotoFavoriteSettings() {
  emit('moreClick');
  emit('settingsClick');
  
  if (props.autoNavigate && props.moreRoute) {
    uni.navigateTo({
      url: props.moreRoute
    });
  }
}

/** 暴露方法 */
defineExpose({
  // 获取菜单分组
  getMenuGroups: () => menuGroups.value,
  // 获取常用菜单
  getFavoriteMenuItems: () => favoriteMenuItems.value,
  // 手动导航
  navigateToPage,
  // 刷新数据
  refreshData: () => initData()
});

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
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 61rpx;
  height: 61rpx;
  margin-bottom: 8rpx;
}

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
  
  .wd-grid-item__text {
    font-size: 23rpx;
    color: #4E5969;
  }
}
</style>
