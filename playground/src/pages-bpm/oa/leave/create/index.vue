<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="发起请假"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 表单内容 -->
    <wd-form ref="formRef" :model="formData" :rules="formRules">
      <wd-cell-group border title="请假信息">
        <wd-picker
          v-model="formData.type"
          :columns="getIntDictOptions(DICT_TYPE.BPM_OA_LEAVE_TYPE)"
          label="请假类型"
          label-width="200rpx"
          prop="type"
          :rules="[{ required: true, message: '请选择请假类型' }]"
          placeholder="请选择请假类型"
        />
        <wd-datetime-picker
          v-model="formData.startTime"
          label="开始时间"
          label-width="200rpx"
          prop="startTime"
          :rules="[{ required: true, message: '请选择开始时间' }]"
          placeholder="请选择开始时间"
        />
        <wd-datetime-picker
          v-model="formData.endTime"
          label="结束时间"
          label-width="200rpx"
          prop="endTime"
          :rules="[{ required: true, message: '请选择结束时间' }]"
          placeholder="请选择结束时间"
        />
        <wd-textarea
          v-model="formData.reason"
          label="请假原因"
          label-width="200rpx"
          prop="reason"
          :rules="[{ required: true, message: '请输入请假原因' }]"
          placeholder="请输入请假原因"
          :maxlength="200"
          show-word-limit
        />
      </wd-cell-group>
    </wd-form>

    <!-- TODO：@jason：流程预览卡片 -->
    <!-- 原始 vben 版本有流程节点预览和发起人选择审批人功能 -->
    <!-- 参考：yudao-ui-admin-vben-v5/apps/web-antd/src/views/bpm/oa/leave/create.vue 第 40-50 行 -->
    <!-- uniapp 端暂不实现流程节点预览，因为需要复杂的 ProcessInstanceTimeline 组件 -->

    <!-- 底部提交按钮 -->
    <view class="yd-detail-footer">
      <view class="yd-detail-footer-actions">
        <wd-button
          type="primary"
          class="flex-1"
          :loading="formLoading"
          @click="handleSubmit"
        >
          提交
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { DICT_TYPE, navigateBackPlus } from '@/utils'
import type { FormInstance } from "wot-design-uni/components/wd-form/types";
import type { Leave } from "@/api/bpm/oa/leave";
import { ref } from "vue";
import { useMessage, useToast } from "wot-design-uni";
import { createLeave } from "@/api/bpm/oa/leave";
import { getIntDictOptions } from '@/hooks'

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const toast = useToast();
const message = useMessage();
const formLoading = ref(false);
const formData = ref<Partial<Leave>>({
  type: undefined,
  startTime: undefined,
  endTime: undefined,
  reason: undefined
});
const formRules = {
  type: [{ required: true, message: "请选择请假类型" }],
  startTime: [{ required: true, message: "请选择开始时间" }],
  endTime: [{ required: true, message: "请选择结束时间" }],
  reason: [{ required: true, message: "请输入请假原因" }]
};
const formRef = ref<FormInstance>();

/** 返回上一页 */
function handleBack() {
  message
    .confirm({
      title: "提示",
      msg: "确定要返回吗？请先保存您填写的信息！"
    })
    .then(({ action }) => {
      if (action === "confirm") {
        navigateBackPlus("/pages-bpm/oa/leave/index");
      }
    });
}

/** 提交表单 */
async function handleSubmit() {
  const { valid } = await formRef.value!.validate();
  if (!valid) {
    return;
  }
  if (formData.value.startTime! >= formData.value.endTime!) {
    toast.show("结束时间必须大于开始时间");
    return;
  }

  formLoading.value = true;
  try {
    await createLeave(formData.value);
    uni.showToast({ title: "提交成功", icon: "success" });
    setTimeout(() => {
      navigateBackPlus("/pages-bpm/oa/leave/index");
    }, 1500);
  } finally {
    formLoading.value = false;
  }
}
</script>
