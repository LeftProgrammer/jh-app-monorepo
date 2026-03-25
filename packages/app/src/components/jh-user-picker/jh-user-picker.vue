<template>
  <wd-select-picker
    v-if="useDefaultSlot"
    v-model="selectedId"
    :label="label"
    :label-width="labelWidth"
    :columns="userList"
    value-key="id"
    label-key="nickname"
    :type="type"
    :prop="prop"
    :clearable="clearable"
    :use-default-slot="true"
    filterable
    :placeholder="placeholder"
    align-right
    @confirm="handleConfirm"
  >
    <slot />
  </wd-select-picker>
  <wd-select-picker
    v-else
    v-model="selectedId"
    custom-class="user-picker"
    :label="label"
    :label-width="labelWidth"
    :columns="userList"
    value-key="id"
    :clearable="clearable"
    label-key="nickname"
    align-right
    :type="type"
    :prop="prop"
    filterable
    :placeholder="placeholder"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '../../store'

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    type?: 'radio' | 'checkbox'
    label?: string
    placeholder?: string
    useDefaultSlot?: boolean
    clearable?: boolean
    labelWidth?: string
    prop?: string
  }>(),
  {
    type: 'radio',
    label: '',
    placeholder: '请选择',
    useDefaultSlot: false,
    clearable: true,
    labelWidth: '180rpx',
    prop: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | undefined): void
  (e: 'confirm', value: string | string[] | undefined, users: []): void
}>()

const userStore = useUserStore()
const selectedId = ref<string | string[]>([])
const userList = computed(() => userStore.userList)
/** 根据用户 ID 获取昵称 */
function getUserNickname(userId: string | undefined): string {
  if (!userId) {
    return ''
  }
  const user = userList.value.find(u => u.id === userId)
  return user?.nickname || ''
}

defineExpose({
  getUserNickname,
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

/** 选择确认 */
function handleConfirm({ value }: { value: any }) {
  const ids = props.type === 'radio' ? value : value.join(',')
  emit('update:modelValue', ids)
  const users = ids.split(',').map(x => {
    return userList.value.find(y => y.id === x)
  })
  emit('confirm', ids, ids ? users : [])
}
</script>
