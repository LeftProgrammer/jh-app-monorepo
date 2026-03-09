<template>
  <view v-if="breadcrumbList.length > 0" class="contact-breadcrumb">
    <scroll-view scroll-x class="breadcrumb-scroll">
      <view class="breadcrumb-content">
        <view
          class="breadcrumb-item"
          :class="{ active: breadcrumbList.length > 0 }"
          @click="handleClick(-1)"
        >
          <text>全部</text>
        </view>
        
        <template v-for="(item, index) in breadcrumbList" :key="item.id">
          <wd-icon name="arrow-right" size="12px" color="#999" custom-class="breadcrumb-arrow" />
          <view
            class="breadcrumb-item"
            :class="{ active: index < breadcrumbList.length - 1 }"
            @click="handleClick(index)"
          >
            <text>{{ item.name }}</text>
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

interface BreadcrumbItem {
  id: number
  name: string
}

interface Props {
  /** 当前层级ID */
  modelValue: number
  /** 当前部门信息 */
  currentDept?: any
  /** 最大显示数量 */
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 5
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:currentDept': [value: any]
  change: [item: BreadcrumbItem, index: number]
}>()

const breadcrumbList = ref<BreadcrumbItem[]>([])

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    if (val === 0) {
      breadcrumbList.value = []
    }
  }
)

// 点击面包屑
function handleClick(index: number) {
  if (index === -1) {
    // 点击"全部"
    breadcrumbList.value = []
    emit('update:modelValue', 0)
    emit('update:currentDept', null)
  } else if (index < breadcrumbList.value.length - 1) {
    // 点击中间层级
    const item = breadcrumbList.value[index]
    breadcrumbList.value = breadcrumbList.value.slice(0, index + 1)
    emit('update:modelValue', item.id)
    emit('update:currentDept', item)
    emit('change', item, index)
  }
}

// 进入子层级
function enter(item: BreadcrumbItem) {
  breadcrumbList.value.push(item)
  emit('update:modelValue', item.id)
  emit('update:currentDept', item)
  emit('change', item, breadcrumbList.value.length - 1)
}

// 返回上一层级
function back(): boolean {
  if (breadcrumbList.value.length === 0) {
    return false
  }
  breadcrumbList.value.pop()
  const lastItem = breadcrumbList.value[breadcrumbList.value.length - 1]
  const id = lastItem?.id ?? 0
  emit('update:modelValue', id)
  emit('update:currentDept', lastItem)
  emit('change', lastItem, breadcrumbList.value.length - 1)
  return true
}

// 清空面包屑
function clear() {
  breadcrumbList.value = []
  emit('update:modelValue', 0)
  emit('update:currentDept', null)
}

defineExpose({ enter, back, clear })
</script>

<style lang="scss" scoped>
.contact-breadcrumb {
  background: white;
  padding: 16rpx 24rpx;
}

.breadcrumb-scroll {
  white-space: nowrap;
}

.breadcrumb-content {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
  cursor: pointer;
  
  &.active {
    color: #1890ff;
  }
}

.breadcrumb-arrow {
  margin: 0 8rpx;
}
</style>
