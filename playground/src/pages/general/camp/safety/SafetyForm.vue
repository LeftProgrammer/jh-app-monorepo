<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#f5f5f5">
    <wd-navbar
      v-if="!embedded"
      title="营地安全"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="navigateBackPlus()"
    />
    <wd-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :class="type === 'create' || type === 'update' ? 'pb-70px' : 'pb-0px'"
    >
      <wd-cell-group border title="基本信息" class="mb-16rpx">
        <wd-datetime-picker
          v-model="formData.checkDate"
          label="检查日期"
          type="date"
          align-right
          :readonly="disabled"
          label-width="200rpx"
          :min-date="new Date().getTime()"
          prop="checkDate"
          placeholder="请选择"
        />
        <wd-input
          v-model="formData.location"
          label="隐患位置"
          label-width="200rpx"
          align-right
          prop="location"
          :readonly="disabled"
          placeholder="请输入隐患位置"
        />
        <wd-input
          v-model="formData.description"
          label="隐患描述"
          label-width="200rpx"
          align-right
          prop="description"
          :readonly="disabled"
          placeholder="请输入"
        />
        <wd-datetime-picker
          v-model="formData.planRectificationTime"
          label="计划整改时间"
          type="date"
          align-right
          :readonly="disabled"
          label-width="220rpx"
          :min-date="new Date().getTime()"
          prop="planRectificationTime"
          placeholder="请选择"
        />
        <wd-input
          v-if="formData.id"
          v-model="formData.measure"
          label="整改措施"
          label-width="200rpx"
          align-right
          prop="measure"
          :readonly="todoTask.name !== '问题整改'"
          placeholder="请输入"
        />
        <wd-datetime-picker
          v-if="formData.id"
          v-model="formData.actualCompletionTime"
          label="实际整改时间"
          type="date"
          align-right
          :readonly="todoTask.name !== '问题整改'"
          label-width="200rpx"
          :min-date="new Date().getTime()"
          prop="actualCompletionTime"
          placeholder="请选择实际整改时间"
        />
        <wd-input
          v-model="formData.reporter"
          label="问题上报人"
          readonly
          align-right
          label-width="200rpx"
        />
        <wd-input
          v-model="formData.reporterPhone"
          label="联系方式"
          readonly
          align-right
          label-width="200rpx"
        />
        <wd-cell title="图片上传" title-width="100px" prop="file">
          <file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>

      <wd-cell-group border title="审批信息">
        <UserPicker
          v-model="formData.user1"
          :readonly="disabled"
          label="整改负责人"
          label-width="120px"
          prop="user1"
        />
        <UserPicker
          v-model="formData.user2"
          label="上报人验收"
          disabled
          label-width="120px"
          prop="user2"
        />
        <UserPicker
          v-if="todoTask?.name !== '问题整改' && formData.id"
          v-model="formData.user3"
          :readonly="todoTask?.name !== '上报人验收'"
          label="知会安全环保部"
          label-width="120px"
          prop="user3"
        />
      </wd-cell-group>
    </wd-form>
    <view
      v-if="!embedded && !disabled"
      class="!position-fixed bg-#fff bottom-0px left-0px right-0px flex py-24rpx justify-around"
    >
      <wd-button plain :round="false" @click="handleSubmit(-1)"> 暂存 </wd-button>
      <wd-button :round="false" @click="handleSubmit(1)"> 提交 </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { deepClone, formatDate, navigateBackPlus } from '@/utils'
import { ref, computed, reactive, onMounted } from "vue";
import { useToast } from "wot-design-uni";
import * as ConsortiumApi from "@/api/general/camp/safety";
;
import { useUserStore } from "@/store";

import UserPicker from "@/components/system-select/user-picker.vue";
;
import { useGlobalState } from "@/store";

defineOptions({ name: "safetyFormCreateApp" });

const props = defineProps<{
  id?: string | number;
  type: string; // create/update/detail/todo...
  flowInfo?: any;
  todoTask?: any; //当前办理人
  embedded?: boolean;
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const globalState = useGlobalState();
const toast = useToast();
const formRef = ref<any>();

const disabled = computed(() => props.type === "detail" || props.embedded);

const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});

const formData = ref<any>({
  id: "",
  unitId: userInfo.value.department
});

const formRules = reactive({
  checkDate: [{ required: true, message: "请选择" }],
  location: [{ required: true, message: "请输入" }],
  description: [{ required: true, message: "请输入" }],
  planRectificationTime: [{ required: true, message: "请选择" }],
  user1: [{ required: true, message: "请选择" }],
  user3: [{ required: true, message: "请选择" }]
});

/** 回显 */
async function getInfo() {
  if (!props.id) return;
  toast.loading("加载中...");
  try {
    const detail: any = await ConsortiumApi.get(props.id);
    formData.value = detail;
  } finally {
    toast.close();
  }
}

/**
 * FlowDialog/页面按钮：提交
 * status：-1 暂存 / 1 提交（按你们后端约定）
 */
async function handleSubmit(status?: number) {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  toast.loading("提交中...");
  try {
    const data: any = deepClone(formData.value);
    data.checkDate = formatDate(data.checkDate);
    data.planRectificationTime = formatDate(data.planRectificationTime);
    if (data.actualCompletionTime)
      data.actualCompletionTime = formatDate(data.actualCompletionTime);
    data.status = status;
    const api = !data.id ? ConsortiumApi.create : ConsortiumApi.update;
    await api(data);
    uni.showToast({ title: "提交成功", icon: "success" });
    globalState.fetchGlobalInfo();
    if (!props.embedded) navigateBackPlus();
  } finally {
    toast.close();
  }
}

defineExpose({ formRef, handleSubmit });

onMounted(() => {
  if (!props.id) {
    formData.value = {
      unitId: userInfo.value.department,
      reporter: userInfo.value.nickname,
      reporterPhone: userInfo.value.phone,
      user2: String(userInfo.value.id)
    };
  } else {
    getInfo();
  }
});
</script>

<style lang="scss" scoped></style>
