<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#F5F5F5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="隐患管理"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="navigateBackPlus()"
    />

    <!-- 表单内容 -->
    <wd-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :class="type === 'create' || type === 'update' ? 'pb-70px' : 'pb-0px'"
    >
      <!-- 基本信息 -->
      <wd-cell-group border title="基本信息" class="mb-16rpx">
        <wd-input
          v-model="formData.name"
          label="隐患名称"
          label-width="200rpx"
          align-right
          :readonly="disabled"
          prop="name"
          placeholder="请输入隐患名称"
        />
        <wd-input
          v-model="formData.code"
          label="隐患编号"
          label-width="200rpx"
          align-right
          :readonly="disabled"
          prop="code"
          placeholder="请输入隐患编号"
        />
        <wd-input
          v-model="formData.rectificationPart"
          label="整改部位"
          label-width="200rpx"
          align-right
          prop="rectificationPart"
          placeholder="请输入整改部位"
        />
        <wd-picker
          v-model="formData.dangerSource"
          :columns="getStrDictOptions(DICT_TYPE.INSPECTION_TYPE)"
          label="隐患来源"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="dangerSource"
          placeholder="请选择检查类型"
        />
        <wd-picker
          v-model="formData.workArea"
          :columns="formatTreeToPickerColumns(treeData)"
          label="检查工区"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="workArea"
          placeholder="请选择检查工区"
        />
        <wd-picker
          v-model="formData.dangerLevel"
          :columns="getStrDictOptions(DICT_TYPE.DANGER_LEVEL)"
          label="隐患级别"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="dangerLevel"
          placeholder="请选择隐患级别"
        />
        <wd-datetime-picker
          v-model="formData.rectificationDeadline"
          label="整改期限"
          type="date"
          align-right
          :default-value="new Date().getTime()"
          :readonly="disabled"
          label-width="200rpx"
          prop="rectificationDeadline"
          placeholder="请选择整改期限"
        />
        <wd-picker
          v-model="formData.sourceId"
          :columns="dangerSourceOptionsFormatted"
          label="关联危险源"
          label-width="200rpx"
          align-right
          :readonly="disabled"
          prop="sourceId"
          placeholder="请选择关联危险源"
        />
        <wd-textarea
          v-model="formData.rectificationContent"
          label="整改内容"
          label-width="200rpx"
          :readonly="disabled"
          prop="rectificationContent"
          align-right
          placeholder="请输入整改内容"
          auto-height
          :maxlength="500"
          show-word-limit
        />
        <wd-textarea
          v-model="formData.rectificationProposal"
          label="整改建议"
          label-width="200rpx"
          :readonly="disabled"
          prop="rectificationProposal"
          align-right
          placeholder="请输入整改建议"
          auto-height
          :maxlength="500"
          show-word-limit
        />
        <wd-cell title="隐患图片" title-width="200rpx" prop="dangerFiles">
          <file-upload v-model:file-id="formData.dangerFiles" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>

      <!-- 整改环节信息（根据 isRectifierShow 动态显示） -->
      <wd-cell-group border title="整改详情" class="mb-16rpx" v-if="isRectifierShow">
        <wd-textarea
          v-model="formData.rectificationMeasure"
          label="整改措施"
          label-width="200rpx"
          :readonly="!isRectifier"
          prop="rectificationMeasure"
          align-right
          placeholder="请输入整改措施"
          auto-height
          :maxlength="500"
          show-word-limit
        />
        <wd-textarea
          v-model="formData.rectificationSituation"
          label="整改情况"
          label-width="200rpx"
          :readonly="!isRectifier"
          prop="rectificationSituation"
          align-right
          placeholder="请输入整改情况"
          auto-height
          :maxlength="500"
          show-word-limit
        />
        <wd-datetime-picker
          v-model="formData.rectificationCompleteDate"
          label="整改完成时间"
          type="date"
          align-right
          :default-value="new Date().getTime()"
          :readonly="!isRectifier"
          label-width="250rpx"
          prop="rectificationCompleteDate"
          placeholder="请选择整改完成时间"
        />
        <wd-cell title="整改图片" title-width="200rpx" prop="reportFiles">
          <file-upload v-model:file-id="formData.reportFiles" :disabled="!isRectifier" />
        </wd-cell>
      </wd-cell-group>

      <!-- 上报人信息（只读） -->
      <wd-cell-group border title="上报人信息" class="mb-16rpx">
        <wd-input
          v-model="formData.reporter"
          label="上报人"
          label-width="200rpx"
          align-right
          readonly
          prop="reporter"
        />
        <wd-input
          v-model="formData.reporterPhone"
          label="上报人电话"
          label-width="200rpx"
          align-right
          readonly
          prop="reporterPhone"
        />
        <wd-datetime-picker
          v-model="formData.reportDate"
          label="上报日期"
          type="date"
          align-right
          readonly
          label-width="200rpx"
          prop="reportDate"
        />
        <wd-input
          v-model="formData.reporterDepart"
          label="上报人单位"
          label-width="200rpx"
          align-right
          readonly
          prop="reporterDepart"
        />
      </wd-cell-group>

      <!-- 审批信息 -->
      <wd-cell-group border title="审批信息">
        <UserPicker
          v-model="formData.dispatcher"
          label="隐患分发人"
          label-width="200rpx"
          prop="dispatcher"
          align-right
          :readonly="disabled"
        />
        <UserPicker
          v-model="formData.rectifier"
          label="隐患整改人"
          label-width="200rpx"
          prop="rectifier"
          align-right
          :readonly="disabled"
        />
        <UserPicker
          v-model="formData.checker"
          label="隐患复核人"
          label-width="200rpx"
          prop="checker"
          align-right
          :readonly="disabled"
        />
      </wd-cell-group>
    </wd-form>

    <!-- 底部操作按钮（非详情且非嵌入模式时显示） -->
    <view
      v-if="!embedded && type !== 'detail'"
      class="!position-fixed bg-#fff bottom-0px left-0px right-0px flex py-24rpx justify-around"
    >
      <wd-button plain :round="false" @click="handleSubmit('-1')">暂存</wd-button>
      <wd-button :round="false" @click="handleSubmit('1')">提交</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import dayjs from "dayjs";
import RectificationApi from "@/api/pms/safety/safeInspection/rectification";
import { DICT_TYPE } from "@/utils/constants";
import { navigateBackPlus, deepClone } from "@/utils/index"; // 确保提供 deepClone
import { useUserStore } from "@/store"; // 替换为你的用户 store 路径
import { formatDate } from "@/utils/date"; // 确保提供 formatDate
import { useToast, useMessage } from "wot-design-uni";

defineOptions({ name: "SafeHiddenDangerRecordsForm" });

const props = defineProps<{
  id?: string;
  embedded?: boolean; // 是否作为嵌入组件使用（非路由访问）
  type?: string; // 类型 create新增 update 修改 detail查看 todo 待办
  todoTask?: any; // 当前办理人
  flowInfo?: any; // 流程信息，可能有 taskName
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const disabled = computed(
  () => props.type === "detail" || props.type === "todo" || props.embedded
);

const toast = useToast();
const message = useMessage();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});
const formLoading = ref(false); // 移动端通常通过toast.loading来显示，所以这个可能用不上，但保留
const formRef = ref();

const TASKNAME_RECTIFI = "隐患整改";
const TASKNAME_CHECK = "隐患上报复核";

const isRectifier = ref(false); // 控制整改措施等字段的编辑权限
const isRectifierShow = ref(false); // 控制整改环节模块的显示
const dangerSourceOptions = ref<any[]>([]); // 关联危险源原始数据
const treeData = ref<any[]>([]); // 工区树形数据

// 格式化 dangerSourceOptions 为 wd-picker 兼容的格式
const dangerSourceOptionsFormatted = computed(() => {
  return [
    dangerSourceOptions.value.map((item) => ({ label: item.name, value: item.id }))
  ];
});

// 格式化工区树形数据为 wd-picker 兼容的单列格式
function formatTreeToPickerColumns(tree: any[]) {
  const result: { label: string; value: string }[] = [];
  function traverse(node: any, level: number = 0, prefix: string = "") {
    const currentLabel = `${prefix}${node.name}`;
    // 如果需要只选叶子节点，可以加判断 if (!node.children || node.children.length === 0)
    result.push({ label: currentLabel, value: node.code });
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) =>
        traverse(child, level + 1, `${currentLabel} - `)
      );
    }
  }
  tree.forEach((node) => traverse(node));
  return [result];
}

const formData = ref<any>({
  id: "",
  name: "",
  code: "",
  rectificationPart: "",
  dangerSource: "",
  workArea: "", // 绑定工区 code
  dangerLevel: "",
  rectificationDeadline: "",
  sourceId: "", // 关联危险源ID

  rectificationContent: "",
  rectificationProposal: "",
  dangerFiles: "", // 隐患图片

  rectificationMeasure: "",
  rectificationSituation: "",
  rectificationCompleteDate: "",
  reportFiles: "", // 整改图片

  reporter: userInfo.value.nickname,
  reporterPhone: userInfo.value.phone,
  reporterDepart: userInfo.value.departmentName,
  reportDate: dayjs().format("YYYY-MM-DD"), // 默认当前日期

  dispatcher: "", // 隐患分发人
  rectifier: "", // 隐患整改人
  checker: "" // 隐患复核人
});

/** 校验规则 */
const formRules = reactive({
  name: [{ required: true, message: "请输入隐患名称!" }], // trigger 在 wd-form 中不强制指定
  code: [{ required: true, message: "请输入隐患编号!" }],
  rectificationPart: [{ required: true, message: "请输入整改部位!" }],
  workArea: [{ required: true, message: "请选择检查工区!" }],
  dangerSource: [{ required: true, message: "请选择隐患来源!" }],
  dangerLevel: [{ required: true, message: "请选择隐患级别!" }],
  rectificationDeadline: [{ required: true, message: "请选择整改期限!" }],
  rectificationContent: [{ required: true, message: "请输入整改内容!" }],
  rectificationProposal: [{ required: true, message: "请输入整改建议!" }],

  dispatcher: [{ required: true, message: "请选择隐患分发人!" }],
  rectifier: [{ required: true, message: "请选择隐患整改人!" }],
  checker: [{ required: true, message: "请选择隐患复核人!" }],

  // 整改环节字段：只有当 isRectifier 为 true 时才强制校验
  rectificationMeasure: [
    {
      required: computed(() => isRectifier.value),
      message: "请输入整改措施!"
    }
  ],
  rectificationSituation: [
    {
      required: computed(() => isRectifier.value),
      message: "请输入整改情况!"
    }
  ],
  rectificationCompleteDate: [
    {
      required: computed(() => isRectifier.value),
      message: "请选择整改完成时间!"
    }
  ]
});

/** 获取详情数据 */
const getInfo = async () => {
  if (!props.id) return;
  toast.loading({
    msg: "加载中...",
    forbidClick: true
  });
  try {
    const res: any = await RectificationApi.get(props.id);
    // 适配日期格式，转换为时间戳或Date对象
    if (res.rectificationDeadline) {
      res.rectificationDeadline = dayjs(res.rectificationDeadline).valueOf();
    }
    if (res.rectificationCompleteDate) {
      res.rectificationCompleteDate = dayjs(res.rectificationCompleteDate).valueOf();
    }
    if (res.reportDate) {
      res.reportDate = dayjs(res.reportDate).valueOf();
    }
    formData.value = {
      ...formData.value, // 保留默认值
      ...res
    };
  } finally {
    toast.close();
  }
};

/** 提交表单 */
const handleSubmit = async (status: string) => {
  if (!formRef.value) return;
  try {
    const { valid } = await formRef.value.validate();
    if (!valid) {
      toast.error("请检查表单填写！");
      return;
    }

    toast.loading({
      msg: "提交中...",
      forbidClick: true
    });
    const payload = deepClone(formData.value);
    payload.status = status;

    // 格式化日期字段
    payload.rectificationDeadline = payload.rectificationDeadline
      ? formatDate(payload.rectificationDeadline, "YYYY-MM-DD")
      : "";
    payload.rectificationCompleteDate = payload.rectificationCompleteDate
      ? formatDate(payload.rectificationCompleteDate, "YYYY-MM-DD")
      : "";
    // 上报日期是只读的，通常不需要改动，但确保格式
    payload.reportDate = payload.reportDate
      ? formatDate(payload.reportDate, "YYYY-MM-DD")
      : "";

    // 如果 workArea 是数组，但后台要求字符串，需要做处理，这里假设后台接受字符串
    // if (Array.isArray(payload.workArea)) {
    //   payload.workArea = payload.workArea.join(','); // 例如逗号分隔
    // }

    if (props.type === "create") {
      await RectificationApi.create(payload);
      toast.success("新增成功");
    } else {
      await RectificationApi.update(payload);
      toast.success("修改成功");
    }
    if (!props.embedded) navigateBackPlus(); // 提交成功后返回上一页
  } catch (error) {
    console.error("提交失败", error);
    toast.error("提交失败");
  } finally {
    toast.close();
  }
};

/** 初始化 */
onMounted(async () => {
  // 1. 根据任务类型控制显示和编辑权限
  const taskName = props.todoTask?.name || props.flowInfo?.taskName;
  if (taskName === TASKNAME_RECTIFI) {
    isRectifier.value = true;
    isRectifierShow.value = true;
  }
  if (taskName === TASKNAME_CHECK) {
    isRectifierShow.value = true;
  }

  // 2. 加载字典和下拉选项
  toast.loading({ msg: "加载数据...", forbidClick: true });
  try {
    treeData.value = await RectificationApi.getTree(null);
    dangerSourceOptions.value = await RectificationApi.getDangerSourceList({});
  } catch (e) {
    console.error("加载基础数据失败", e);
    toast.error("加载基础数据失败");
  } finally {
    toast.close();
  }

  // 3. 获取详情数据（如果有ID）
  if (props.id) {
    await getInfo();
  } else {
    formData.value.reportDate = dayjs().valueOf();
  }
});

// exposed for parent component call
defineExpose({ formRef, handleSubmit });
</script>

<style lang="scss" scoped></style>
