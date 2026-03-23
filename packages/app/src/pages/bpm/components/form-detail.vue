<!-- 表单详情：流程表单/业务表单 -->
<template>
  <view class="overflow-hidden bg-white">
    <!-- 表单内容：业务表单 -->
    <template v-if="processDefinition?.formType === BpmModelFormType.CUSTOM">
      <component
        :is="BusinessFormComponent"
        v-if="BusinessFormComponent"
        :id="processInstance?.businessKey"
        ref="BusinessFormComponentRef"
        :todo-task="todoTask"
        :type="type"
        embedded
      />
      <wd-status-tip
        v-else
        image="/"
        tip="此流程表单仅 PC 端支持预览"
      >
        <template #image>
          <slot name="no-form-image">
            <view class="h-140rpx w-280rpx bg-#f5f5f5 flex items-center justify-center text-#999">
              暂无表单
            </view>
          </slot>
        </template>
      </wd-status-tip>
    </template>
    <!-- 表单内容：流程表单 -->
    <template v-else-if="processDefinition?.formType === BpmModelFormType.NORMAL">
      <view class="px-24rpx py-32rpx text-26rpx text-[#999]">
        流程表单仅 PC 端支持预览
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, ref } from 'vue'

defineOptions({
  name: 'BpmFormDetail',
})

/** 表单类型枚举 */
const BpmModelFormType = {
  NORMAL: 10, // 流程表单
  CUSTOM: 20, // 业务表单
}

export interface ProcessDefinition {
  id?: string
  formType?: number
  formCustomCreatePath?: string
}

export interface ProcessInstance {
  id?: string
  businessKey?: string
}

const props = defineProps<{
  /** 流程定义 */
  processDefinition?: ProcessDefinition
  /** 流程实例 */
  processInstance?: ProcessInstance
  /** 待办任务 */
  todoTask?: any
  /** 类型：todo/my/done/copy */
  type?: string
  /**
   * 业务表单组件映射（小程序环境必须）
   * key: 表单路径（如 '/general/leaveApply/dataForm'）
   * value: 组件引用
   */
  formModules?: Record<string, Component>
  /**
   * H5 环境下的动态组件注册函数
   * 如果不传，则使用 formModules 映射
   */
  registerComponent?: (path?: string) => Component | undefined
}>()

/** 动态获取业务表单组件 */
const BusinessFormComponent = computed(() => {
  const componentPath = props.processDefinition?.formCustomCreatePath
  if (!componentPath) {
    return undefined
  }

  // 优先使用 H5 动态注册
  if (props.registerComponent) {
    const component = props.registerComponent(componentPath)
    if (component) {
      return component
    }
  }

  // 使用静态映射（小程序环境）
  if (props.formModules) {
    return props.formModules[componentPath]
  }

  return undefined
})

const BusinessFormComponentRef = ref<any>()

defineExpose({
  /** 表单引用，用于校验 */
  get formRef() {
    return BusinessFormComponentRef.value?.formRef
  },
  /** 提交前校验 */
  get beforeSubmit() {
    return BusinessFormComponentRef.value?.beforeSubmit
  },
  /** 提交处理 */
  get handleSubmit() {
    return BusinessFormComponentRef.value?.handleSubmit
  },
})
</script>
