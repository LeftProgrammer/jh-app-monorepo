<template>
  <view class="contact-list">
    <!-- 部门列表 -->
    <view
      v-for="item in departmentList"
      :key="`dept-${item.id}`"
      class="contact-item"
      @click="handleDepartmentClick(item)"
    >
      <view class="contact-item-content">
        <view class="contact-item-avatar">
          <image :src="departmentIcon" class="avatar-image" />
        </view>
        <view class="contact-item-info">
          <view class="contact-item-name">{{ item.name }}</view>
          <view v-if="showChildCount && item.children?.length" class="contact-item-desc">
            {{ item.children.length }} 个子部门
          </view>
        </view>
        <view class="contact-item-arrow">
          <image :src="arrowIcon" class="arrow-image" />
        </view>
      </view>
    </view>

    <!-- 用户列表 -->
    <view
      v-if="showUserList && userList.length > 0"
      class="contact-section-divider"
    >
      <view class="divider-line" />
      <text class="divider-text">{{ userListText }}</text>
      <view class="divider-line" />
    </view>
    
    <view
      v-for="item in userList"
      :key="`user-${item.id}`"
      class="contact-item"
      @click="handleUserClick(item)"
    >
      <view class="contact-item-content">
        <view class="contact-item-avatar">
          <image v-if="item.avatar" :src="item.avatar" class="avatar-image" mode="aspectFill" />
          <view v-else class="avatar-placeholder">
            {{ getAvatarText(item) }}
          </view>
        </view>
        <view class="contact-item-info">
          <view class="contact-item-name">{{ item.displayName || item.nickname }}</view>
          <view class="contact-item-desc">{{ item.mobile || item.email }}</view>
        </view>
        <view class="contact-item-action">
          <image :src="phoneIcon" class="action-image" />
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="showEmpty" class="contact-empty">
      <wd-status-tip image="content" :tip="emptyText" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface User {
  id: number
  nickname?: string
  username?: string
  displayName?: string
  avatar?: string
  mobile?: string
  email?: string
  deptId?: number
}

interface Department {
  id: number
  name: string
  children?: Department[]
  parentId?: number
}

interface Props {
  /** 部门列表 */
  departments?: Department[]
  /** 用户列表 */
  users?: User[]
  /** 是否显示用户列表 */
  showUserList?: boolean
  /** 是否显示子部门数量 */
  showChildCount?: boolean
  /** 用户列表标题 */
  userListText?: string
  /** 空状态文本 */
  emptyText?: string
  /** 部门图标 */
  departmentIcon?: string
  /** 箭头图标 */
  arrowIcon?: string
  /** 电话图标 */
  phoneIcon?: string
  /** 是否加载中 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  departments: () => [],
  users: () => [],
  showUserList: true,
  showChildCount: true,
  userListText: '部门成员',
  emptyText: '暂无数据',
  departmentIcon: '/static/images/contact/contact.png',
  arrowIcon: '/static/images/contact/contact-right.png',
  phoneIcon: '/static/images/contact/phone.png',
  loading: false
})

const emit = defineEmits<{
  departmentClick: [dept: Department]
  userClick: [user: User]
}>()

// 计算属性
const departmentList = computed(() => props.departments)
const userList = computed(() => props.users)
const showEmpty = computed(() => !props.loading && departmentList.value.length === 0 && userList.value.length === 0)

// 获取头像文字
function getAvatarText(user: User) {
  return user.displayName?.charAt(0) || user.nickname?.charAt(0) || user.username?.charAt(0) || '?'
}

// 事件处理
function handleDepartmentClick(dept: Department) {
  emit('departmentClick', dept)
}

function handleUserClick(user: User) {
  emit('userClick', user)
}
</script>

<style lang="scss" scoped>
.contact-list {
  padding: 24rpx;
}

.contact-item {
  margin-bottom: 24rpx;
  overflow: hidden;
  border-radius: 12rpx;
  background: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.contact-item-content {
  display: flex;
  align-items: center;
  padding: 24rpx;
}

.contact-item-avatar {
  margin-right: 16rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  overflow: hidden;
  
  &.avatar-placeholder {
    border-radius: 50%;
    background: #1890ff;
    color: white;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.contact-item-info {
  flex: 1;
}

.contact-item-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.contact-item-desc {
  font-size: 24rpx;
  color: #999;
}

.contact-item-arrow {
  width: 19rpx;
  height: 19rpx;
}

.contact-item-action {
  width: 61rpx;
  height: 61rpx;
}

.contact-section-divider {
  margin: 24rpx 0;
  display: flex;
  align-items: center;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #ddd;
}

.divider-text {
  margin: 0 16rpx;
  font-size: 24rpx;
  color: #999;
  white-space: nowrap;
}

.contact-empty {
  padding: 100rpx 0;
  text-align: center;
}
</style>
