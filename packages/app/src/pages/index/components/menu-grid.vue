<template>
  <view :class="containerClass">
    <wd-grid 
      :column="column" 
      :clickable="clickable" 
      :border="border"
      v-bind="gridProps"
      @itemclick="handleGridClick"
    >
      <wd-grid-item
        v-for="(menu, index) in menuList"
        :key="menu.key || index"
        :text="menu.name"
        v-bind="getItemProps(menu, index)"
        @itemclick="handleClick(menu, index)"
      >
        <!-- 透传所有插槽 -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" :menu="menu" :index="index" v-bind="slotData" />
        </template>
        
        <!-- 默认图标插槽 -->
        <template #icon v-if="!$slots.icon">
          <view
            class="menu-icon"
            :style="getIconStyle(menu)"
          >
            <wd-icon
              v-if="menu.icon && !menu.imageUrl"
              :name="menu.icon"
              :size="iconSize"
              :color="menu.iconColor"
            />
            <image
              v-else-if="menu.imageUrl"
              class="w-100% h-100%"
              :src="menu.imageUrl"
              :mode="imageMode"
            />
            <image
              v-else-if="!disableDefaultIcon"
              class="w-100% h-100%"
              :src="`/static/images/menus/${menu.key}.png`"
              :mode="imageMode"
            />
          </view>
        </template>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script lang="ts" setup>
import type { MenuItem } from "../menu-config";
import { useToast } from "wot-design-uni";
import { isTabBarPage } from "../../../components/jh-tabbar/config";
import { parseUrl, setTabParams } from "../../../utils/url";

defineOptions({
  name: "MenuGrid"
});

interface Props {
  // 菜单数据
  menus?: MenuItem[];
  // wd-grid 属性
  column?: number;
  clickable?: boolean;
  border?: boolean;
  // 图标配置
  iconSize?: string | number;
  imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'none';
  iconBgColor?: string;
  disableDefaultIcon?: boolean;
  // 容器样式
  containerClass?: string;
  // 功能配置
  autoNavigate?: boolean;
  showEmpty?: boolean;
  emptyText?: string;
  // 透传所有 wd-grid 属性
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  menus: () => [],
  column: 5,
  clickable: true,
  border: false,
  iconSize: '50rpx',
  imageMode: 'aspectFill',
  iconBgColor: '#f5f5f5',
  disableDefaultIcon: false,
  containerClass: '',
  autoNavigate: true,
  showEmpty: true,
  emptyText: '暂无菜单'
});

// 事件
const emit = defineEmits<{
  // 菜单点击事件
  click: [menu: MenuItem, index: number];
  // wd-grid 原生事件
  gridClick: [data: any];
  // 自定义事件
  menuClick: [menu: MenuItem, index: number];
  emptyClick: [];
}>();

const toast = useToast();

// 计算属性
const menuList = computed(() => props.menus);

// wd-grid 属性
const gridProps = computed(() => {
  const { 
    menus, column, clickable, border, iconSize, imageMode, 
    iconBgColor, disableDefaultIcon, containerClass, autoNavigate,
    showEmpty, emptyText, ...gridProps 
  } = props;
  return gridProps;
});

/** 获取菜单项属性 */
function getItemProps(menu: MenuItem, index: number) {
  return {
    // 可以根据需要返回 wd-grid-item 的额外属性
  };
}

/** 获取图标样式 */
function getIconStyle(menu: MenuItem) {
  const bgColor = menu.iconColor ? `${menu.iconColor}20` : props.iconBgColor;
  return {
    backgroundColor: bgColor,
    color: menu.iconColor || "#666"
  };
}

/** 处理网格点击 */
function handleGridClick(data: any) {
  emit('gridClick', data);
}

/** 处理菜单点击 */
function handleClick(menu: MenuItem, index: number) {
  // 发出事件
  emit('click', menu, index);
  emit('menuClick', menu, index);
  
  console.log("点击菜单：", menu);
  
  // 如果没有 URL，显示提示
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

/** 暴露方法 */
defineExpose({
  // 获取菜单列表
  getMenuList: () => props.menus,
  // 手动导航
  navigateToPage,
  // 获取菜单数量
  getMenuCount: () => props.menus.length
});
</script>

<style lang="scss" scoped>
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
}

:deep(.wd-grid-item__text) {
  font-size: 24rpx;
  color: #333;
  overflow: visible;
  white-space: nowrap;
}
</style>
