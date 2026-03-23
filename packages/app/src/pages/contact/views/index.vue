<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="navbarTitle"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="handleBack"
    />
    <!-- 面包屑导航 -->
    <ContactBreadcrumb
      ref="breadcrumbRef"
      v-model="currentDeptId"
      v-model:current-dept="currentDept"
      :root-label="rootLabel"
      :class="showBreadcrumb ? '' : 'hidden'"
    />
    <!-- 通讯录列表 -->
    <view class="p-24rpx">
      <!-- 部门列表 -->
      <view
        v-for="item in currentDeptList"
        :key="`dept-${item.id}`"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleEnterDept(item)"
      >
        <view class="flex items-center p-24rpx">
          <view class="mr-16rpx h-80rpx w-80rpx rounded-8rpx">
            <slot name="dept-icon" :item="item">
              <image :src="deptIcon" class="h-full w-full" />
            </slot>
          </view>
          <view class="flex-1">
            <view class="text-28rpx text-[#333] font-medium">
              {{ item.name }}
            </view>
            <view
              v-if="item.children && item.children.length > 0"
              class="mt-8rpx text-24rpx text-[#999]"
            >
              {{ item.children.length }} 个子部门
            </view>
          </view>
          <wd-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
      </view>

      <!-- 用户列表分隔线 -->
      <view
        v-if="currentDeptList.length > 0 && currentUserList.length > 0"
        class="my-24rpx flex items-center"
      >
        <view class="h-1rpx flex-1 bg-[#ddd]" />
        <text class="mx-16rpx text-24rpx text-[#999]">{{ userListLabel }}</text>
        <view class="h-1rpx flex-1 bg-[#ddd]" />
      </view>

      <!-- 用户列表 -->
      <view
        v-for="item in currentUserList"
        :key="`user-${item.id}`"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleUserClick(item)"
      >
        <view class="flex items-center p-24rpx">
          <view
            v-if="item.avatar"
            class="mr-16rpx h-80rpx w-80rpx overflow-hidden rounded-full"
          >
            <image :src="item.avatar" class="h-full w-full" mode="aspectFill" />
          </view>
          <view
            v-else
            class="mr-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-full bg-[#1890ff] text-32rpx text-white"
          >
            {{ item.nickname?.charAt(0) || item.username?.charAt(0) }}
          </view>
          <view class="flex-1">
            <view class="text-28rpx text-[#1D2129] font-medium">
              {{ item.nickname }}
            </view>
            <view class="text-23rpx text-[#86909C]">{{ item.mobile }}</view>
          </view>
          <slot name="user-action" :item="item">
            <image :src="phoneIcon" class="w-61rpx h-61rpx" />
          </slot>
        </view>
      </view>

      <!-- 空状态 -->
      <view
        v-if="!loading && currentDeptList.length === 0 && currentUserList.length === 0"
        class="py-100rpx text-center"
      >
        <slot name="empty">
          <wd-status-tip image="content" tip="暂无数据" />
        </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { Dept } from '../../../api/system/dept'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { getSimpleDeptList } from '../../../api/system/dept'
import { useUserStore } from '../../../store/user'
import { findChildren, handleTree } from '../../../utils/tree'
import { navigateBackPlus } from '../../../utils'
import ContactBreadcrumb from '../components/breadcrumb.vue'
import type { BreadcrumbItem } from '../components/breadcrumb.vue'
// 内置默认图标
import deptIconDefault from '../../../static/images/contact/contact.png'
import phoneIconDefault from '../../../static/images/contact/phone.png'

defineOptions({
  name: 'ContactPage',
})

export interface User {
  id?: number
  username?: string
  nickname?: string
  avatar?: string
  mobile?: string
  deptId?: number
  [key: string]: any
}

const props = withDefaults(defineProps<{
  /** 页面标题 */
  title?: string
  /** 根节点标签 */
  rootLabel?: string
  /** 用户列表标签 */
  userListLabel?: string
  /** 是否显示面包屑 */
  showBreadcrumb?: boolean
  /** 返回页面路径 */
  backUrl?: string
  /** 外部传入的用户列表（如果不传，则使用 userStore.userList） */
  userList?: User[]
  /** 部门图标 */
  deptIconSrc?: string
  /** 电话图标 */
  phoneIconSrc?: string
}>(), {
  title: '通讯录',
  rootLabel: '全部',
  userListLabel: '部门成员',
  showBreadcrumb: false,
  backUrl: '',
})

// 图标：优先使用 props，否则使用内置默认
const deptIcon = computed(() => props.deptIconSrc || deptIconDefault)
const phoneIcon = computed(() => props.phoneIconSrc || phoneIconDefault)

const emit = defineEmits<{
  'user-click': [user: User]
  'dept-click': [dept: Dept]
}>()

const userStore = useUserStore()
const toast = useToast()
const loading = ref(false)
const deptList = ref<Dept[]>([])

const currentDept = ref<BreadcrumbItem>()
const currentDeptId = ref(0)
const breadcrumbRef = ref<InstanceType<typeof ContactBreadcrumb>>()

/** 导航栏标题 */
const navbarTitle = computed(() => {
  return currentDept.value?.name || props.title
})

/** 当前层级的部门列表 */
const currentDeptList = computed(() => {
  if (currentDeptId.value === 0) {
    return deptList.value.filter((item) => item.parentId === 0)
  }
  return findChildren(deptList.value, currentDeptId.value)
})

/** 当前层级的用户列表 */
const currentUserList = computed(() => {
  if (currentDeptId.value === 0) {
    return []
  }
  const users = props.userList || userStore.userList || []
  return users.filter((item: User) => item.deptId === currentDeptId.value)
})

/** 进入部门层级 */
function handleEnterDept(item: Dept) {
  breadcrumbRef.value?.enter({ id: item.id!, name: item.name })
  emit('dept-click', item)
}

/** 返回上一层级 */
function handleBack() {
  if (currentDeptId.value === 0) {
    navigateBackPlus(props.backUrl)
    return
  }
  breadcrumbRef.value?.back()
}

/** 点击用户 */
function handleUserClick(item: User) {
  emit('user-click', item)
  // 默认行为：拨打电话
  if (!item.mobile) {
    toast.show('暂无联系方式')
    return
  }
  // #ifdef APP-PLUS
  uni.makePhoneCall({
    phoneNumber: item.mobile,
  })
  // #endif
}

/** 加载部门列表 */
async function loadDeptList() {
  loading.value = true
  try {
    const deptData = await getSimpleDeptList()
    deptList.value = handleTree(deptData)
  } finally {
    loading.value = false
  }
}

/** 刷新数据 */
function refresh() {
  loadDeptList()
}

// 暴露方法和数据
defineExpose({
  refresh,
  deptList,
  currentDeptId,
  currentDept,
  breadcrumbRef,
})

onMounted(() => {
  loadDeptList()
})
</script>
