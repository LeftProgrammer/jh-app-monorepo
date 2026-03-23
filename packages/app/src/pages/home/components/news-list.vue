<template>
  <view class="mt-20rpx overflow-hidden rounded-8rpx bg-white p-23rpx">
    <view class="flex justify-between items-center">
      <text class="text-[#1D2129] text-31rpx font-600">{{ title }}</text>
      <text v-if="showMore" class="text-[#ACACAC] text-27rpx font-500" @click="handleMore">
        {{ moreText }}
        <wd-icon name="arrow-right" size="27rpx" color="#ACACAC" />
      </text>
    </view>
    <view
      v-for="item in actualList"
      :key="item.id"
      class="news-item flex justify-between py-20rpx gap-100rpx items-center"
      @click="handleItemClick(item)"
    >
      <view class="flex flex-col flex-1 justify-between">
        <view class="two-line-ellipsis text-#1D2129 text-27rpx font-400 mb-23rpx">
          {{ item[titleField] }}
        </view>
        <view class="text-#ACACAC text-23rpx">{{ item[dateField] }}</view>
      </view>
      <wd-img
        v-if="showImage && getImageUrl(item)"
        :width="imageWidth"
        :radius="imageRadius"
        :height="imageHeight"
        :src="getImageUrl(item)"
        :preview-src="getImageUrl(item)"
        :enable-preview="enablePreview"
      />
    </view>
    <!-- 空状态 -->
    <view v-if="actualList.length === 0 && !actualLoading" class="py-40rpx text-center text-#999 text-24rpx">
      {{ emptyText }}
    </view>
  </view>
  <view v-if="showBottomSpace" class="h-40rpx" />
</template>

<script lang="ts" setup>
import { getFileByIds } from '../../../api/infra/file'
import { getNewsPage } from '../../../api/system/news'
import { defaultNavigateTo } from '../utils'

defineOptions({
  name: 'HomeNewsList',
})

const props = withDefaults(defineProps<{
  /** 标题 */
  title?: string
  /** 新闻列表数据（外部传入，优先使用） */
  list?: any[]
  /** 是否加载中（外部传入） */
  loading?: boolean
  /** 获取新闻列表的函数（覆盖默认 API） */
  fetchList?: () => Promise<any[]>
  /** 每页数量 */
  pageSize?: number
  /** 标题字段名 */
  titleField?: string
  /** 日期字段名 */
  dateField?: string
  /** 图片字段名 */
  imageField?: string
  /** 是否显示图片 */
  showImage?: boolean
  /** 图片宽度 */
  imageWidth?: number
  /** 图片高度 */
  imageHeight?: number
  /** 图片圆角 */
  imageRadius?: number
  /** 是否启用图片预览 */
  enablePreview?: boolean
  /** 是否显示更多按钮 */
  showMore?: boolean
  /** 更多按钮文字 */
  moreText?: string
  /** 空状态文字 */
  emptyText?: string
  /** 是否显示底部间距 */
  showBottomSpace?: boolean
  /** 更多页面路径 */
  moreUrl?: string
  /** 详情页面路径（支持 :id 占位符） */
  detailUrl?: string
  /** 路由跳转函数（可选，默认使用 uni.navigateTo） */
  navigateTo?: (url: string) => void
}>(), {
  title: '新闻资讯',
  pageSize: 3,
  titleField: 'name',
  dateField: 'publishDate',
  imageField: 'picture',
  showImage: true,
  imageWidth: 100,
  imageHeight: 70,
  imageRadius: 4,
  enablePreview: true,
  showMore: true,
  moreText: '更多',
  emptyText: '暂无数据',
  showBottomSpace: true,
  moreUrl: '/pages/general/news/index',
  detailUrl: '/pages/general/news/detail?id=:id',
})

const emit = defineEmits<{
  'more': []
  'item-click': [item: any]
}>()

/** 内部数据状态 */
const internalList = ref<any[]>([])
const internalLoading = ref(false)

/** 实际使用的列表数据 */
const actualList = computed(() => props.list ?? internalList.value)
const actualLoading = computed(() => props.loading ?? internalLoading.value)

/** 路由跳转 */
function navigate(url: string) {
  if (props.navigateTo) {
    props.navigateTo(url)
  } else {
    defaultNavigateTo(url)
  }
}

/** 默认获取新闻列表 */
async function defaultFetchList(): Promise<any[]> {
  const data = await getNewsPage({ pageNo: 1, pageSize: props.pageSize, status: 1 })
  for (const item of data.list as any[]) {
    if (item.picture) {
      item.picture = await getFileByIds(item.picture as string)
    } else {
      item.picture = []
    }
  }
  return data.list || []
}

/** 加载数据 */
async function loadData() {
  if (props.list !== undefined) return

  internalLoading.value = true
  try {
    const fetchFn = props.fetchList || defaultFetchList
    internalList.value = await fetchFn()
  } finally {
    internalLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

defineExpose({
  refresh: loadData,
})

/** 获取图片URL */
function getImageUrl(item: any): string {
  const imageData = item[props.imageField]
  if (!imageData) return ''
  if (typeof imageData === 'string') return imageData
  if (Array.isArray(imageData) && imageData.length > 0) {
    return imageData[0]?.url || imageData[0] || ''
  }
  return ''
}

/** 点击更多 */
function handleMore() {
  emit('more')
  // 如果没有监听 more 事件，使用默认行为
  if (props.moreUrl) {
    navigate(props.moreUrl)
  }
}

/** 点击新闻项 */
function handleItemClick(item: any) {
  emit('item-click', item)
  // 如果没有监听 item-click 事件，使用默认行为
  if (props.detailUrl) {
    const url = props.detailUrl.replace(':id', item.id)
    navigate(url)
  }
}
</script>

<style lang="scss" scoped>
.news-item {
  border-bottom: 1px solid #ededed;
}
.two-line-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
