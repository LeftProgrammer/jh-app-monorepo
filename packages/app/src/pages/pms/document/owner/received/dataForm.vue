<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#f5f5f5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="业主收文"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="navigateBackPlus()"
    />
    <!-- 详情内容 -->
    <wd-form ref="formRef" :model="formData" :rules="formRules">
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
          v-model="formData.sendType"
          :columns="sendTypeOptions"
          label="来文类型"
          label-width="200rpx"
          prop="sendType"
          :readonly="disabled"
          placeholder="请选择来文类型"
        />

        <wd-picker
          v-model="formData.type"
          :columns="fileTypeOptions"
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

        <!-- 正文附件（你 PC rules 里有 file，这里补上） -->
        <wd-cell title="正文附件" title-width="100px" prop="file">
          <file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>

        <wd-cell title="其他附件" title-width="100px" prop="otherFile">
          <file-upload v-model:file-id="formData.otherFile" :disabled="disabled" />
        </wd-cell>

        <UnitPicker
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
        <UserPicker
          v-model="formData.user1"
          :readonly="disabled"
          label="项目经理/常务副经理"
          label-width="140px"
          prop="user1"
        />
        <UserPicker
          v-model="formData.user2"
          :readonly="disabled"
          label="拟办"
          label-width="140px"
          prop="user2"
        />
        <UserPicker
          v-model="formData.user3"
          :readonly="disabled"
          multiple
          label="分管领导审批"
          label-width="140px"
          prop="user3"
        />
      </wd-cell-group>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from "wot-design-uni";
import * as ReceivedApi from "@/api/pms/document/received";
import UserPicker from "@/components/system-select/user-picker.vue";
import UnitPicker from "@/components/system-select/unit-picker.vue";
import { DICT_TYPE } from "@/utils/constants";
import { useUserStore } from "@/store";
import { formatDate } from "@/utils/date";
import { useGlobalState } from "@/store/global";
import { navigateBackPlus } from "@/utils";
defineOptions({ name: "DocumentReceivedCreateWd" });
const props = defineProps<{
  id?: string;
  type: string;
  flowInfo: any;
  embedded?: boolean; // 是否作为嵌入组件使用（非路由访问）
  todoTask?: any; //当前办理人
}>();
definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const disabled = computed(() => props.type === "detail" || props.embedded);

const toast = useToast();
const globalState = useGlobalState();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});
const formRef = ref();

type UploadItem = any;

// 兜底，防止传给 wd-upload 的不是数组导致 val.map 报错

const normalize01 = (v: any) => (v === 1 || v === "1" || v === true ? 1 : 0);

/** 表单数据：注意 upload 字段必须是数组 */
const formData = ref<any>({
  id: "",
  name: "",
  code: "",
  sendType: props.flowInfo?.defaultParams?.treeSelectedValue || undefined,
  type: undefined as string | undefined,
  remark: "",

  isReview: 1,
  isSeal: 0,

  // wd-upload 必须数组
  file: [] as UploadItem[],
  otherFile: [] as UploadItem[],
  sealFile: [] as UploadItem[],

  receivingUnit: "",

  user1: "",
  user2: "",
  user3: "",

  sendUserName: userInfo.value.nickname,
  sendUser: userInfo.value.id,
  sendDate: formatDate(new Date()),
  sendUnit: userInfo.value.department,
  sendUnitName: userInfo.value.deptName
});

/** 校验规则（wot 的写法无需 trigger） */
const formRules = {
  name: [{ required: true, message: "文件名称不能为空" }],
  code: [{ required: true, message: "文件编号不能为空" }],
  sendType: [{ required: true, message: "来文类型不能为空" }],
  type: [{ required: true, message: "文件类型不能为空" }],
  file: [{ required: true, message: "正文附件不能为空" }],
  receivingUnit: [{ required: true, message: "收文单位不能为空" }],
  user1: [{ required: true, message: "项目经理/常务副经理不能为空" }],
  user2: [{ required: true, message: "拟办不能为空" }],
  user3: [{ required: true, message: "分管领导审批不能为空" }]
};
const menuType = ref("");
onLoad((options) => {
  menuType.value = options.menuType;
});
/** 获取来文类型 options（修复你 PC 代码里 filter 不生效的问题） */
const sendTypeOptions = computed(() => {
  const list = getIntDictOptions(DICT_TYPE.RECEIVED_TYPE);
  if (menuType.value) {
    if (menuType.value != 1) {
      return list.filter((item) => String(item.value) === "0");
    }
    return list.filter((item) => String(item.value) !== String(menuType.value));
  }
  return list;
});

/** 文件类型字典随 sendType 变化 */
const fileTypeDictType = computed(() => {
  const st = String(formData.value.sendType ?? "");
  const map: Record<string, string> = {
    "0": DICT_TYPE.SJ_SEND_DOCUMENT_TYPE,
    "1": DICT_TYPE.LHT_SEND_DOCUMENT_TYPE,
    "2": DICT_TYPE.YZ_SEND_DOCUMENT_TYPE,
    "3": DICT_TYPE.JL_SEND_DOCUMENT_TYPE,
    "4": DICT_TYPE.SG_SEND_DOCUMENT_TYPE,
    "5": DICT_TYPE.SHEJI_SEND_DOCUMENT_TYPE
  };
  return map[st] ?? DICT_TYPE.LHT_SEND_DOCUMENT_TYPE;
});
const fileTypeOptions = computed(() => getIntDictOptions(fileTypeDictType.value));

watch(
  () => formData.value.sendType,
  () => {
    const curType = formData.value.type;
    if (curType == null || curType === "") return;
    const exists = fileTypeOptions.value.some(
      (o: any) => String(o.value) === String(curType)
    );
    if (!exists) formData.value.type = undefined;
  }
);

/** 详情回显：把 "id,id" 转为 upload fileList 数组 */
async function getInfo() {
  if (!props.id) return;
  toast.loading("加载中...");
  try {
    const detail: any = await ReceivedApi.get(props.id);

    formData.value = {
      ...formData.value,
      ...detail,
      id: detail?.id ?? props.id,
      type: detail?.type != null ? String(detail.type) : undefined,
      sendDate:
        detail?.sendDate != null ? formatDate(detail.sendDate) : formData.value.sendDate,
      isReview: normalize01(detail?.isReview),
      isSeal: normalize01(detail?.isSeal)
    };
  } finally {
    toast.close();
  }
}

/** 对外暴露：提交（保持你原来的 FlowDialog 调用风格） */
async function handleSubmit(status?: number) {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  toast.loading("提交中...");
  try {
    const data: any = {
      ...formData.value,
      id: formData.value.id || props.id || undefined,
      type: formData.value.type,
      sendDate: formatDate(formData.value.sendDate),
      sendUnit: userInfo.value.department,
      menuType: "2",
      status
    };

    await ReceivedApi.create(data);
    toast.success(props.type === "update" ? "修改成功" : "发起成功");
    globalState.fetchGlobalInfo();
    if (!props.embedded) navigateBackPlus();
  } finally {
    toast.close();
  }
}

defineExpose({ formRef, handleSubmit });

onMounted(() => {
  if (props.id) getInfo();
});
</script>
