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
            : `calc(100vh - ${getNavbarHeight()}px)`
      }"
    >
      <wd-tab title="任务处理">
        <view class="content">
          <!-- 区域：审批详情（表单） -->
          <FormDetail
            ref="FormDetailRef"
            :type="type"
            :process-definition="processDefinition"
            :process-instance="processInstance"
            :todoTask="todoTask"
          />
          <!-- 区域：审批记录  -->
          <ProcessInstanceTaskList
            :running-task="runningTask"
            :sorted-tasks="sortedTasks"
          />
        </view>
      </wd-tab>
      <wd-tab title="流程图">
        <ProcessInstanceBpmnViewer
          :model-view="processModelView"
          :style="{
            height: `calc(100vh - ${getNavbarHeight()}px - 50px - 60px  - 16rpx)`
          }"
        />
      </wd-tab>
    </wd-tabs>

    <!-- 区域：底部操作栏 TODO -->
    <view
      v-if="runningTask && type === 'todo'"
      class="py-12px px-23px bg-#fff mt-16rpx flex justify-around"
    >
      <wd-button plain @click="handleApprove('delegate')" :round="false">
        委托
      </wd-button>
      <wd-button type="primary" @click="handleApprove('approve')" :round="false">
        办理
      </wd-button>
    </view>
    <!-- 办理弹框 -->
    <wd-overlay :show="showApprove" @click="showApprove = false">
      <view class="fixed w-100% h-100% box-border px-16rpx pt-30%" @click.stop="">
        <view class="bg-#fff rounded-8rpx p-32rpx">
          <view class="text-#1D2129 text-36rpx text-center mb-40rpx">办理详情</view>
          <UserPicker
            v-if="approveForm.type === 'delegate'"
            v-model="approveForm.delegateUserId"
            label="委托人办理"
          />
          <view class="flex items-center justify-between" v-else>
            <wd-radio-group v-model="approveForm.type" shape="dot" inline>
              <wd-radio value="approve">同意</wd-radio>
              <wd-radio value="return">退回</wd-radio>
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
          <wd-divider class="!px-0 !my-32rpx !mt-0" />
          <view class="text-28rpx flex mb-16rpx">
            <view class="text-#4E5969">处理意见</view>
            <wd-picker
              v-model="approveForm.reason"
              :columns="getIntDictOptions(DICT_TYPE.APPROVE_REASON)"
              use-default-slot
            >
              <view class="text-#009688 ml-26rpx rounded-4rpx bg-#C3E7E4 px-12rpx">
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
          <wd-divider class="!px-0 !my-32rpx" />
          <view class="flex justify-around">
            <wd-button plain @click="cacelApprove" :round="false"> 取消 </wd-button>
            <wd-button type="primary" @click="confirmApprove" :round="false">
              确定
            </wd-button>
          </view>
        </view>
      </view>
    </wd-overlay>
  </view>
</template>

<script lang="ts" setup>
import type { ProcessDefinition, ProcessInstance } from "@/api/bpm/processInstance";
import type { Task } from "@/api/bpm/task";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { useToast, useMessage } from "wot-design-uni";
import {
  getApprovalDetail,
  getProcessInstanceBpmnModelView
} from "@/api/bpm/processInstance";
import { getTaskListByProcessInstanceId } from "@/api/bpm/task";
import { useUserStore } from "@/store";
import { navigateBackPlus, getNavbarHeight } from "@/utils";
import { formatDateTime, formatPast } from "@/utils/date";
import FormDetail from "./components/form-detail.vue";
import {
  approveTask,
  rejectTask,
  getTaskListByReturn,
  returnTask,
  delegateTask
} from "@/api/bpm/task";
import { useGlobalState } from "@/store/global";
import ProcessInstanceBpmnViewer from "./components/ProcessInstanceBpmnViewer.vue";
import ProcessInstanceTaskList from "./components/ProcessInstanceTaskList.vue";
import { DICT_TYPE } from "@/utils/constants";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const userStore = useUserStore();
const toast = useToast();
const message = useMessage();
const processInstanceId = ref("");
const processInstance = ref<Partial<ProcessInstance>>({});
const processDefinition = ref<Partial<ProcessDefinition>>({});
const todoTask = ref({});
const tasks = ref<Task[]>([]);
const orderAsc = ref(true);
const activeTab = ref("1");
const processModelView = ref<any>({}); // 流程模型视图
const type = ref(""); //todo my done copy

/** 当前用户需要处理的任务 */
const runningTask = computed(() => {
  return tasks.value.find((task) => {
    // 待处理状态
    if (task.status !== 1 && task.status !== 6) {
      return false;
    }
    // 当前用户是处理人
    return task.assigneeUser?.id === userStore.userInfo?.id;
  });
});

/** 排序后的任务列表 */
const sortedTasks = computed(() => {
  const list = [...tasks.value].filter((t) => t.status !== 4); // 过滤已取消
  list.sort((a, b) => {
    if (a.endTime && b.endTime) {
      return orderAsc.value ? a.endTime - b.endTime : b.endTime - a.endTime;
    }
    if (a.endTime) {
      return orderAsc.value ? -1 : 1;
    }
    if (b.endTime) {
      return orderAsc.value ? 1 : -1;
    }
    return orderAsc.value ? a.createTime - b.createTime : b.createTime - a.createTime;
  });
  return list;
});

/** 返回上一页 */
function handleBack() {
  navigateBackPlus("/pages/bpm/index");
}

/** 切换排序 */
function toggleOrder() {
  orderAsc.value = !orderAsc.value;
}

/** 获取状态文本 */
// TODO @jason：要有标签，和 vben 一样，盖章
// TODO @jason：通过字典
function getStatusText(status?: number) {
  const map: Record<number, string> = {
    0: "待审批",
    1: "审批中",
    2: "审批通过",
    3: "审批不通过",
    4: "已取消",
    5: "已退回",
    6: "委派中",
    7: "审批通过中"
  };
  return map[status ?? 0] || "待审批";
}

/** 获取状态标签类型 */
function getStatusType(
  status?: number
): "default" | "primary" | "success" | "warning" | "danger" {
  if ([1, 6, 7].includes(status ?? 0)) {
    return "primary";
  }
  if (status === 2) {
    return "success";
  }
  if (status === 3) {
    return "danger";
  }
  if (status === 4 || status === 5) {
    return "warning";
  }
  return "default";
}

/** 获取任务圆点样式 */
// TODO @jason：看看又要对齐 vben
function getTaskDotClass(task: Task) {
  if ([1, 6, 7].includes(task.status)) {
    return "bg-[#1890ff]";
  }
  if (task.status === 2) {
    return "bg-[#52c41a]";
  }
  if (task.status === 3) {
    return "bg-[#ff4d4f]";
  }
  if (task.status === 5) {
    return "bg-[#faad14]";
  }
  return "bg-[#d9d9d9]";
}

/** 获取状态文本样式 */
// TODO @jason：看看又要对齐 vben
function getStatusTextClass(status: number) {
  if ([1, 6, 7].includes(status)) {
    return "text-[#1890ff]";
  }
  if (status === 2) {
    return "text-[#52c41a]";
  }
  if (status === 3) {
    return "text-[#ff4d4f]";
  }
  if (status === 5) {
    return "text-[#faad14]";
  }
  return "text-[#999]";
}
const FormDetailRef = ref();
// 审批意见
const reason = ref("");
/** 同意 */
async function handleApprove(type: string) {
  if (!runningTask.value) {
    return;
  }
  if (FormDetailRef.value?.formRef) {
    const { valid } = await FormDetailRef.value?.formRef.validate();
    if (!valid) {
      return;
    }
  }
  if (FormDetailRef.value?.beforeSubmit) {
    const valid = await FormDetailRef.value?.beforeSubmit();
    if (!valid) {
      return;
    }
  }
  handleSubmit(type);
}

// 刷新待办消息
const globalState = useGlobalState();
const showApprove = ref(false);
const approveForm: any = ref({ type: "approve" });
const returnList = ref([] as any); // 退回节点

function cacelApprove() {
  approveForm.value = { type: "approve" };
  showApprove.value = false;
}
async function confirmApprove() {
  if (!approveForm.value.reason) {
    toast.error("请填写审批意见");
    return;
  }
  if (approveForm.value.type === "return" && !approveForm.value.targetTaskDefinitionKey) {
    toast.error("请选择退回节点");
    return;
  }
  if (approveForm.value.type === "delegate" && !approveForm.value.delegateUserId) {
    toast.error("请选择接收人");
    return;
  }
  await FormDetailRef.value?.handleSubmit();
  const api =
    approveForm.value.type === "approve"
      ? approveTask
      : approveForm.value.type === "return"
      ? returnTask
      : delegateTask;
  const result = await api({
    id: runningTask.value.id as string,
    reason: approveForm.value.reason,
    targetTaskDefinitionKey: approveForm.value.targetTaskDefinitionKey,
    delegateUserId: approveForm.value.delegateUserId
  });
  if (result) {
    toast.success("审批成功");
    globalState.fetchGlobalInfo();
    handleBack();
  }
}
async function handleSubmit(type: string) {
  showApprove.value = true;
  approveForm.value.type = type;
  returnList.value = await getTaskListByReturn(runningTask.value.id);
}

/** 加载流程实例 */
async function loadProcessInstance() {
  const data = await getApprovalDetail({ processInstanceId: processInstanceId.value });
  if (!data || !data.processInstance) {
    toast.show("查询不到审批详情信息");
    return;
  }
  processInstance.value = data.processInstance;
  todoTask.value = data.todoTask || {};
  processDefinition.value = data.processDefinition || {};
}

/** 获取流程模型视图*/
async function getProcessModelView() {
  const data = await getProcessInstanceBpmnModelView(processInstanceId.value);
  processModelView.value = data;
}

/** 加载任务列表 */
async function loadTasks() {
  tasks.value = await getTaskListByProcessInstanceId(processInstanceId.value);
}
/** 初始化 */
onLoad(async (options) => {
  // TODO @jason：通过 props id 处理；
  if (!options?.id) {
    toast.show("参数错误");
    return;
  }
  type.value = options?.type;
  processInstanceId.value = options.id;
  await Promise.all([loadProcessInstance(), loadTasks(), getProcessModelView()]);
});
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
