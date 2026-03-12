<template>
  <view class="yd-page-container bg-#F5F5F5">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="安全检查"
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
      :class="formType !== 'detail' ? 'pb-70px' : 'pb-0px'"
    >
      <wd-cell-group border>
        <wd-input
          v-model="formData.code"
          label="检查编号"
          label-width="200rpx"
          align-right
          :readonly="disabled"
          prop="code"
          placeholder="请输入检查编号"
        />

        <wd-picker
          v-model="formData.inspectionOrg"
          :columns="getStrDictOptions(DICT_TYPE.SAFE_QUALITY_ORG)"
          label="安全检查结构"
          align-right
          label-width="250rpx"
          :readonly="disabled"
          prop="inspectionOrg"
          placeholder="请选择安全检查结构"
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
          v-model="formData.inspectionType"
          :columns="getStrDictOptions(DICT_TYPE.INSPECTION_TYPE)"
          label="检查类型"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="inspectionType"
          placeholder="请选择检查类型"
        />

        <wd-datetime-picker
          v-model="formData.inspectionDate"
          label="检查日期"
          type="date"
          align-right
          :readonly="disabled"
          label-width="200rpx"
          prop="inspectionDate"
          placeholder="选择检查日期"
        />

        <wd-picker
          v-model="formData.inspectionResult"
          :columns="getStrDictOptions(DICT_TYPE.INSPECTION_RESULT)"
          label="检查结果"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="inspectionResult"
          placeholder="请选择检查结果"
          @confirm="handleInspectionResultChange"
        />

        <UserPicker
          v-model="formData.inspector"
          label="检查人员"
          label-width="200rpx"
          prop="inspector"
          align-right
          :readonly="disabled"
        />

        <wd-input
          v-model="formData.reporter"
          label="检查上报人"
          label-width="200rpx"
          align-right
          readonly
          prop="reporter"
          placeholder="自动带出"
        />

        <UnitPicker
          v-model="formData.reportingUnit"
          label="检查单位"
          label-width="200rpx"
          prop="reportingUnit"
          align-right
          :readonly="disabled"
          placeholder="请选择检查单位"
        />

        <wd-textarea
          v-model="formData.inspectionContent"
          label="检查内容"
          label-width="200rpx"
          :readonly="disabled"
          prop="inspectionContent"
          align-right
          placeholder="请输入检查内容"
          auto-height
          :maxlength="500"
          show-word-limit
        />

        <wd-textarea
          v-model="formData.inspectionBasis"
          label="检查依据"
          label-width="200rpx"
          :readonly="disabled"
          prop="inspectionBasis"
          align-right
          placeholder="请输入检查依据"
          auto-height
          :maxlength="500"
          show-word-limit
        />

        <wd-cell title="附件" title-width="100px" prop="file">
          <file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>
    </wd-form>

    <!-- 底部操作按钮 -->
    <view
      v-if="formType !== 'detail'"
      class="!position-fixed bg-#fff bottom-0px left-0px right-0px flex py-24rpx justify-around"
    >
      <wd-button plain class="w-35%" @click="dialogClose()" :round="false">
        取 消
      </wd-button>
      <wd-button
        class="w-35%"
        :loading="formLoading"
        @click="submitForm()"
        :round="false"
      >
        确 定
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { deepClone, DICT_TYPE, formatDate, getNavbarHeight, navigateBackPlus } from '@/utils'
import { computed, reactive, ref, onMounted } from "vue";
import { useToast } from "wot-design-uni";
; // 确保提供 deepClone
import InspectionApi from "@/api/pms/safety/safeInspection/inspection"; // 你的 API
; // 你的字典常量
import { getStrDictOptions } from "@/hooks/useDict"; // 你的字典 hook
import { useUserStore } from "@/store"; // 你的用户 store
; // 你的日期格式化工具

defineOptions({ name: "InspectionForm" });

const props = defineProps<{
  id?: string;
  type?: "create" | "update" | "detail"; // 从路由获取的类型
  inspectionOrg?: string; // 父组件（列表页）传递的树选中值
  defaultParams?: Record<string, any>; // 其他默认参数
}>();

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const toast = useToast();
const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});

const dialogTitle = ref(""); // 页面标题，根据 type 动态变化
const formLoading = ref(false);
const formType = ref<"create" | "update" | "detail">("create"); // 从 props.type 初始化

const formRef = ref();
const treeData = ref<any[]>([]); // 工区树形数据

// 统一处理 disabled 状态
const disabled = computed(() => props.type === "detail");

const formData = ref<any>({
  id: undefined,
  code: undefined,
  inspectionOrg: props.inspectionOrg || "", // 自动带入父组件的选中值
  workArea: undefined, // 检查工区 code
  inspectionType: undefined,
  inspectionDate: undefined, // 绑定时间戳
  inspectionResult: undefined,
  inspector: undefined, // 检查人员 (数组)
  reporter: userInfo.value.nickname, // 自动带出
  reportingUnit: undefined, // 检查单位 code/id
  inspectionContent: undefined,
  inspectionBasis: undefined,
  file: undefined, // 附件ID字符串
  details: [], // 隐患整改列表（数据层面保留，UI层面简化）
  state: undefined // 用于暂存/提交的状态
});

const formRules = reactive({
  code: [{ required: true, message: "检查编号不能为空" }],
  inspectionOrg: [{ required: true, message: "安全检查结构不能为空" }],
  workArea: [{ required: true, message: "检查工区不能为空" }],
  inspectionType: [{ required: true, message: "检查类型不能为空" }],
  inspectionDate: [{ required: true, message: "检查日期不能为空" }],
  inspectionResult: [{ required: true, message: "检查结果不能为空" }],
  inspector: [{ required: true, message: "检查人员不能为空" }],
  reporter: [{ required: true, message: "检查上报人不能为空" }],
  reportingUnit: [{ required: true, message: "检查单位不能为空" }],
  inspectionContent: [{ required: true, message: "检查内容不能为空" }]
});

// 计算属性，如果检查结果有值，则显示“隐患整改列表”相关内容
// 移动端简化，这里仅作为逻辑判断，不直接显示复杂表格
const showDetailTable = computed(() => {
  return !!formData.value.inspectionResult;
});

/** 检查结果改变时触发 (PC端用于控制子表显示，移动端保留逻辑) */
const handleInspectionResultChange = () => {
  if (!showDetailTable.value) {
    formData.value.details = []; // 如果不显示子表，清空details
  }
};

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

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    code: undefined,
    inspectionOrg: props.inspectionOrg ?? undefined,
    workArea: undefined,
    inspectionType: undefined,
    inspectionDate: undefined,
    inspectionResult: undefined,
    inspector: undefined, // 数组
    reporter: userInfo.value.nickname,
    reportingUnit: undefined,
    inspectionContent: undefined,
    inspectionBasis: undefined,
    file: undefined,
    details: [],
    state: undefined
  };
  formRef.value?.resetFields?.();
};

/** 获取详情数据 */
const getInfo = async (id: string) => {
  formLoading.value = true;
  toast.loading({
    msg: "加载中...",
    forbidClick: true
  });
  try {
    const res: any = await InspectionApi.get(id); // 对应 queryById
    formData.value = {
      ...formData.value,
      ...res,
      details: Array.isArray(res?.details) ? res.details : [],
      // 日期统一转时间戳
      inspectionDate: res.inspectionDate
        ? new Date(res.inspectionDate).getTime()
        : undefined
    };
  } finally {
    formLoading.value = false;
    toast.close();
  }
};

/** 提交表单 */
const submitForm = async (state?: string) => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    toast.error("请检查表单填写！");
    return;
  }

  formLoading.value = true;
  toast.loading({
    msg: "提交中...",
    forbidClick: true
  });
  try {
    const payload: any = deepClone(formData.value);
    payload.state = state; // 如果有状态字段需要提交

    // 日期格式化为后端接受的 YYYY-MM-DD
    if (payload.inspectionDate) {
      payload.inspectionDate = formatDate(payload.inspectionDate, "YYYY-MM-DD");
    }
    if (formType.value === "create") {
      await InspectionApi.create(payload);
      toast.success("新增成功");
    } else {
      await InspectionApi.update(payload);
      toast.success("更新成功");
    }

    navigateBackPlus(); // 提交成功后返回列表页
  } catch (error) {
    console.error("提交失败", error);
    toast.error("提交失败");
  } finally {
    formLoading.value = false;
    toast.close();
  }
};

/** 关闭当前页面/弹窗 */
const dialogClose = () => {
  navigateBackPlus();
  // 如果是作为 embedded 组件，则可能需要 emit 一个事件来关闭
};

/** 页面生命周期初始化 */
onMounted(async () => {
  // 1. 设置页面标题和表单类型
  formType.value = props.type || "create";
  dialogTitle.value =
    formType.value === "create"
      ? "新增安全检查"
      : formType.value === "update"
      ? "编辑安全检查"
      : "安全检查详情";

  // 2. 加载工区树数据
  toast.loading({ msg: "加载数据...", forbidClick: true });
  try {
    treeData.value = await InspectionApi.getTree(null);
  } catch (e) {
    console.error("加载工区数据失败", e);
    toast.error("加载工区数据失败");
  } finally {
    toast.close();
  }

  // 3. 重置表单，并根据 ID 获取详情
  resetForm(); // 先重置，使用默认值
  if (props.id) {
    await getInfo(props.id);
  } else {
    formData.value.inspectionDate = new Date().getTime();
  }

  // 4. 应用 defaultParams
  if (props.defaultParams) {
    formData.value = { ...formData.value, ...props.defaultParams };
  }
});
</script>

<style lang="scss" scoped></style>
