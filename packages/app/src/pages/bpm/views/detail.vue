<template>
  <view class="yd-page-container overflow-auto">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="审批详情"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />
    <wd-tabs
      v-model="activeTab"
      :style="{
        height:
          runningTask && type === 'todo'
            ? `calc(100vh - 60px - 16rpx - ${getNavbarHeight()}px)`
            : `calc(100vh - ${getNavbarHeight()}px)`,
      }"
    >
      <wd-tab title="任务处理">
        <view class="content">
          <!-- 区域：审批详情（表单） -->
          <BpmFormDetail
            ref="formDetailRef"
            :process-definition="processDefinition"
            :process-instance="processInstance"
            :todo-task="todoTask"
            :type="type"
            :form-modules="props.formModules"
            :register-component="props.registerComponentFn"
          >
            <template #no-form-image>
              <slot name="no-form-image" />
            </template>
          </BpmFormDetail>
          <!-- 区域：审批记录 -->
          <BpmProcessTaskList
            :running-task="runningTask"
            :sorted-tasks="sortedTasks"
          />
        </view>
      </wd-tab>
      <wd-tab title="流程图">
        <BpmProcessViewer
          :model-view="processModelView"
          :style="{
            height: `calc(100vh - ${getNavbarHeight()}px - 50px - 60px - 16rpx)`,
          }"
        />
      </wd-tab>
    </wd-tabs>

    <!-- 区域：底部操作栏 -->
    <view
      v-if="runningTask && type === 'todo'"
      class="mt-16rpx flex justify-around bg-#fff px-23px py-12px"
    >
      <wd-button plain :round="false" @click="handleApprove('delegate')">
        委托
      </wd-button>
      <wd-button type="primary" :round="false" @click="handleApprove('approve')">
        办理
      </wd-button>
    </view>

    <!-- 办理弹框 -->
    <wd-overlay :show="showApprove" @click="showApprove = false">
      <view class="fixed box-border h-100% w-100% px-16rpx pt-30%" @click.stop="">
        <view class="rounded-8rpx bg-#fff p-32rpx">
          <view class="mb-40rpx text-center text-36rpx text-#1D2129">
            办理详情
          </view>
          <jh-user-picker
            v-if="approveForm.type === 'delegate'"
            v-model="approveForm.delegateUserId"
            label="委托人办理"
          />
          <view v-else class="flex items-center justify-between">
            <wd-radio-group v-model="approveForm.type" shape="dot" inline>
              <wd-radio value="approve">
                同意
              </wd-radio>
              <wd-radio value="return">
                退回
              </wd-radio>
            </wd-radio-group>
            <wd-picker
              v-model="approveForm.targetTaskDefinitionKey"
              :columns="returnList"
              label-key="name"
              value-key="taskDefinitionKey"
              placeholder="请选择退回节点"
              :disabled="approveForm.type !== 'return'"
            />
          </view>
          <wd-divider class="!my-32rpx !mt-0 !px-0" />
          <view class="mb-16rpx flex text-28rpx">
            <view class="text-#4E5969">
              处理意见
            </view>
            <wd-picker
              v-model="approveForm.reason"
              :columns="reasonOptions"
              use-default-slot
            >
              <view class="ml-26rpx rounded-4rpx bg-#C3E7E4 px-12rpx text-#009688">
                选择常用审批语
              </view>
            </wd-picker>
          </view>
          <wd-textarea
            v-model="approveForm.reason"
            class="!p-0"
            placeholder="请输入审批语句"
            show-word-limit
            :maxlength="200"
          />
          <wd-divider class="!my-32rpx !px-0" />
          <view class="flex justify-around">
            <wd-button plain :round="false" @click="cancelApprove">
              取消
            </wd-button>
            <wd-button type="primary" :round="false" @click="confirmApprove">
              确定
            </wd-button>
          </view>
        </view>
      </view>
    </wd-overlay>
  </view>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { ProcessDefinition, ProcessInstance } from '../../../api/bpm/processInstance'
import type { Task } from '../../../api/bpm/task'
import { computed, ref, watch } from 'vue'
import { useToast } from 'wot-design-uni'
import {
  getApprovalDetail,
  getProcessInstanceBpmnModelView,
} from '../../../api/bpm/processInstance'
import {
  approveTask,
  delegateTask,
  getTaskListByProcessInstanceId,
  getTaskListByReturn,
  returnTask,
} from '../../../api/bpm/task'
import { getIntDictOptions } from '../../../hooks/useDict'
import { useGlobalState } from '../../../store/global'
import { useUserStore } from '../../../store/user'
import { getNavbarHeight, navigateBackPlus } from '../../../utils'
import BpmFormDetail from '../components/form-detail.vue'
import BpmProcessViewer from '../components/process-viewer/index.vue'
import BpmProcessTaskList from '../components/process-task-list.vue'

defineOptions({
  name: 'BpmDetailPage',
})

const props = withDefaults(defineProps<{
  /** 流程实例 ID */
  processInstanceId: string
  /** 类型：todo/done/my/copy */
  type?: string
  /** 返回页面路径 */
  backUrl?: string
  /** 审批意见字典类型（默认 APPROVE_REASON） */
  reasonDictType?: string
  /**
   * 业务表单组件映射（小程序环境必须）
   * key: 表单路径（如 '/general/leaveApply/dataForm'）
   * value: 组件引用
   */
  formModules?: Record<string, Component>
  /**
   * H5 环境下的动态组件注册函数
   */
  registerComponentFn?: (path?: string) => Component | undefined
}>(), {
  type: 'todo',
  backUrl: '/pages/bpm/index',
  reasonDictType: 'bpm_approve_reason',
})

/** 审批意见选项（从字典获取） */
const reasonOptions = computed(() => {
  return getIntDictOptions(props.reasonDictType)
})

const emit = defineEmits<{
  (e: 'approve-success'): void
  (e: 'before-approve', type: string): Promise<boolean> | boolean
  (e: 'submit', formRef: any): Promise<void> | void
}>()

const userStore = useUserStore()
const globalState = useGlobalState()
const toast = useToast()

const processInstance = ref<Partial<ProcessInstance>>({})
const processDefinition = ref<Partial<ProcessDefinition>>({})
const todoTask = ref({})
const tasks = ref<Task[]>([])
const orderAsc = ref(true)
const activeTab = ref('1')
const processModelView = ref<any>({})
const type = computed(() => props.type)

/** 当前用户需要处理的任务 */
const runningTask = computed(() => {
  return tasks.value.find((task) => {
    if (task.status !== 1 && task.status !== 6) {
      return false
    }
    return String(task.assigneeUser?.id) === String(userStore.userInfo?.id)
  })
})

/** 排序后的任务列表 */
const sortedTasks = computed(() => {
  const list = [...tasks.value].filter(t => t.status !== 4)
  list.sort((a, b) => {
    const aEndTime = a.endTime ? new Date(a.endTime).getTime() : 0
    const bEndTime = b.endTime ? new Date(b.endTime).getTime() : 0
    const aCreateTime = a.createTime ? new Date(a.createTime).getTime() : 0
    const bCreateTime = b.createTime ? new Date(b.createTime).getTime() : 0

    if (aEndTime && bEndTime) {
      return orderAsc.value ? aEndTime - bEndTime : bEndTime - aEndTime
    }
    if (aEndTime) {
      return orderAsc.value ? -1 : 1
    }
    if (bEndTime) {
      return orderAsc.value ? 1 : -1
    }
    return orderAsc.value ? aCreateTime - bCreateTime : bCreateTime - aCreateTime
  })
  return list
})

/** 返回上一页 */
function handleBack() {
  navigateBackPlus(props.backUrl)
}

// 审批相关
const showApprove = ref(false)
const approveForm = ref<any>({ type: 'approve' })
const returnList = ref<any[]>([])
const formDetailRef = ref<any>()

function cancelApprove() {
  approveForm.value = { type: 'approve' }
  showApprove.value = false
}

async function handleApprove(approveType: string) {
  if (!runningTask.value) {
    return
  }
  // 校验表单
  if (formDetailRef.value?.formRef) {
    const { valid } = await formDetailRef.value.formRef.validate()
    if (!valid) {
      return
    }
  }
  // 调用表单的 beforeSubmit
  if (formDetailRef.value?.beforeSubmit) {
    const valid = await formDetailRef.value.beforeSubmit()
    if (!valid) {
      return
    }
  }
  handleSubmit(approveType)
}

async function handleSubmit(approveType: string) {
  showApprove.value = true
  approveForm.value.type = approveType
  returnList.value = await getTaskListByReturn(runningTask.value!.id)
}

async function confirmApprove() {
  if (!approveForm.value.reason) {
    toast.error('请填写审批意见')
    return
  }
  if (approveForm.value.type === 'return' && !approveForm.value.targetTaskDefinitionKey) {
    toast.error('请选择退回节点')
    return
  }
  if (approveForm.value.type === 'delegate' && !approveForm.value.delegateUserId) {
    toast.error('请选择接收人')
    return
  }

  // 调用表单的 handleSubmit
  if (formDetailRef.value?.handleSubmit) {
    await formDetailRef.value.handleSubmit()
  }

  const api
    = approveForm.value.type === 'approve'
      ? approveTask
      : approveForm.value.type === 'return'
        ? returnTask
        : delegateTask

  const result = await api({
    id: runningTask.value!.id as string,
    reason: approveForm.value.reason,
    targetTaskDefinitionKey: approveForm.value.targetTaskDefinitionKey,
    delegateUserId: approveForm.value.delegateUserId,
  })

  if (result) {
    toast.success('审批成功')
    globalState.fetchGlobalInfo()
    emit('approve-success')
    handleBack()
  }
}

/** 加载流程实例 */
async function loadProcessInstance() {
  const data = await getApprovalDetail({ processInstanceId: props.processInstanceId })
  if (!data || !data.processInstance) {
    toast.show('查询不到审批详情信息')
    return
  }
  processInstance.value = data.processInstance
  todoTask.value = data.todoTask || {}
  processDefinition.value = data.processDefinition || {}
}

/** 获取流程模型视图 */
async function getProcessModelView() {
  const data = await getProcessInstanceBpmnModelView(props.processInstanceId)
  processModelView.value = data
}

/** 加载任务列表 */
async function loadTasks() {
  tasks.value = await getTaskListByProcessInstanceId(props.processInstanceId)
}

/** 初始化 */
async function init() {
  if (!props.processInstanceId) {
    toast.show('参数错误')
    return
  }
  await Promise.all([loadProcessInstance(), loadTasks(), getProcessModelView()])
}

/** 刷新数据 */
function refresh() {
  init()
}

// 暴露方法和数据
defineExpose({
  refresh,
  processInstance,
  processDefinition,
  todoTask,
  runningTask,
  sortedTasks,
  approveForm,
})

// 监听 processInstanceId 变化后初始化
watch(
  () => props.processInstanceId,
  (newVal) => {
    if (newVal) {
      init()
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
:deep(.wd-tabs) {
  background-color: #f5f5f5;
  .wd-tabs__nav {
    margin-bottom: 8px;
    .wd-tabs__nav-item {
      color: #4e5969;
      &.is-active {
        color: #009688;
      }
    }
    .wd-tabs__line {
      bottom: 0;
      width: 50%;
      height: 4rpx;
    }
  }
  .wd-tabs__container {
    height: calc(100% - 50px);
    background-color: #f5f5f5;
    .wd-tabs__body {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
