<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#f5f5f5">
    <wd-navbar
      v-if="!embedded"
      title="监理发文"
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
          :readonly="disabled"
          placeholder="请输入文件名称"
        />
        <wd-input
          v-model="formData.code"
          label="文件编号"
          label-width="200rpx"
          prop="code"
          :readonly="disabled"
          placeholder="请输入文件编号"
        />

        <wd-picker
          v-model="formData.type"
          :columns="getIntDictOptions(DICT_TYPE.JL_SEND_DOCUMENT_TYPE)"
          label="文件类型"
          label-width="200rpx"
          prop="type"
          :readonly="disabled"
          placeholder="请选择文件类型"
        />

        <wd-textarea
          v-model="formData.remark"
          label="备注"
          label-width="200rpx"
          prop="remark"
          :readonly="disabled"
          placeholder="请输入备注"
          auto-height
          :maxlength="500"
          show-word-limit
        />

        <wd-cell title="正文附件" title-width="100px" prop="file">
          <jh-file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>

        <wd-cell title="其他附件" title-width="100px" prop="otherFile">
          <jh-file-upload v-model:file-id="formData.otherFile" :disabled="disabled" />
        </wd-cell>

        <jh-unit-picker
          v-model="formData.receivingUnit"
          label="收文单位"
          label-width="100px"
          prop="receivingUnit"
          :readonly="disabled"
          type="checkbox"
        />

        <wd-input
          v-model="formData.sendUserName"
          label="发起人"
          label-width="200rpx"
          readonly
        />
        <wd-input
          v-model="formData.sendDate"
          label="发起日期"
          label-width="200rpx"
          readonly
        />
        <wd-input
          v-model="formData.sendUnitName"
          label="发起单位"
          label-width="140rpx"
          readonly
        />
      </wd-cell-group>

      <wd-cell-group border title="审批信息">
        <jh-user-picker
          v-model="formData.user7"
          :readonly="disabled"
          label="文件签收"
          label-width="100px"
          prop="user7"
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
import * as ConsortiumApi from "@/api/pms/document/posted";
;
import { useUserStore } from "@/store";


defineOptions({ name: "DocumentSupervisionPostedCreateApp" });

const props = defineProps<{
  id?: string | number;
  type: string; // create/update/detail/todo...
  flowInfo?: any;
  embedded?: boolean;
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const toast = useToast();
const formRef = ref<any>();

const disabled = computed(() => props.type === "detail" || props.embedded);

const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});

/** 注意：App 端用 fileList 数组保存附件，提交时再转成 "id,id" */
const formData = ref<any>({
  id: "",
  name: "",
  code: "",
  type: props.flowInfo?.defaultParams?.treeSelectedValue ?? undefined,

  remark: "",
  file: undefined, // fileList
  otherFile: undefined, // fileList

  receivingUnit: "",
  ccUnit: "",
  notificationMethod: "0",

  user7: "",
  user8: "",

  sendUser: userInfo.value.id,
  sendUserName: userInfo.value.nickname,
  sendDate: formatDate(new Date()),
  sendUnitName: userInfo.value.deptName,
  sendUnit: userInfo.value.deptId,

  currentNode: ""
});

const formRules = reactive({
  name: [{ required: true, message: "文件名称不能为空" }],
  code: [{ required: true, message: "文件编号不能为空" }],
  type: [{ required: true, message: "文件类型不能为空" }],
  file: [{ required: true, message: "正文附件不能为空" }],
  receivingUnit: [{ required: true, message: "收文单位不能为空" }],
  user7: [{ required: true, message: "请选择文件签收人" }]
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

    // 关键：监理发文 sendType=3
    data.sendType = "3";
    data.sendDate = new Date(data.sendDate).getTime();
    data.id = data.id || props.id || undefined;
    data.status = status;
    data.sendUnit = userInfo.value.department;

    await ConsortiumApi.create(data);

    uni.showToast({ title: "发起成功", icon: "success" });
    if (!props.embedded) navigateBackPlus();
  } finally {
    toast.close();
  }
}

defineExpose({ handleSubmit });

onMounted(() => {
  if (props.id) getInfo();
});
</script>

<style lang="scss" scoped></style>
