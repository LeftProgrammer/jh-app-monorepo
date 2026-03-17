<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#f5f5f5">
    <wd-navbar
      v-if="!embedded"
      title="接待餐预定"
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
        <wd-input
          v-model="formData.name"
          label="项目名称"
          label-width="200rpx"
          align-right
          prop="name"
          :readonly="disabled"
          placeholder="请输入项目名称"
        />
        <wd-input
          v-model="formData.applicant"
          label="申请人"
          label-width="200rpx"
          align-right
          prop="applicant"
          :readonly="disabled"
          placeholder="请输入"
        />
        <wd-datetime-picker
          v-model="formData.filingDate"
          label="申请日期"
          type="date"
          align-right
          :readonly="disabled"
          label-width="200rpx"
          :min-date="new Date().getTime()"
          prop="filingDate"
          placeholder="请选择申请日期"
        />

        <wd-datetime-picker
          v-model="formData.mealTime"
          label="用餐时间"
          type="datetime"
          align-right
          :readonly="disabled"
          :default-value="[new Date().getTime(), new Date().getTime()]"
          :max-date="formData.startApplyTime"
          label-width="200rpx"
          prop="mealTime"
          placeholder="请选择"
        />
        <wd-input
          v-model="formData.reception"
          label="接待对象"
          :readonly="disabled"
          align-right
          label-width="200rpx"
        />
        <wd-cell title="人数" title-width="100px" prop="receptionNumber">
          <wd-input-number
            v-model="formData.receptionNumber"
            align-right
            :disabled="disabled"
            label-width="200rpx"
            :min="0"
            type="text"
            prop="receptionNumber"
            placeholder="请输入"
          />
        </wd-cell>
        <wd-input
          v-model="formData.receptionMatters"
          label="接待事由"
          align-right
          :readonly="disabled"
          prop="receptionMatters"
          label-width="200rpx"
        />
        <wd-input
          v-model="formData.accompanyingPerson"
          label="我方陪同人员"
          align-right
          :readonly="disabled"
          label-width="200rpx"
        />
        <wd-cell title="人数" title-width="100px" prop="accompanyingNumber">
          <wd-input-number
            v-model="formData.accompanyingNumber"
            align-right
            :disabled="disabled"
            label-width="200rpx"
            :min="0"
            prop="accompanyingNumber"
            placeholder="请输入"
          />
        </wd-cell>
        <wd-cell title="预计总预算" title-width="100px" prop="budget">
          <wd-input-number
            v-model="formData.budget"
            align-right
            :disabled="disabled"
            label-width="200rpx"
            :min="0"
            prop="budget"
            placeholder="请输入"
          />
        </wd-cell>
        <wd-input
          v-model="formData.diningRoom"
          label="建议餐厅"
          :readonly="disabled"
          align-right
          label-width="200rpx"
        />
        <wd-input
          v-model="formData.requirements"
          label="特殊要求"
          :readonly="disabled"
          align-right
          label-width="200rpx"
        />
      </wd-cell-group>

      <wd-cell-group border title="审批信息">
        <UserPicker
          v-model="formData.user1"
          :readonly="disabled"
          label="物业管理员审批"
          label-width="120px"
          prop="user1"
        />
        <UserPicker
          v-if="todoTask?.name === '物业管理审批' || formData.user2"
          v-model="formData.user2"
          :readonly="todoTask?.name != '物业管理审批' || type !== 'todo'"
          label="综合管理部审批"
          label-width="120px"
          prop="user2"
        />
      </wd-cell-group>
    </wd-form>

    <!-- 非嵌入模式下给按钮；如果你是 FlowDialog 调用 submitForm，可去掉 -->
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
import { deepClone, DICT_TYPE, formatDate, navigateBackPlus } from '@/utils'
import { ref, computed, reactive, onMounted } from "vue";
import { useToast } from "wot-design-uni";

;
import * as ConsortiumApi from "@/api/general/camp/receptionapply";
;
import { useUserStore } from "@/store";

import UserPicker from "@/components/system-select/user-picker.vue";
import UnitPicker from "@/components/system-select/unit-picker.vue";
;
import { useGlobalState } from "@/store";

defineOptions({ name: "ReceptionApplyFormCreateApp" });

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

/** 注意：App 端用 fileList 数组保存附件，提交时再转成 "id,id" */
const formData = ref<any>({
  id: "",
  mealTime: [],
  applicant: userInfo.value.nickname,
  unitId: userInfo.value.department
});

const formRules = reactive({
  name: [{ required: true, message: "请输入" }],
  filingDate: [{ required: true, message: "请选择" }],
  receptionMatters: [{ required: true, message: "请输入" }],
  user1: [{ required: true, message: "请选择" }],
  user2: [{ required: true, message: "请选择" }]
});

/** 回显 */
async function getInfo() {
  if (!props.id) return;
  toast.loading("加载中...");
  try {
    const detail: any = await ConsortiumApi.get(props.id);
    if (detail.startMealTime && detail.endMealTime) {
      detail.mealTime = [
        new Date(detail.startMealTime).getTime(),
        new Date(detail.endMealTime).getTime()
      ];
    }
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
    if (data.mealTime.length > 0) {
      data.startMealTime = formatDate(data.mealTime[0], "YYYY-MM-DD HH:mm:ss");
      data.endMealTime = formatDate(data.mealTime[1], "YYYY-MM-DD HH:mm:ss");
    }
    delete data.mealTime;
    data.filingDate = formatDate(data.filingDate);
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
  if (props.id) {
    formData.value = {
      unitId: userInfo.value.department
    };
    getInfo();
  }
});
</script>

<style lang="scss" scoped></style>
