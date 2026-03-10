<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#F5F5F5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="用印申请"
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
        <wd-input
          v-model="formData.reporter"
          label="申请人"
          label-width="200rpx"
          readonly
          align-right
          type="text"
          prop="reporter"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.reporterDepartName"
          label="用印部门"
          align-right
          readonly
          label-width="140rpx"
          type="text"
          prop="reporterDepartName"
          placeholder="请输入"
        />
        <wd-datetime-picker
          v-model="formData.useDate"
          label="用印日期"
          type="date"
          align-right
          :readonly="disabled"
          :default-value="new Date().getTime()"
          label-width="200rpx"
          prop="useDate"
          placeholder="请选择用印日期"
        />

        <wd-picker
          v-model="formData.type"
          :columns="getIntDictOptions(DICT_TYPE.SEAL_TYPE)"
          label="用印类型"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="type"
          placeholder="请选择用印类型"
        />
        <wd-cell title="数量" title-width="100px" prop="num">
          <wd-input-number
            v-model="formData.num"
            align-right
            :disabled="disabled"
            label-width="200rpx"
            :min="0"
            type="text"
            prop="num"
            placeholder="请输入"
          />
        </wd-cell>
        <wd-cell title="类别" title-width="100px" prop="category">
          <wd-radio-group
            v-model="formData.category"
            :disabled="disabled"
            inline
            shape="dot"
          >
            <wd-radio
              v-for="item in getIntDictOptions(DICT_TYPE.SEAL_CATEGORY)"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </wd-radio>
          </wd-radio-group>
        </wd-cell>
        <wd-cell title="已过发文审批" title-width="100px" prop="isPosted">
          <wd-switch
            v-model="formData.isPosted"
            :inactive-value="0"
            :active-value="1"
            :disabled="disabled"
          />
        </wd-cell>
        <wd-picker
          v-if="formData.isPosted === 1"
          v-model="formData.postedId"
          :columns="flowList"
          label="关联发文流程"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          label-key="name"
          value-key="id"
          prop="postedId"
          placeholder="请选择关联发文流程"
        />
        <wd-textarea
          v-model="formData.description"
          label="用印事由"
          label-width="200rpx"
          :readonly="disabled"
          prop="description"
          align-right
          placeholder="请输入用印事由"
          auto-height
          :maxlength="500"
          show-word-limit
        />

        <wd-cell title="盖章文件" title-width="100px" prop="file">
          <file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>
      <wd-cell-group border title="审批信息">
        <UserPicker
          v-if="formData.isPosted === 0"
          v-model="formData.user1"
          :label="formData.category === 'bmyz' ? '部门领导审核' : '项目经理审批'"
          label-width="140px"
          prop="user1"
          align-right
          :readonly="disabled"
        />
        <UserPicker
          v-if="formData.isPosted === 0"
          v-model="formData.user2"
          :label="formData.category === 'bmyz' ? '分管领导审核' : '总包分管副总审核'"
          label-width="140px"
          prop="user2"
          align-right
          :readonly="disabled"
        />

        <UserPicker
          v-if="formData.isPosted === 0"
          v-model="formData.user3"
          label-width="140px"
          :label="formData.category === 'bmyz' ? '项目经理审核' : '总包项目经理审核'"
          prop="user3"
          align-right
          :readonly="disabled"
        />
        <UserPicker
          v-model="formData.user4"
          label-width="120px"
          label="用印管理员审批"
          prop="user4"
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
import { useToast } from "wot-design-uni";
import SealDeclarationApi from "@/api/general/seal-declaration";
import { navigateBackPlus, deepClone } from "@/utils";
import { DICT_TYPE } from "@/utils/constants";
import UserPicker from "@/components/system-select/user-picker.vue";
import { formatDate } from "@/utils/date";
import { useGlobalState } from "@/store/global";
import { useUserStore } from "@/store";

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
const flowList = ref([]);
const formRules = {
  useDate: [{ required: true, message: "请选择" }],
  type: [{ required: true, message: "请选择" }],
  num: [{ required: true, message: "请输入" }],
  description: [{ required: true, message: "请输入" }],
  category: [{ required: true, message: "请选择" }],
  postedId: [{ required: true, message: "请选择" }],
  file: [{ required: true, message: "请选择" }],
  user1: [{ required: true, message: "请选择" }],
  user2: [{ required: true, message: "请选择" }],
  user3: [{ required: true, message: "请选择" }],
  user4: [{ required: true, message: "请选择" }]
};

/** 获取详情数据 */
async function getDetail() {
  try {
    toast.loading("加载中...");
    const data: any = await SealDeclarationApi.get(props.id);
    formData.value = data;
  } finally {
    toast.close();
  }
}

async function handleSubmit(status) {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  const data = deepClone(formData.value);
  data.status = status;
  data.useDate = new Date(data.useDate);
  const api = !data.id ? SealDeclarationApi.create : SealDeclarationApi.update;
  api(data).then(() => {
    uni.showToast({ title: "提交成功", icon: "success" });
    globalState.fetchGlobalInfo();
    if (!props.embedded) navigateBackPlus();
  });
}

defineExpose({ formRef, handleSubmit });
/** 初始化 */
onMounted(() => {
  SealDeclarationApi.queryAll({ status: 1, unitId: userInfo.value.department }).then(
    (res) => {
      flowList.value = res;
    }
  );
  if (!props.id) {
    formData.value = {
      reporter: userInfo.value.nickname,
      reporterDepartName: userInfo.value.departmentName,
      reporterDepart: userInfo.value.department,
      unitId: userInfo.value.department,
      unitName: userInfo.value.departmentName,
      category: "bmyz",
      isPosted: 0
    };
  } else {
    getDetail();
  }
});
</script>

<style lang="scss" scoped></style>
