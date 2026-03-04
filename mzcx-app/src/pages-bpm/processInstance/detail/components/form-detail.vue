<!-- 表单详情：流程表单/业务表单 -->
<template>
  <view class="overflow-hidden bg-white">
    <!-- 标题 -->
    <!-- <view class="px-24rpx pt-24rpx text-28rpx text-[#333] font-bold"> 审批详情 </view> -->
    <!-- 表单内容：业务表单 -->
    <template v-if="processDefinition?.formType === BpmModelFormType.CUSTOM">
      <!-- OA 请假详情 -->
      <!-- <LeaveDetail
        v-if="processDefinition?.formCustomViewPath === '/bpm/oa/leave/detail'"
        :id="processInstance?.businessKey"
        embedded
      /> -->
      <!-- 未配置的业务表单 -->
      <!-- <view v-else class="px-24rpx py-32rpx text-26rpx text-[#999]">
        暂不支持该业务表单，请参考 LeaveDetail 配置
      </view> -->

      <BusinessFormComponent
        ref="BusinessFormComponentRef"
        :id="processInstance?.businessKey"
        :todoTask="todoTask"
        :type="type"
        embedded
      />
    </template>
    <!-- TODO @jason：表单内容：流程表单 -->
    <template v-else-if="processDefinition?.formType === BpmModelFormType.NORMAL">
      <view class="px-24rpx py-32rpx text-26rpx text-[#999]">
        流程表单仅 PC 端支持预览
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import type { ProcessDefinition, ProcessInstance } from "@/api/bpm/processInstance";
// 特殊：业务表单组件（uniapp 小程序不支持动态组件，需要静态导入）
import ReceptionApplyForm from "@/pages/general/camp/receptionapply/ReceptionApplyForm.vue";
import leaveApplyForm from "@/pages/general/leaveApply/dataForm.vue";
import SealDeclarationForm from "@/pages/general/sealdeclaration/SealDeclarationForm.vue";
import meetForm from "@/pages/general/meeting/subscribe/SubscribeForm.vue";
import consortiumReceivedDataForm from "@/pages/pms/document/consortium/received/dataForm.vue";
import consortiumPostedDataForm from "@/pages/pms/document/consortium/posted/dataForm.vue";
import constructionPostedDataForm from "@/pages/pms/document/construction/posted/dataForm.vue";
import ownerPostedDataForm from "@/pages/pms/document/owner/posted/dataForm.vue";
import supervisionPostedDataForm from "@/pages/pms/document/supervision/posted/dataForm.vue";
import rectificationDataForm from "@/pages/pms/safety/safeInspection/rectification/dataForm.vue";
import { BpmModelFormType } from "@/utils/constants";
import { registerComponent } from "@/utils/routerHelper";

const props = defineProps<{
  /** 流程定义 */
  processDefinition?: ProcessDefinition;
  /** 流程实例 */
  processInstance?: ProcessInstance;
  todoTask?: any;
  // todo my done copy
  type?: string;
}>();
const BusinessFormComponent = computed(() => {
  const componentPath = props.processDefinition?.formCustomCreatePath;
  console.log("🚀 ~ componentPath:", componentPath);
  let component;
  // #ifdef H5
  component = registerComponent(componentPath);
  // #endif

  // #ifndef H5
  const modules = {
    "/general/camp/receptionapply/ReceptionApplyForm": ReceptionApplyForm,
    "/general/sealdeclaration/SealDeclarationForm": SealDeclarationForm,
    "/general/leaveApply/dataForm": leaveApplyForm,
    "/general/meeting/subscribe/SubscribeForm": meetForm,
    "/pms/document/consortium/posted/dataForm": consortiumPostedDataForm,
    "/pms/document/consortium/received/dataForm": consortiumReceivedDataForm,
    "/pms/document/supervision/posted/dataForm": supervisionPostedDataForm,
    "/pms/document/construction/posted/dataForm": constructionPostedDataForm,
    "/pms/document/owner/posted/dataForm": ownerPostedDataForm,
    "/pms/safety/safeInspection/rectification/dataForm": rectificationDataForm
  };
  component = modules[componentPath];
  // #endif
  return component;
});
const BusinessFormComponentRef = ref<any>();
defineExpose({
  /** 祖父层调用：bRef.value?.formRef?.validate() */
  get formRef() {
    return BusinessFormComponentRef.value?.formRef;
  },
  get beforeSubmit() {
    return BusinessFormComponentRef.value?.beforeSubmit;
  },
  get handleSubmit() {
    return BusinessFormComponentRef.value?.handleSubmit;
  }
});
</script>
