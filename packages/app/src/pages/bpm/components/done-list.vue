<template>
  <view>
    <!-- 搜索组件 -->
    <wd-search
      v-model="searchName"
      placeholder="搜索已办任务"
      hide-cancel
      class="!bg-transparent"
      @change="handleSearch"
    />
    <view class="bpm-list">
      <!-- 已完成列表 -->
      <view
        v-for="item in list"
        :key="item.id"
        class="bpm-card flex items-center justify-between px-19rpx py-23rpx"
        @click="handleDetail(item)"
      >
        <view class="w-[calc(100%-140rpx)]">
          <view class="mb-19rpx text-ellipsis text-31rpx text-#1D2129">
            {{ item.processInstance?.name }}
          </view>
          <view class="text-27rpx text-#86909C">
            <text class="text-#009688">{{ item.processDefinition?.name }}</text>
            <wd-divider vertical />
            <text>{{ formatDate(item.createTime, "MM-DD HH:mm") }}</text>
            <wd-divider vertical />
            <text>{{ item.processInstance?.startUser?.nickname }}</text>
          </view>
        </view>
        <view class="flex items-center justify-center">
          <image
            :src="`${statusIconPrefix}status-${item.status}.png`"
            class="h-95rpx w-110rpx"
          />
          <wd-icon name="arrow-right" size="31rpx" color="#009688" />
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="bpm-empty">
        <wd-status-tip image="content" tip="暂无已办任务" />
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { Task } from '../../../api/bpm/task'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getTaskDonePage } from '../../../api/bpm/task'
import { formatDate } from '../../../utils'
import '../styles/index.scss'

defineOptions({
  name: 'BpmDoneList',
})

const props = withDefaults(defineProps<{
  /** 详情页路径模板，{id} 会被替换为实际 ID */
  detailUrl?: string
  /** 任务状态图标路径前缀，实际路径为 `${prefix}status-${status}.png` */
  statusIconPrefix?: string
}>(), {
  detailUrl: '/pages-bpm/detail/index?id={id}&type=done',
  statusIconPrefix: '/static/framework/task/',
})

export type LoadMoreState = 'loading' | 'finished' | 'error'

const total = ref(0)
const list = ref<Task[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const searchName = ref('')
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})

/** 查询列表 */
async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getTaskDonePage({
      ...queryParams.value,
      name: searchName.value || undefined,
    })
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    queryParams.value.pageNo =
      queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
  }
}

/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === 'finished') {
    return
  }
  queryParams.value.pageNo++
  getList()
}

/** 搜索 */
function handleSearch() {
  queryParams.value.pageNo = 1
  list.value = []
  getList()
}

/** 重置并刷新 */
function refresh() {
  searchName.value = ''
  list.value = []
  queryParams.value.pageNo = 1
  getList()
}

/** 查看详情 */
function handleDetail(item: Task) {
  const url = props.detailUrl.replace('{id}', item.processInstance.id)
  uni.navigateTo({ url })
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore()
})

/** 初始化加载数据 */
onMounted(() => {
  getList()
})

/** 暴露方法供外部调用 */
defineExpose({
  refresh,
  getList,
})
</script>
