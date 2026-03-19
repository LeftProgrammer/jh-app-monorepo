<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#f5f5f5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="总包发文"
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
          v-model="formData.name"
          label="文件名称"
          label-width="200rpx"
          prop="name"
          type="text"
          :readonly="disabled"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.code"
          label="文件编号"
          label-width="200rpx"
          type="text"
          :readonly="disabled"
          prop="code"
          placeholder="请输入"
        />
        <wd-picker
          v-model="formData.type"
          :columns="getIntDictOptions(DICT_TYPE.LHT_SEND_DOCUMENT_TYPE)"
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
        <wd-cell title="正文附件" title-width="100px" prop="file">
          <jh-file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>
        <wd-cell title="其他附件" title-width="100px" prop="otherFile">
          <jh-file-upload v-model:file-id="formData.otherFile" :disabled="disabled" />
        </wd-cell>
        <UnitPicker
          v-model="formData.receivingUnit"
          label="收文单位"
          label-width="100px"
          prop="receivingUnit"
          :readonly="disabled"
          type="checkbox"
        />
        <wd-cell
          title="是否需要会审"
          title-width="100px"
          prop="isReview"
          v-if="
            (todoTask?.name && todoTask.name != '核稿人审批') || formData?.status == 2
          "
        >
          <wd-switch
            v-model="formData.isReview"
            :inactive-value="0"
            :active-value="1"
            :disabled="!(todoTask.name == '拟稿人处理' && formData?.status == 1)"
          />
        </wd-cell>
        <wd-cell title="是否用印" title-width="100px" prop="isSeal">
          <wd-switch
            v-model="formData.isSeal"
            :inactive-value="0"
            :active-value="1"
            :disabled="disabled"
          />
        </wd-cell>
        <wd-cell
          title="是否需要回文"
          title-width="100px"
          prop="isPalindrome"
          v-if="
            todoTask?.name == '文书提交' ||
            todoTask?.name == '文件签收' ||
            formData?.status == 2
          "
        >
          <wd-switch
            v-model="formData.isPalindrome"
            :inactive-value="0"
            :active-value="1"
            :disabled="todoTask?.name !== '文书提交'"
          />
        </wd-cell>

        <wd-input
          v-model="formData.sendUserName"
          label="发起人"
          label-width="200rpx"
          readonly
          type="text"
          prop="sendUserName"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.sendDate"
          label="发起日期"
          label-width="200rpx"
          type="text"
          readonly
          prop="sendDate"
          placeholder="请输入"
        />
        <wd-input
          v-model="formData.sendUnitName"
          label="发起单位"
          readonly
          label-width="140rpx"
          type="text"
          prop="sendUnitName"
          placeholder="请输入"
        />

        <wd-cell
          title="盖章文件"
          title-width="100px"
          prop="sealFile"
          v-if="
            todoTask?.name === '文书提交' ||
            todoTask?.name === '文件签收' ||
            formData?.status === 2
          "
        >
          <jh-file-upload
            v-model:file-id="formData.sealFile"
            :disabled="!(todoTask?.name === '文书提交' && formData?.status === 1)"
          />
        </wd-cell>
        <wd-cell
          v-if="
            (todoTask?.name === '文件签收' || formData?.status === 2) &&
            formData?.isPalindrome === 1
          "
          title="回文文件"
          title-width="100px"
          prop="palindromeFile"
        >
          <jh-file-upload
            v-model:file-id="formData.palindromeFile"
            :disabled="!(todoTask?.name === '文件签收' && formData?.status === 1)"
          />
        </wd-cell>
      </wd-cell-group>
      <wd-cell-group border title="审批信息">
        <UserPicker
          v-model="formData.user1"
          :readonly="disabled"
          label="核稿人审批"
          label-width="100px"
          prop="user1"
        />
        <UserPicker
          v-if="formData?.isReview == 1"
          v-model="formData.user3"
          :readonly="!(todoTask?.name == '拟稿人处理' && formData?.status == 1)"
          label="部门及领导会审"
          label-width="100px"
          prop="user3"
          type="checkbox"
        />
        <UserPicker
          v-model="formData.user2"
          :readonly="disabled"
          label="分管领导审批"
          label-width="100px"
          prop="user2"
        />
        <UserPicker
          v-model="formData.user5"
          :readonly="disabled"
          label="项目经理签发"
          label-width="100px"
          prop="user5"
        />
        <UserPicker
          v-model="formData.user6"
          :readonly="disabled"
          label="文书提交"
          label-width="100px"
          prop="user6"
        />
        <UserPicker
          v-model="formData.user7"
          :readonly="disabled"
          label="文件签收"
          label-width="100px"
          prop="user7"
          multiple
          type="checkbox"
        />
        <UserPicker
          label="回文通知人员"
          label-width="100px"
          multiple
          prop="user8"
          type="checkbox"
          v-if="
            (todoTask?.name === '文书提交' ||
              todoTask?.name === '文件签收' ||
              formData?.status === 2) &&
            formData.isPalindrome === 1
          "
          v-model="formData.user8"
          :readonly="!(todoTask?.name === '文书提交' && formData?.status === 1)"
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
import { get, PostedVO } from "@/api/pms/document/posted";
;
;
import UserPicker from "@/components/system-select/user-picker.vue";
import UnitPicker from "@/components/system-select/unit-picker.vue";
;
import { useUserStore } from "@/store";
import { useGlobalState } from "@/store";
import { create } from "@/api/pms/document/posted";

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
const formData = ref<Partial<PostedVO>>({});
const formRules = {
  name: [{ required: true, message: "请输入" }],
  code: [{ required: true, message: "请输入" }],
  type: [{ required: true, message: "请选择" }],
  file: [{ required: true, message: "请选择" }],
  sealFile: [{ required: true, message: "请选择" }],
  palindromeFile: [{ required: true, message: "请选择" }],
  isReview: [{ required: true, message: "请选择" }],
  isSeal: [{ required: true, message: "请选择" }],
  receivingUnit: [{ required: true, message: "请选择" }],
  user1: [{ required: true, message: "请选择" }],
  user2: [{ required: true, message: "请选择" }],
  user3: [{ required: true, message: "请选择" }],
  user4: [{ required: true, message: "请选择" }],
  user5: [{ required: true, message: "请选择" }],
  user6: [{ required: true, message: "请选择" }],
  user7: [{ required: true, message: "请选择" }],
  user8: [{ required: true, message: "请选择" }]
};

/** 获取详情数据 */
async function getDetail() {
  try {
    toast.loading("加载中...");
    const data: any = await get(props.id);
    data.sendDate = formatDate(data.sendDate);
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
  data.sendDate = new Date(data.sendDate).getTime();
  data.status = status;

  create(data).then(() => {
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
      sendUserName: userInfo.value.nickname,
      sendUser: userInfo.value.id,
      sendDate: formatDate(new Date()),
      sendUnitName: userInfo.value.deptName,
      sendUnit: userInfo.value.department,
      sendType: "1",
      isReview: 0,
      isSeal: 0
    };
  } else {
    getDetail();
  }
});
</script>

<style lang="scss" scoped></style>
