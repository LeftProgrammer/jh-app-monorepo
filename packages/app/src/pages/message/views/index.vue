<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="消息中心"
      placeholder
      safe-area-inset-top
      fixed
      right-text="全部已读"
      @click-right="handleReadAll"
    >
      <template #right>
        <wd-icon name="clear" size="16px" color="#fff" class="mr-8rpx" />
        <text class="text-24rpx text-#fff">全部已读</text>
      </template>
    </wd-navbar>

    <view class="top_bg">
      <!-- 搜索组件 -->
      <wd-search
        v-model="templateContent"
        placeholder="搜索"
        hide-cancel
        placeholder-left
        @blur="handleQuery()"
      />
      <wd-tabs v-model="templateType" @change="handleTypeChange">
        <wd-tab title="业务消息" name="otherMsg" :badge-props="badgeProps1" />
        <wd-tab title="系统消息" name="systemMsg" :badge-props="badgeProps2" />
      </wd-tabs>
    </view>
    <!-- 消息列表 -->
    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-24rpx overflow-hidden rounded-8rpx bg-white shadow-sm"
        @click="handleDetail(item)"
      >
        <view class="p-36rpx flex items-center">
          <wd-badge is-dot class="mr-13px" :hidden="item.readStatus">
            <image
              :src="systemMsgIcon"
              class="w-42px h-42px"
              mode="scaleToFill"
              v-if="item.templateType === 2"
            />
            <image
              v-else
              :src="otherMsgIcon"
              class="w-42px h-42px"
              mode="scaleToFill"
            />
          </wd-badge>
          <view class="w-[calc(100%-42px-13px)]">
            <view class="flex justify-between items-center mb-16rpx">
              <view class="text-#1D2129 text-32rpx">
                {{ getTemplateTypeLabel ? getTemplateTypeLabel(item.templateType) : item.templateType }}
              </view>
              <view class="text-#86909C text-28rpx">
                {{ formatDate(item.createTime, "MM-DD HH:mm") }}
              </view>
            </view>
            <view class="text-#86909C text-28rpx text-ellipsis">
              {{ item.templateContent }}
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view
        v-if="loadMoreState !== 'loading' && list.length === 0"
        class="py-100rpx text-center"
      >
        <wd-status-tip image="content" tip="暂无消息" />
      </view>
      <wd-loadmore v-if="list.length > 0" :state="loadMoreState" @reload="loadMore" />
    </view>

    <!-- 详情弹窗 -->
    <DetailPopup ref="detailPopupRef" :get-template-type-label="getTemplateTypeLabel" />
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { onReachBottom } from '@dcloudio/uni-app'
import { formatDate } from '../../../utils'
import { useUserStore } from '../../../store/user'
import { useGlobalState } from '../../../store/global'
import { useDictStore } from '../../../store/dict'
import {
  getMyNotifyMessagePage,
  updateNotifyMessageRead,
  updateAllNotifyMessageRead,
} from '../../../api/system/notify/message'
import type { NotifyMessage } from '../../../api/system/notify/message'
import DetailPopup from '../components/detail-popup.vue'

defineOptions({
  name: 'MessagePage',
})

const props = withDefaults(defineProps<{
  /** 系统消息图标 */
  systemMsgIcon?: string
  /** 业务消息图标 */
  otherMsgIcon?: string
}>(), {
  systemMsgIcon: '/static/framework/message/icon2.png',
  otherMsgIcon: '/static/framework/message/icon1.png',
})

export type LoadMoreState = 'loading' | 'finished' | 'error'

// 消息类型字典 key
const SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type'

const toast = useToast()
const userStore = useUserStore()
const globalState = useGlobalState()
const dictStore = useDictStore()

const total = ref(0)
const list = ref<NotifyMessage[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const templateType = ref('otherMsg')
const otherMsgUnread = ref(0)
const systemMagUnread = ref(0)
const templateContent = ref('')
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})
const detailPopupRef = ref<InstanceType<typeof DetailPopup>>()

const badgeProps1 = ref({
  modelValue: otherMsgUnread.value,
  max: 99,
  right: '-8px',
})
const badgeProps2 = ref({
  modelValue: systemMagUnread.value,
  max: 99,
  right: '-8px',
})

/** 获取消息类型标签 */
function getTemplateTypeLabel(type: number): string {
  const dictData = dictStore.getDictData(SYSTEM_NOTIFY_TEMPLATE_TYPE, type)
  return dictData?.label || String(type)
}

function handleTypeChange({ name }: { name: string }) {
  templateType.value = name
  handleQuery()
}

/** 查询消息列表 */
async function getList() {
  loadMoreState.value = 'loading'
  try {
    const data = await getMyNotifyMessagePage({
      ...queryParams.value,
      templateTypes: templateType.value === 'systemMsg' ? 2 : [1, 3, 4],
      templateContent: templateContent.value,
      viewType: 'received',
      userId: userStore.userInfo.id,
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

/** 查询未读数量 */
async function getUnreadNum() {
  const data = await getMyNotifyMessagePage({
    pageNo: 1,
    pageSize: 200,
    readStatus: false,
    userId: userStore.userInfo.id,
    viewType: 'received',
  })
  systemMagUnread.value = data.list.filter((x: any) => x.templateType === 2).length
  otherMsgUnread.value = data.list.filter((x: any) => x.templateType !== 2).length
  badgeProps1.value.modelValue = otherMsgUnread.value
  badgeProps2.value.modelValue = systemMagUnread.value
}

/** 搜索按钮操作 */
function handleQuery(data?: Record<string, any>) {
  queryParams.value = {
    ...data,
    pageNo: 1,
    pageSize: queryParams.value.pageSize,
  }
  list.value = []
  getList()
}

/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === 'finished') {
    return
  }
  queryParams.value.pageNo++
  getList()
}

/** 查看详情 */
function handleDetail(item: NotifyMessage) {
  // 如果未读，先标记已读
  if (!item.readStatus) {
    handleReadOne(item, false)
  }
  // 打开详情弹窗
  detailPopupRef.value?.open(item)
}

/** 标记单条已读 */
async function handleReadOne(item: NotifyMessage, showToast = true) {
  await updateNotifyMessageRead(item.id)
  // 更新本地状态
  item.readStatus = true
  item.readTime = new Date()
  if (showToast) {
    toast.success('已标记为已读')
  }
  globalState.fetchGlobalInfo()
}

/** 标记全部已读 */
function handleReadAll() {
  uni.showModal({
    title: '提示',
    content: '确定要将所有消息标记为已读吗？',
    success: async (res) => {
      if (!res.confirm) {
        return
      }
      await updateAllNotifyMessageRead()
      toast.success('全部已读成功')
      // 刷新列表
      queryParams.value.pageNo = 1
      list.value = []
      await getUnreadNum()
      await getList()
      globalState.fetchGlobalInfo()
    },
  })
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore()
})

/** 初始化 */
onMounted(() => {
  getList()
  getUnreadNum()
})
</script>

<style lang="scss" scoped>
:deep(.wd-navbar) {
  background-color: #22b5af;
  &::after {
    background-color: transparent !important;
  }
  .wd-navbar__title {
    color: #fff;
  }
  .wd-navbar__right .wd-navbar__text {
    color: #fff;
  }
}
.top_bg {
  background: linear-gradient(180deg, #22b5af 0%, #e0fefb 100%);
  :deep(.wd-search) {
    background-color: transparent;
    .wd-search__block {
      border-radius: 4px;
      background-color: #fff;
    }
  }
  :deep(.wd-tabs) {
    background-color: transparent;
    .wd-tabs__nav {
      background-color: transparent;
      .wd-tabs__line {
        width: 40%;
        bottom: 0;
      }
      .wd-tabs__nav-item {
        &.is-active {
          color: #009688;
        }
      }
    }
  }
}
</style>
