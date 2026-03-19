<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="质量检查"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="navigateBackPlus()"
    />

    <!-- 列表内容 -->
    <wd-swipe-action v-for="(item, index) in list" :key="item.id" :disabled="false">
      <view
        class="mx-16rpx mb-16rpx rounded-8rpx bg-#fff px-19rpx py-27rpx"
        @click="routerTo('detail', item)"
      >
        <view class="flex items-center justify-between gap-31rpx">
          <view class="flex-1 text-ellipsis text-31rpx text-#1D2129">
            {{ item.code }}
          </view>
          <!-- 检查结果标签 -->
          <jh-dict-tag :type="DICT_TYPE.QUALITY_INSPECTION_RECORDS_INSPECTIONRESULT" :value="item.inspectionResult" />
        </view>
        <wd-divider class="!my-16rpx !p-0" />
        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">检查类型</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ getDictLabel(DICT_TYPE.QUALITY_INSPECTION_RECORDS_INSPECTIONTYPE, item.inspectionType) || "N/A" }}
          </text>
        </view>
        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">类型</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ getDictLabel(DICT_TYPE.QUALITY_INSPECTION_RECORDS_STRUCTURE, item.structure) || "N/A" }}
          </text>
        </view>
        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">检查单位</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.unitName || "N/A" }}
          </text>
        </view>
        <view class="mb-19rpx flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">检查日期</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ formatDate(item.inspectionDate, "YYYY-MM-DD") || "N/A" }}
          </text>
        </view>
        <view class="flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">整改状态</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.rectificationState || "N/A" }}
          </text>
        </view>
        <view class="flex items-center justify-between gap-31rpx text-27rpx">
          <text class="text-#4E5969">状态</text>
          <text class="flex-1 text-ellipsis text-right text-#1D2129">
            {{ item.state === "-1" ? "未提交" : "已提交" || "N/A" }}
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

    <!-- 新增按钮 -->
    <wd-fab :draggable="true" :expandable="false" @click="routerTo('create')" />
  </view>
</template>

<script lang="ts" setup>
import type { LoadMoreState } from '@/http'
import { computed, onMounted, ref } from 'vue'
import { useMessage, useToast } from 'wot-design-uni'
import InspectionApi from '@/api/pms/quality/inspection/records' // 你的 API
import { getDictLabel, getStrDictOptions } from '@/hooks' // 你的字典 hook
import { useUserStore } from '@/store' // 你的用户 store
import { deepClone, navigateBackPlus } from '@/utils' // 确保提供 deepClone
import { DICT_TYPE } from '@/utils' // 你的字典常量
import { formatDate } from '@/utils'
// 你的日期格式化工具
definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})
// 基础变量
const toast = useToast()
const message = useMessage()
const userStore = useUserStore()
const userInfo: any = computed(() => userStore.userInfo || {})

const list = ref<any[]>([])
const total = ref(0)
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  inspectionOrg: '', // 检查工区 (PC的treeSelectedValue)
  inspectionType: '', // 检查类型
  inspectionResult: '', // 检查结果
  dateRange: [], // 前端使用的日期范围
  inspectionDateStart: '', // 传递给后端的开始日期
  inspectionDateEnd: '', // 传递给后端的结束日期
})
const loadMoreState = ref<LoadMoreState>('loading')
const treeSelectedOrgName = ref('检查工区') // 用于显示当前选中的检查工区名称

/** PC treeProps 转换为适合 wd-picker 的单列数据 */
function getOrgPickerColumns() {
  const root = treeProps.value.treeData[0] // 假设根节点是 "质量检查结构"
  return root.children.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))
}

/** 处理工区筛选 */
function handleOrgFilter(value: string, label: string) {
  queryParams.value.inspectionOrg = value
  treeSelectedOrgName.value = label
}

/** 字典筛选处理 */
function handleDictFilter(field: 'inspectionType' | 'inspectionResult', value: string) {
  queryParams.value[field] = value
}

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
    if (
      params.dateRange
      && params.dateRange.length === 2
      && params.dateRange[0]
      && params.dateRange[1]
    ) {
      params.inspectionDateStart = formatDate(params.dateRange[0], 'YYYY-MM-DD 00:00:00')
      params.inspectionDateEnd = formatDate(params.dateRange[1], 'YYYY-MM-DD 23:59:59')
    } else {
      params.inspectionDateStart = ''
      params.inspectionDateEnd = ''
    }
    delete params.dateRange // 移除前端使用的 dateRange 字段

    const data = await InspectionApi.getPage(params)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch (e) {
    console.error('获取质量检查列表失败', e)
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
  if (item && item.state !== '-1') {
    toast.error('已提交无法删除！')
    return
  }
  message
    .confirm({
      title: '提示',
      msg: `确定删除检查编号为 ${item.code} 的记录？`,
    })
    .then(async ({ action }) => {
      if (action === 'confirm') {
        try {
          await InspectionApi.delete(item.id)
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

/** 路由跳转 (新增/编辑/详情) */
function routerTo(type: string, item?: any) {
  if (type === 'update' && item && item.state !== '-1') {
    toast.error('已提交无法编辑！')
    return
  }
  let url = `/pages/pms/quality/inspection/records/dataForm?type=${type}`
  if (item?.id) {
    url += `&id=${item.id}`
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

  // 重置筛选条件
  queryParams.value.inspectionOrg = ''
  queryParams.value.inspectionType = ''
  queryParams.value.inspectionResult = ''
  queryParams.value.dateRange = []
  queryParams.value.inspectionDateStart = ''
  queryParams.value.inspectionDateEnd = ''
  treeSelectedOrgName.value = '检查工区' // 重置显示文本

  getList()
}

/** 页面生命周期挂载 */
onShow(() => {
  reset()
})

// PC端 treeProps 数据，在移动端需要转换为 picker 列
const treeProps = computed(() => ({
  treeData: [
    {
      id: '',
      name: '质量检查结构',
      children: getStrDictOptions(DICT_TYPE.SAFE_QUALITY_ORG).map(item => ({
        id: item.value,
        name: `${item.label}`,
      })),
    },
  ],
  isSelectFirst: true, // 这在移动端可能不需要完全模拟，但数据结构保留
}))

onMounted(async () => {
  // 如果需要默认选中第一个工区，可以在这里设置
  if (
    treeProps.value.isSelectFirst
    && getOrgPickerColumns().length > 0
    && !queryParams.value.inspectionOrg
  ) {
    const firstOrg = getOrgPickerColumns()[0]
    queryParams.value.inspectionOrg = firstOrg.value
    treeSelectedOrgName.value = firstOrg.label
  }
  // 初始加载列表已在 onShow 中
})
</script>

<style lang="scss" scoped></style>
