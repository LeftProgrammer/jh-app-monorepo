<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#F5F5F5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="请假申请"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="navigateBackPlus()"
    />
    <!-- 详情内容 -->
    <wd-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :class="type === 'create' || type === 'update' ? 'pb-70px' : 'pb-0px'"
    >
      <wd-cell-group border title="基本信息" class="mb-16rpx">
        <wd-datetime-picker
          v-model="formData.startApplyTime"
          label="开始时间"
          type="date"
          align-right
          :readonly="disabled"
          :default-value="new Date().getTime()"
          :max-date="formData.endApplyTime"
          label-width="200rpx"
          prop="startApplyTime"
          placeholder="请选择开始时间"
        />
        <wd-datetime-picker
          v-model="formData.endApplyTime"
          :min-date="formData.startApplyTime"
          label="结束时间"
          type="date"
          align-right
          :default-value="new Date().getTime()"
          :readonly="disabled"
          label-width="200rpx"
          prop="endApplyTime"
          placeholder="请选择结束时间"
        />
        <wd-input
          v-model="formData.days"
          label="请假天数"
          label-width="200rpx"
          align-right
          prop="days"
          readonly
          type="text"
          placeholder="自动计算"
        />
        <wd-picker
          v-model="formData.type"
          :columns="getIntDictOptions(DICT_TYPE.LEAVE_TYPE)"
          label="请假类别"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="type"
          placeholder="请选择请假类别"
        />
        <wd-picker
          v-model="formData.position"
          :columns="getIntDictOptions(DICT_TYPE.POSITION_TYPE)"
          label="岗位/职务"
          label-width="200rpx"
          :readonly="disabled"
          align-right
          prop="position"
          placeholder="请选择岗位/职务"
        />
        <wd-textarea
          v-model="formData.applyCause"
          label="请假事由"
          label-width="200rpx"
          :readonly="disabled"
          prop="applyCause"
          align-right
          placeholder="请输入请假事由"
          auto-height
          :maxlength="500"
          show-word-limit
        />
        <wd-input
          v-model="formData.createName"
          label="申请人"
          label-width="200rpx"
          readonly
          align-right
          type="text"
          prop="createName"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.applyDate"
          label="申请日期"
          label-width="200rpx"
          type="text"
          align-right
          readonly
          prop="applyDate"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.sysOrgCode"
          label="所属部门"
          align-right
          readonly
          label-width="140rpx"
          type="text"
          prop="sysOrgCode"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.phone"
          align-right
          label="联系电话"
          readonly
          label-width="200rpx"
          type="text"
          prop="phone"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.urgentPhone"
          label="紧急联系电话"
          :readonly="disabled"
          label-width="200rpx"
          align-right
          type="number"
          prop="urgentPhone"
          placeholder="请输入"
        />
        <wd-cell title="附件" title-width="100px" prop="file">
          <jh-file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>
      <wd-cell-group border title="审批信息">
        <UserPicker
          v-if="showUser1"
          v-model="formData.user1"
          :label="user1Label"
          label-width="200px"
          type="checkbox"
          prop="user1"
          align-right
          :readonly="disabled"
        />
        <UserPicker
          v-if="showUser2"
          v-model="formData.user2"
          :label="user2Label"
          label-width="200px"
          type="checkbox"
          prop="user2"
          align-right
          :readonly="disabled"
        />

        <UserPicker
          v-model="formData.comprehensiveManagement"
          label-width="120px"
          label="知会综合管理部"
          prop="comprehensiveManagement"
          type="checkbox"
          align-right
          :readonly="disabled"
        />
      </wd-cell-group>
    </wd-form>
    <view
      v-if="!embedded && !disabled"
      class="!position-fixed bg-#fff bottom-0px left-0px right-0px flex py-24rpx justify-around"
    >
      <wd-button plain :round="false" @click="handleSubmit(-1)">暂存</wd-button>
      <wd-button :round="false" @click="handleSubmit(1)">提交</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { deepClone, DICT_TYPE, formatDate, navigateBackPlus } from '@/utils'
import { useToast } from "wot-design-uni";
import LeaveApplyApi from "@/api/general/leaveApply";
;
;
import UserPicker from "@/components/system-select/user-picker.vue";
;
import { useUserStore } from "@/store";
import dayjs from "dayjs";
import { useGlobalState } from "@/store";

const props = defineProps<{
  id?: number | string;
  embedded?: boolean; // 是否作为嵌入组件使用（非路由访问）
  type?: string; //类型 create新增 update 修改 detail查看
  todoTask?: any; //当前办理人
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});
const disabled = computed(() => {
  return props.type === "detail" || props.embedded;
});
const globalState = useGlobalState();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});
const formRef = ref();
const toast = useToast();
const formData: any = ref({});
const formRules = {
  startApplyTime: [{ required: true, message: "请选择" }],
  endApplyTime: [{ required: true, message: "请选择" }],
  type: [{ required: true, message: "请选择" }],
  position: [{ required: true, message: "请选择" }],
  user1: [{ required: true, message: "请选择" }],
  user2: [{ required: true, message: "请选择" }],
  comprehensiveManagement: [{ required: true, message: "请选择" }]
};
watch(
  formData,
  (val) => {
    if (val.startApplyTime && val.endApplyTime) {
      formData.value.days =
        dayjs(formatDate(val.endApplyTime)).diff(formatDate(val.startApplyTime), "day") +
        1;
    }
  },
  { deep: true }
);

// 你现有的 position 值：ptyg / bmzr / ld
const approvalLabelMap: Record<string, { user1: string; user2?: string }> = {
  ptyg: { user1: "部门主任审批", user2: "分管领导审批" },
  bmzr: { user1: "分管领导审批", user2: "项目经理/常务副经理审批" },
  ld: { user1: "项目经理/常务副经理审批" } // ld 不需要 user2
};

const approvalConfig = computed(() => {
  return approvalLabelMap[formData.value.position || ""] || { user1: "审批人" };
});

const showUser1 = computed(() => !!formData.value.position); // 选了岗位才显示
const showUser2 = computed(() => !!approvalConfig.value.user2);

const user1Label = computed(() => approvalConfig.value.user1);
const user2Label = computed(() => approvalConfig.value.user2 || "");

/** 获取详情数据 */
async function getDetail() {
  try {
    toast.loading("加载中...");
    const data: any = await LeaveApplyApi.get(props.id);
    data.startApplyTime = new Date(data.startApplyTime).getTime();
    data.endApplyTime = new Date(data.endApplyTime).getTime();
    formData.value = data;
  } finally {
    toast.close();
  }
}
function fileChange(fileList, field) {
  formData.value[field] = fileList.map((x: any) => {
    x.id = JSON.parse(x.response)?.data?.id;
    return x;
  });
}
async function handleSubmit(status) {
  console.log("deepClone(formData.value)", deepClone(formData.value));
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  const data = deepClone(formData.value);
  data.status = status;
  data.startApplyTime = formatDate(data.startApplyTime, "YYYY-MM-DD HH:mm:ss");
  data.endApplyTime = formatDate(data.endApplyTime, "YYYY-MM-DD HH:mm:ss");
  const api = !data.id ? LeaveApplyApi.create : LeaveApplyApi.update;
  api(data).then(() => {
    uni.showToast({ title: "提交成功", icon: "success" });
    globalState.fetchGlobalInfo();
    if (!props.embedded) navigateBackPlus();
  });
}

defineExpose({ formRef, handleSubmit });
/** 初始化 */
onMounted(() => {
  if (!props.id) {
    formData.value = {
      createName: userInfo.value.nickname,
      phone: userInfo.value.phone,
      applyDate: formatDate(new Date()),
      sysOrgCode: userInfo.value.departmentName,
      unitId: userInfo.value.department
      // user2: [],
      // comprehensiveManagement: []
    };
  } else {
    getDetail();
  }
});
</script>

<style lang="scss" scoped></style>
