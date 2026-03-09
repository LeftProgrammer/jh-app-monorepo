<template>
  <view :class="containerClass">
    <!-- 标题栏 -->
    <view class="header flex justify-between items-center">
      <text :class="titleClass">{{ title }}</text>
      <view :class="moreClass" @click="handleMoreClick">
        {{ moreText }}
        <wd-icon :name="moreIcon" :size="moreIconSize" :color="moreIconColor" />
      </view>
    </view>
    
    <!-- 新闻列表 -->
    <view class="news-list">
      <view
        v-for="(item, index) in newsList"
        :key="item.id || index"
        :class="getItemClass(index)"
        @click="handleItemClick(item, index)"
      >
        <!-- 内容区域 -->
        <view class="content flex flex-col flex-1 justify-between">
          <view :class="titleTextClass">
            {{ item.name }}
          </view>
          <view :class="dateTextClass">{{ item.publishDate }}</view>
        </view>
        
        <!-- 图片区域 -->
        <wd-img
          v-if="showImage && item.picture && item.picture[0]"
          :width="imageWidth"
          :height="imageHeight"
          :radius="imageRadius"
          :src="item.picture[0]?.url"
          :preview-src="item.picture[0]?.url"
          :enable-preview="enablePreview"
          :mode="imageMode"
          v-bind="imageProps"
        />
      </view>
      
      <!-- 空状态 -->
      <view v-if="showEmpty && newsList.length === 0" :class="emptyClass">
        <text>{{ emptyText }}</text>
      </view>
    </view>
  </view>
  <view v-if="showBottomSpace" class="h-40rpx" />
</template>

<script lang="ts" setup>
import { getPage } from "@/api/general/news";
import { getFileByIds } from "@/api/infra/file";

defineOptions({
  name: "HomeNews"
});

interface NewsItem {
  id?: string | number;
  name: string;
  publishDate: string;
  picture?: any[];
  [key: string]: any;
}

interface Props {
  // 基础配置
  title?: string;
  moreText?: string;
  moreIcon?: string;
  moreRoute?: string;
  showBottomSpace?: boolean;
  
  // 样式配置
  containerClass?: string;
  titleClass?: string;
  moreClass?: string;
  titleTextClass?: string;
  dateTextClass?: string;
  itemClass?: string;
  emptyClass?: string;
  
  // 图片配置
  showImage?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageRadius?: number;
  imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'none';
  enablePreview?: boolean;
  
  // 数据配置
  pageSize?: number;
  status?: number;
  showEmpty?: boolean;
  emptyText?: string;
  
  // 功能配置
  autoFetch?: boolean;
  enableItemClick?: boolean;
  
  // 透传属性
  imageProps?: Record<string, any>;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  title: '新闻资讯',
  moreText: '更多',
  moreIcon: 'arrow-right',
  moreRoute: '/pages/general/news/index',
  showBottomSpace: true,
  
  containerClass: 'mt-20rpx overflow-hidden rounded-8rpx bg-white p-23rpx',
  titleClass: 'text-[#1D2129] text-31rpx font-600',
  moreClass: 'text-[#ACACAC] text-27rpx font-500',
  titleTextClass: 'two-line-ellipsis text-#1D2129 text-27rpx font-400 mb-23rpx',
  dateTextClass: 'text-#ACACAC text-23rpx',
  itemClass: 'newItem flex justify-between py-20rpx gap-100rpx items-center',
  emptyClass: 'text-center py-40rpx text-gray-500',
  
  showImage: true,
  imageWidth: 100,
  imageHeight: 70,
  imageRadius: 4,
  imageMode: 'aspectFill',
  enablePreview: true,
  
  pageSize: 3,
  status: 1,
  showEmpty: true,
  emptyText: '暂无新闻',
  
  autoFetch: true,
  enableItemClick: true,
  
  imageProps: () => ({})
});

// 事件
const emit = defineEmits<{
  // 点击事件
  moreClick: [];
  itemClick: [item: NewsItem, index: number];
  // 数据事件
  dataLoaded: [data: NewsItem[]];
  dataError: [error: any];
  // 自定义事件
  refresh: [];
}>();

// 响应式数据
const newsList = ref<NewsItem[]>([]);
const loading = ref(false);
const error = ref<any>(null);

// 计算属性
const moreIconSize = computed(() => '27rpx');
const moreIconColor = computed(() => '#ACACAC');

/** 获取项目样式 */
function getItemClass(index: number) {
  const baseClass = props.itemClass;
  const isLast = index === newsList.value.length - 1;
  return isLast ? baseClass.replace('border-bottom: 1px solid #ededed', '') : baseClass;
}

/** 获取新闻数据 */
async function fetchNews() {
  if (!props.autoFetch) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const data = await getPage({
      pageNo: 1,
      pageSize: props.pageSize,
      status: props.status
    });
    
    // 处理图片数据（保持原有逻辑）
    const processedList = [];
    for (let i = 0; i < data.list.length; i++) {
      const item: any = data.list[i];
      if (item.picture) {
        const file = await getFileByIds(item.picture);
        item.picture = file;
      } else {
        item.picture = [];
      }
      processedList.push(item);
    }
    
    newsList.value = processedList || [];
    emit('dataLoaded', newsList.value);
    
  } catch (err) {
    error.value = err;
    emit('dataError', err);
    console.error('获取新闻失败:', err);
  } finally {
    loading.value = false;
  }
}

/** 处理更多点击 */
function handleMoreClick() {
  emit('moreClick');
  if (props.moreRoute) {
    uni.navigateTo({ url: props.moreRoute });
  }
}

/** 处理项目点击 */
function handleItemClick(item: NewsItem, index: number) {
  if (!props.enableItemClick) return;
  
  emit('itemClick', item, index);
  // 可以在这里添加默认的新闻详情跳转逻辑
}

/** 刷新数据 */
async function refresh() {
  await fetchNews();
  emit('refresh');
}

/** 暴露方法 */
defineExpose({
  fetchNews,
  refresh,
  getNewsList: () => newsList.value,
  getLoading: () => loading.value,
  getError: () => error.value
});

/** 生命周期 */
onMounted(() => {
  fetchNews();
});
</script>

<style lang="scss" scoped>
.newItem {
  border-bottom: 1px solid #ededed;
}

.two-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
