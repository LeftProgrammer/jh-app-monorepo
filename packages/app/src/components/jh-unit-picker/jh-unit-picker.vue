<template>
  <wd-select-picker
    v-model="selectedId"
    :label="label"
    :label-width="label ? '180rpx' : '0'"
    :columns="unitList"
    value-key="id"
    label-key="name"
    :type="type"
    align-right
    filterable
    :placeholder="placeholder"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import type { ProjectUnit } from '../../api/system/unit'
import { onMounted, ref, watch } from 'vue'
import { getList } from '../../api/system/unit'

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    type?: 'radio' | 'checkbox'
    label?: string
    placeholder?: string
  }>(),
  {
    type: 'radio',
    label: '',
    placeholder: '请选择',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | undefined): void
}>()

const unitList = ref<ProjectUnit[]>([])
const selectedId = ref<string | string[]>([])

/** 根据单位 ID 获取单位名称 */
function getUnitname(unitId: string | undefined): string {
  if (!unitId) {
    return ''
  }
  const unit = unitList.value.find((u: any) => u.id === unitId)
  return unit?.name || ''
}

defineExpose({
  getUnitname,
})

watch(
  () => props.modelValue,
  val => {
    if (props.type === 'radio') {
      // 单选时，如果值为 undefined，使用空字符串避免警告
      selectedId.value = val !== undefined ? val : ''
    } else {
      // 多选时，确保是数组
      selectedId.value = val ? (Array.isArray(val) ? val : val.split(',')) : []
    }
  },
  { immediate: true }
)

/** 加载用户列表 */
async function loadUserList() {
  unitList.value = (await getList()) as any
}

/** 选择确认 */
function handleConfirm({ value }: { value: any }) {
  const data = props.type === 'radio' ? (value ? String(value) : '') : String(value.join(','))
  emit('update:modelValue', data)
}

/** 初始化 */
onMounted(() => {
  loadUserList()
})
</script>
