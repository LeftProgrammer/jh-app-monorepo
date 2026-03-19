<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="质量整改"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />
    <!--    <wd-sticky> -->
    <!--      <wd-datetime-picker -->
    <!--        v-model="queryParams.date" -->
    <!--        placeholder-left -->
    <!--        :default-value="[new Date().getTime(), new Date().getTime()]" -->
    <!--        type="date" -->
    <!--        :clearable="true" -->
    <!--        class="w-[calc(100vw-0rpx)]" -->
    <!--        @confirm="handleSearch" -->
    <!--      /> -->
    <!--    </wd-sticky> -->

    <wd-swipe-action
      v-for="(item, index) in list"
      :key="item.id"
      :disabled="item.status !== -1"
    >
      <view
        class="mx-16rpx mb-16rpx rounded-8rpx bg-#fff px-19rpx py-27rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex items-center justify-between gap-31rpx">
          <view class="flex-1 text-ellipsis text-31rpx text-#1D2129">
            {{ item.rectificationPartName }}
          </view>
          <!-- 流程状态 -->
          <jh-dict-tag
            :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS"
            :value="item.status || -99"
          />
        </view>
        <wd-divider class="!my-16rpx !p-0" />

        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">整改单号</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.code || "N/A" }}
          </text>
        </view>
        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">整改期限</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ formatDate(item.rectificationDeadline, "YYYY-MM-DD") || "N/A" }}
          </text>
        </view>

        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">整改内容</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.rectificationContent || "N/A" }}
          </text>
        </view>
      </view>
      <template #right>
        <view class="h-100% flex">
          <view
            class="flex items-center justify-center bg-blue px-11px text-#fff"
            @click="routerTo('update', item)"
          >
            编辑
          </view>
          <view
            class="flex items-center justify-center bg-red px-11px text-#fff"
            @click="handleDelete(item, index)"
          >
            删除
          </view>
        </view>
      </template>
    </wd-swipe-action>

    <wd-status-tip v-if="!list.length && loadMoreState !== 'loading'" tip="暂无数据">
      <template #image>
        <image src="/static/images/noData.png" class="h-140rpx w-280rpx" />
      </template>
    </wd-status-tip>
    <!-- 加载更多 -->
    <wd-loadmore
      v-if="list.length > 0 && total > list.length"
      :state="loadMoreState"
      @reload="loadMore"
    />
    <wd-loadmore v-if="list.length > 0 && total === list.length" state="finished" />

    <!-- 新增 -->
    <wd-fab :draggable="true" :expandable="false" @click="routerTo('create')" />
  </view>
</template>

<script lang="ts" setup>
import type { LoadMoreState } from '@/http'
import { computed, ref } from 'vue'
import { useMessage } from 'wot-design-uni'
import IssueApi from '@/api/pms/quality/inspection/issue'
import { useUserStore } from '@/store'
import { deepClone, formatDate, navigateBackPlus } from '@/utils'
import { DICT_TYPE } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const message = useMessage()
const userStore = useUserStore()
const userInfo: any = computed(() => userStore.userInfo || {})
const list = ref<any[]>([])
const total = ref(0)
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  baseId: userInfo.value.baseId, // 假设 baseId 对应 PC 端的 unitId 或其他项目ID
  dangerLevel: '', // 隐患级别
  rectificationStatus: '', // 整改状态
  dateRange: [], // 检查日期范围 [start, end]
  startRectificationTime: '', // 实际传给后端的开始时间
  endRectificationTime: '', // 实际传给后端的结束时间
})
const loadMoreState = ref<LoadMoreState>('loading')

/** 触发搜索 */
function handleSearch() {
  list.value = []
  queryParams.value.pageNo = 1
  getList()
}

/** 查询列表 */
async function getList() {
  loadMoreState.value = 'loading'
  try {
    const params: any = deepClone(queryParams.value)

    // 处理日期范围筛选
    if (params.date && params.date.length === 2 && params.date[0] && params.date[1]) {
      params.startRectificationTime = formatDate(params.date[0], 'YYYY-MM-DD 00:00:00')
      params.endRectificationTime = formatDate(params.date[1], 'YYYY-MM-DD 23:59:59')
    } else {
      params.startRectificationTime = ''
      params.endRectificationTime = ''
    }
    delete params.date // 移除前端使用的 dateRange 字段

    const data = await IssueApi.getPage(params)
    console.log('data', data)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch (e) {
    console.error('获取质量整改列表失败', e)
    queryParams.value.pageNo
      = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
  }
}

/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === 'finished' || loadMoreState.value === 'error') {
    return
  }
  queryParams.value.pageNo++
  getList()
}

/** 删除操作 */
function handleDelete(item: any, index: number) {
  message
    .confirm({
      title: '提示',
      msg: '确定删除该质量整改记录？',
    })
    .then(async ({ action }) => {
      if (action === 'confirm') {
        try {
          await IssueApi.delete(item.id)
          list.value.splice(index, 1)
          total.value-- // 更新总数
          // 如果删除后列表变空或不满一页，尝试重新加载以确保页面数据完整性
          if (list.value.length === 0 && total.value > 0) {
            handleSearch()
          } else if (
            list.value.length < queryParams.value.pageSize
            && total.value > list.value.length
          ) {
            loadMore()
          }
        } catch (error) {
          console.error('删除失败', error)
        }
      }
    })
}

/** 路由跳转 */
function routerTo(type: string, item?: any) {
  let url = `/pages/pms/quality/inspection/issue/issueForm?type=${type}`
  if (item?.id) {
    url += `&id=${item.id}`
  }
  // 如果是编辑，且 PC 端禁用了已发起流程的编辑，移动端也应遵循
  if (type === 'update' && item && item.status !== -1) {
    return
  }
  uni.navigateTo({ url })
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore()
})

/** 初始化/刷新列表 */
function reset() {
  list.value = []
  queryParams.value.pageNo = 1
  queryParams.value.dangerLevel = ''
  queryParams.value.rectificationStatus = ''
  queryParams.value.dateRange = [] // 重置日期范围
  queryParams.value.startRectificationTime = ''
  queryParams.value.endRectificationTime = ''
  getList()
}

/** 页面生命周期挂载 */
onShow(() => {
  reset()
})
</script>

<style lang="scss" scoped>
// 定制 wd-datetime-picker 使其宽度自适应
.wd-datetime-picker--full-width {
  :deep(.wd-picker__field) {
    width: 100%;
    justify-content: space-between;
    padding: 0 32rpx;
  }
}
</style>
