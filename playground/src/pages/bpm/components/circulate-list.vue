<template>
  <view>
    <view class="bpm-list">
      <!-- 传阅列表 -->
      <view
        v-for="item in list"
        :key="item.id"
        class="bpm-card flex items-center justify-between px-19rpx py-23rpx"
        @click="handleDetail(item)"
      >
        <view class="w-[calc(100%-140rpx)]">
          <view class="mb-19rpx text-ellipsis text-31rpx text-#1D2129">
            {{ item.name }}
          </view>
          <view class="text-27rpx text-#86909C">
            <text>{{ formatDate(item.sendTime, "MM-DD HH:mm") }}</text>
            <wd-divider vertical />
            <text>{{ getUserNickname(item.sendUser) }}</text>
          </view>
        </view>
        <wd-icon name="arrow-right" size="31rpx" color="#009688" />
      </view>

      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="bpm-empty">
        <wd-status-tip image="content" tip="暂无传阅记录" />
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { CirculateRecord } from '@/api/bpm/circulate'
import { onReachBottom } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { getCirculatePage } from '@/api/bpm/circulate'
import { useUserStore } from '@/store'
import { formatDate } from '@/utils'

type LoadMoreState = 'loading' | 'finished' | 'error'

const total = ref(0)
const list = ref<CirculateRecord[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})

const userStore = useUserStore()
const userList = computed(() => userStore.userList)

/** 根据用户 ID 获取昵称 */
function getUserNickname(userId: string | undefined): string {
  if (!userId) {
    return ''
  }
  const user = userList.value.find((u: any) => u.id === userId)
  return user?.nickname || ''
}

/** 查询列表 */
async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getCirculatePage(queryParams.value)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    queryParams.value.pageNo
      = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
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

/** 重置并刷新 */
function refresh() {
  list.value = []
  queryParams.value.pageNo = 1
  getList()
}

/** 查看详情 */
function handleDetail(item: CirculateRecord) {
  uni.navigateTo({ url: `/pages/bpm/circulateForm?id=${item.id}` })
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore()
})

/** 初始化 */
onShow(() => {
  refresh()
})

/** 暴露方法供外部调用 */
defineExpose({
  refresh,
  getList,
})
</script>

<style lang="scss" scoped>
@use '@jinghe-sanjiaoroad-app/framework/pages/bpm/styles/index.scss';
</style>
