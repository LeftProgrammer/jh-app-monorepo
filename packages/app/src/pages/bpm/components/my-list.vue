<template>
  <view>
    <!-- 搜索组件 -->
    <wd-search
      v-model="searchName"
      placeholder="搜索我的发起"
      hide-cancel
      class="!bg-transparent"
      @change="handleSearch"
    />

    <view class="bpm-list">
      <!-- 我的列表 -->
      <view
        v-for="item in list"
        :key="item.id"
        class="bpm-card flex items-center justify-between px-19rpx py-23rpx"
        @click="handleDetail(item)"
      >
        <view
          :class="item.status === 1 ? 'w-[calc(100%-50rpx)]' : 'w-[calc(100%-140rpx)]'"
        >
          <view class="mb-19rpx text-ellipsis text-31rpx text-#1D2129">
            {{ item.name }}
          </view>
          <view
            class="flex items-center justify-between gap-10rpx text-27rpx text-#86909C"
            @click.stop=""
          >
            <view>
              <text class="text-#009688">{{ item.processDefinition?.name }}</text>
              <wd-divider vertical />
              <text>{{ item.tasks ? item.tasks[0].name : "" }}</text>
              <wd-divider v-if="item.tasks" vertical />
              <text>{{ formatPast(item.startTime) }}</text>
            </view>
            <wd-button
              v-if="item.status === 1"
              size="small"
              :round="false"
              class="!h-46rpx !rounded-8rpx !px-25rpx"
              @click="handleUrging(item)"
            >
              催办
            </wd-button>
          </view>
        </view>
        <view class="flex items-center justify-center">
          <image
            v-if="item.status !== 1"
            :src="`/static/images/task/status-${item.status}.png`"
            class="h-95rpx w-110rpx"
          />
          <wd-icon name="arrow-right" size="31rpx" color="#009688" />
        </view>
      </view>
      <wd-message-box />
      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="bpm-empty">
        <wd-status-tip image="content" tip="暂无发起的流程" />
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { ProcessInstance } from '../../../api/bpm/processInstance'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { useMessage, useToast } from 'wot-design-uni'
import { getProcessInstanceMyPage, urgeCreate } from '../../../api/bpm/processInstance'
import { formatPast } from '../../../utils'
import '../styles/index.scss'

defineOptions({
  name: 'BpmMyList',
})

const props = withDefaults(defineProps<{
  /** 详情页路径模板，{id} 会被替换为实际 ID */
  detailUrl?: string
}>(), {
  detailUrl: '/pages-bpm/processInstance/detail/index?id={id}&type=my',
})

export type LoadMoreState = 'loading' | 'finished' | 'error'

const message = useMessage()
const toast = useToast()

const total = ref(0)
const list = ref<ProcessInstance[]>([])
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
    const data = await getProcessInstanceMyPage({
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

/** 催办 */
function handleUrging(row: any) {
  message
    .confirm({
      msg: '是否提醒当前节点审批人流程办理',
      title: '催办',
    })
    .then(async ({ action }) => {
      if (action === 'confirm') {
        const userTaskVOS = row.tasks.map((task: any) => ({
          taskId: task.id,
          userId: task.assigneeUser.id,
        }))
        const data = {
          startUserId: row.startUser.id,
          processInstanceId: row.id,
          processInstanceName: row.processDefinition.name,
          title: row.formVariables.title,
          processDefinitionId: row.processDefinitionId,
          activityName: row.tasks[0].name,
          userTaskVOS,
        }
        const res = await urgeCreate(data)
        toast.show(res)
      }
    })
}

/** 查看详情 */
function handleDetail(item: ProcessInstance) {
  const url = props.detailUrl.replace('{id}', item.id)
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
