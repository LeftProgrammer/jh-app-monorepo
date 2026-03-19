<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#f5f5f5">
    <!-- 顶部导航（路由打开才显示） -->
    <wd-navbar
      v-if="!embedded"
      title="业主发文"
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
          label="文件名称"
          label-width="200rpx"
          prop="name"
          type="text"
          :readonly="disabled"
          placeholder="请输入文件名称"
        />
        <wd-input
          v-model="formData.code"
          label="文件编号"
          label-width="200rpx"
          prop="code"
          type="text"
          :readonly="disabled"
          placeholder="请输入文件编号"
        />

        <!-- 文件类型：PC el-select -> App wd-picker -->
        <wd-picker
          v-model="formData.type"
          :columns="getIntDictOptions(DICT_TYPE.YZ_SEND_DOCUMENT_TYPE)"
          label="文件类型"
          label-width="200rpx"
          :readonly="disabled"
          prop="type"
          placeholder="请选择文件类型"
        />

        <wd-textarea
          v-model="formData.remark"
          label="备注"
          label-width="200rpx"
          :readonly="disabled"
          prop="remark"
          placeholder="请输入备注"
          auto-height
          :maxlength="500"
          show-word-limit
        />

        <!-- 附件：PC UploadFile -> App wd-upload -->
        <wd-cell title="正文附件" title-width="100px" prop="file">
          <jh-file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>

        <wd-cell title="其他附件" title-width="100px" prop="otherFile">
          <jh-file-upload v-model:file-id="formData.otherFile" :disabled="disabled" />
        </wd-cell>

        <!-- 收文单位：PC UnitSelect multiple -> App UnitPicker checkbox -->
        <jh-unit-picker
          v-model="formData.receivingUnit"
          :readonly="disabled"
          label="收文单位"
          label-width="100px"
          prop="receivingUnit"
          type="checkbox"
        />

        <wd-input
          v-model="formData.sendUserName"
          label="发起人"
          label-width="200rpx"
          readonly
          type="text"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.sendDate"
          label="发起日期"
          label-width="200rpx"
          readonly
          type="text"
          placeholder="自动带出"
        />
        <wd-input
          v-model="formData.sendUnitName"
          label="发起单位"
          label-width="140rpx"
          readonly
          type="text"
          placeholder="自动带出"
        />
      </wd-cell-group>

      <wd-cell-group border title="审批信息">
        <!-- PC 里只有 user7：文件签收 -->
        <jh-user-picker
          v-model="formData.user7"
          :readonly="disabled"
          label="文件签收"
          label-width="100px"
          prop="user7"
        />
      </wd-cell-group>
    </wd-form>

    <!-- 底部按钮：可根据你们流程决定是否显示 -->
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
import { ref, computed, onMounted } from "vue";
import { useToast } from "wot-design-uni";

; // 确保这里有 YZ_SEND_DOCUMENT_TYPE
;
;


import * as ConsortiumApi from "@/api/pms/document/posted"; // 对应 PC 的 ConsortiumApi
import { useGlobalState, useUserStore } from "@/store";

// ===== props =====
const props = defineProps<{
  id?: string | number;
  type: string; // create/update/detail/todo...
  embedded?: boolean; // 嵌入式（非路由）使用
  flowInfo?: any; // PC 示例里用到的 flowInfo
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const toast = useToast();
const formRef = ref();

const disabled = computed(() => props.type === "detail" || props.embedded);

const globalState = useGlobalState();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});

// ===== 表单数据 =====
const formData = ref<any>({
  id: "",
  name: "",
  code: "",
  type: props.flowInfo?.defaultParams?.treeSelectedValue ?? undefined,

  remark: "",
  file: undefined, // App 端用 fileList 数组承载（提交时再转 id 字符串）
  otherFile: undefined, // 同上

  receivingUnit: "",

  user7: "",

  sendUser: userInfo.value.id,
  sendUserName: userInfo.value.nickname,
  sendDate: formatDate(new Date()),
  sendUnitName: userInfo.value.deptName,
  sendType: "2"
});

// ===== 校验规则（对齐 PC）=====
const formRules = {
  name: [{ required: true, message: "文件名称不能为空" }],
  code: [{ required: true, message: "文件编号不能为空" }],
  type: [{ required: true, message: "文件类型不能为空" }],
  file: [{ required: true, message: "正文附件不能为空" }],
  receivingUnit: [{ required: true, message: "收文单位不能为空" }],
  user7: [{ required: true, message: "请选择文件签收人" }]
};

// ===== 详情 =====
async function getDetail() {
  if (!props.id) return;
  toast.loading("加载中...");
  try {
    const detail: any = await ConsortiumApi.get(props.id);
    formData.value = detail;
  } finally {
    toast.close();
  }
}

// ===== 提交（对齐 PC submitForm/create）=====
async function handleSubmit(status?: number) {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const data = deepClone(formData.value);

  data.sendDate = new Date(data.sendDate).getTime();
  data.status = status;

  await ConsortiumApi.create({
    ...data,
    id: data.id || props.id || undefined,
    sendType: "2",
    sendUnit: userInfo.value.department
  });

  uni.showToast({ title: "提交成功", icon: "success" });
  globalState.fetchGlobalInfo();
  if (!props.embedded) navigateBackPlus();
}

defineExpose({ formRef, handleSubmit });

// ===== init =====
onMounted(() => {
  if (props.id) getDetail();
});
</script>

<style lang="scss" scoped></style>
