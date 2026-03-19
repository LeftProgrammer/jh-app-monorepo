<template>
  <view class="yd-page-container bg-#F5F5F5">
    <!-- 顶部导航栏（修复标签闭合） -->
    <wd-navbar
      title="质量检查"
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
      <wd-cell-group title="基本信息" border class="mb-16rpx">
        <wd-input
          v-model="formData.code"
          label="检查编号"
          disabled
          label-width="200rpx"
          align-right
          :readonly="disabled"
          prop="code"
          placeholder="自动生成"
        />
        <wd-picker
          v-model="formData.inspectionType"
          :columns="getStrDictOptions(DICT_TYPE.QUALITY_INSPECTION_RECORDS_INSPECTIONTYPE)"
          label="检查类型"
          align-right
          label-width="250rpx"
          :readonly="disabled"
          prop="inspectionType"
          placeholder="请选择检查类型"
        />
        <wd-picker
          v-model="formData.structure"
          :columns="getStrDictOptions(DICT_TYPE.QUALITY_INSPECTION_RECORDS_STRUCTURE)"
          label="类型"
          align-right
          label-width="250rpx"
          :readonly="disabled"
          prop="structure"
          placeholder="请选择类型"
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
        <wd-input
          v-model="formData.workArea"
          label="检查工区"
          label-width="200rpx"
          align-right
          prop="workArea"
          :readonly="disabled"
          placeholder="请输入检查工区"
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
          :columns="getStrDictOptions(DICT_TYPE.QUALITY_INSPECTION_RECORDS_INSPECTIONRESULT)"
          label="检查结果"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="inspectionResult"
          placeholder="请选择检查结果"
          @confirm="handleInspectionResultChange"
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

      <!-- 质量问题整改列表 -->
      <wd-cell-group v-if="formData.inspectionResult !== 'zc'" title="质量问题整改列表" border class="mb-16rpx">
        <view v-if="formData.detailList && formData.detailList.length > 0">
          <view v-for="(item, index) in formData.detailList" :key="item.id || index" class="list-item">
            <view class="mx-16rpx mb-16rpx rounded-8rpx bg-#fff px-19rpx py-27rpx">
              <view class="mb-12rpx flex items-center justify-between">
                <text>整改部位：</text>
                <text>{{ item.rectificationPartName || item.rectificationPart || '未选择' }}</text>
              </view>
              <view class="mb-12rpx flex items-center justify-between">
                <text>整改期限：</text>
                <text>{{ formatDate(item.rectificationDeadline, "YYYY-MM-DD") || '未选择' }}</text>
              </view>
              <view class="mb-12rpx flex items-center justify-between">
                <text>整改内容：</text>
                <text class="max-w-400rpx text-ellipsis">{{ item.rectificationContent || '未填写' }}</text>
              </view>
              <view class="mb-12rpx flex items-center justify-between">
                <text>上报人：</text>
                <text>{{ item.reporterName || '未填写' }}</text>
              </view>

              <!-- 编辑/删除按钮 -->
              <view class="mt-25rpx flex justify-end">
                <view
                  class="mr-25rpx flex items-center justify-center bg-blue px-11px text-#fff"
                  @click="openEditDialog(item, index)"
                >
                  编辑
                </view>
                <view
                  class="flex items-center justify-center bg-red px-11px text-#fff"
                  @click="handleDeleteConfirm(item, index)"
                >
                  删除
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 空状态 -->
        <view v-else class="py-30rpx text-center text-28rpx text-#999">
          暂无整改记录
        </view>

        <!-- 新增按钮 -->
        <wd-button
          class="bottom-0px left-35% right-0px flex justify-around bg-#fff py-24rpx"
          style="position: relative; z-index: 9999;"
          :round="false"
          @click="openAddDialog"
        >
          新增质量问题
        </wd-button>
      </wd-cell-group>
    </wd-form>

    <!-- 底部操作按钮 -->
    <view
      v-if="formType !== 'detail'"
      class="bottom-0px left-0px right-0px flex justify-around bg-#fff py-24rpx !position-fixed"
    >
      <wd-button v-if="formData.inspectionResult == 'zc'" plain class="w-35%" :round="false" @click="dialogClose()">
        取 消
      </wd-button>

      <wd-button
        v-if="formData.inspectionResult !== 'zc'"
        class="w-35%"
        :loading="formLoading"
        :round="false"
        @click="submitForm('-1')"
      >
        暂 存
      </wd-button>

      <wd-button
        v-if="formData.inspectionResult !== 'zc'"
        class="w-35%"
        :loading="formLoading"
        :round="false"
        @click="submitForm('1')"
      >
        发 起
      </wd-button>

      <wd-button
        v-if="formData.inspectionResult == 'zc'"
        class="w-35%"
        :loading="formLoading"
        :round="false"
        @click="submitForm('1')"
      >
        确 定
      </wd-button>
    </view>

    <!-- 原生弹窗 -->
    <view v-if="showNativePopup" class="popup-mask" @click="closeNativePopup">
      <view class="popup-content" @click.stop>
        <view class="popup-title">
          {{ dialogTitleText }}
        </view>
        <wd-form ref="dialogFormRef" :model="dialogFormData" :rules="dialogFormRules" label-width="200rpx">
          <wd-cell-group border>
            <wd-input
              v-model="dialogFormData.code"
              label="整改单号"
              align-right
              disabled
              placeholder="自动生成"
            />
            <wd-picker
              v-model="dialogFormData.rectificationPart"
              :columns="formatTreeToPickerColumns(treeData)"
              label="整改部位"
              align-right
              :readonly="disabled"
              placeholder="请选择整改部位"
              prop="rectificationPart"
            />
            <wd-datetime-picker
              v-model="dialogFormData.rectificationDeadline"
              label="整改期限"
              type="date"
              align-right
              placeholder="请选择整改期限"
              prop="rectificationDeadline"
            />
            <wd-input
              v-model="dialogFormData.workArea"
              label="详细区域"
              align-right
              placeholder="请输入详细区域"
              prop="workArea"
            />
            <wd-input
              v-model="dialogFormData.rectificationContent"
              label="整改内容"
              align-right
              placeholder="请输入整改内容"
              prop="rectificationContent"
            />
            <wd-input
              v-model="dialogFormData.rectificationSuggestions"
              label="整改建议"
              align-right
              placeholder="请输入整改建议"
              prop="rectificationSuggestions"
            />

            <wd-cell title="附件资料" label="附件资料" prop="file">
              <file-upload v-model:file-id="dialogFormData.file" :disabled="disabled" />
            </wd-cell>

            <wd-input
              v-model="dialogFormData.reporterName"
              label="上报人"
              align-right
              readonly
              prop="reporterName"
            />
            <wd-input
              v-model="dialogFormData.reporterPhone"
              label="上报人电话"
              align-right
              readonly
              prop="reporterPhone"
            />
            <wd-datetime-picker
              v-model="dialogFormData.reportDate"
              label="上报日期"
              type="date"
              align-right
              readonly
              prop="reportDate"
            />

            <jh-user-picker
              v-model="dialogFormData.user2"
              label="问题分发人"
              align-right
              :readonly="disabled"
              prop="user2"
            />
            <jh-user-picker
              v-model="dialogFormData.user3"
              label="质量整改人"
              align-right
              :readonly="disabled"
              prop="user3"
            />
            <jh-user-picker
              v-model="dialogFormData.user4"
              label="整改监理"
              align-right
              :readonly="disabled"
              prop="user4"
            />
          </wd-cell-group>
        </wd-form>
        <view class="popup-buttons">
          <wd-button plain class="btn-cancel" @click="closeNativePopup">
            取消
          </wd-button>
          <wd-button type="primary" class="btn-confirm" @click="saveDialogForm()">
            确定
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import InspectionApi from '@/api/pms/quality/inspection/records'
import { getStrDictOptions } from '@/hooks'
import { useUserStore } from '@/store'
import { deepClone, DICT_TYPE, formatDate, navigateBackPlus } from '@/utils'

defineOptions({ name: 'InspectionForm' })

// 基础Props
const props = defineProps<{
  id?: string
  type?: 'create' | 'update' | 'detail'
  inspectionOrg?: string
  defaultParams?: Record<string, any>
}>()

definePage({
  style: { navigationBarTitleText: '', navigationStyle: 'custom' },
})

// 基础变量
const toast = useToast()
const userStore = useUserStore()
const userInfo: any = computed(() => userStore.userInfo || {})
const formLoading = ref(false)
const formType = ref<'create' | 'update' | 'detail'>('create')
const formRef = ref()
const disabled = computed(() => props.type === 'detail')

// 表单数据
const formData = ref<any>({
  id: undefined,
  sysOrgCode: undefined,
  code: undefined,
  workArea: undefined,
  inspectionType: undefined,
  inspectionDate: undefined,
  inspectionResult: 'zc',
  inspector: undefined,
  reporter: undefined,
  reportingUnit: undefined,
  inspectionContent: undefined,
  inspectionBasis: undefined,
  structure: undefined,
  file: undefined,
  detailList: [],
  state: undefined,
})

// 表单校验规则
const formRules = reactive({
  workArea: [{ required: true, message: '检查工区不能为空' }],
  inspectionType: [{ required: true, message: '检查类型不能为空' }],
  inspectionDate: [{ required: true, message: '检查日期不能为空' }],
  inspectionResult: [{ required: true, message: '检查结果不能为空' }],
  inspector: [{ required: true, message: '检查人员不能为空' }],
  reporter: [{ required: true, message: '检查上报人不能为空' }],
  reportingUnit: [{ required: true, message: '检查单位不能为空' }],
  inspectionContent: [{ required: true, message: '检查内容不能为空' }],
  structure: [{ required: true, message: '状态不能为空' }],
})
// 弹窗校验规则（全部必填）
const dialogFormRules = reactive({
  rectificationPart: [{ required: true, message: '整改部位不能为空' }],
  rectificationDeadline: [{ required: true, message: '整改期限不能为空' }],
  // workArea: [{ required: true, message: "详细区域不能为空" }],
  rectificationContent: [{ required: true, message: '整改内容不能为空' }],
  // rectificationSuggestions: [{ required: true, message: "整改建议不能为空" }],
  file: [{ required: true, message: '附件资料不能为空' }],
  // reporterName: [{ required: true, message: "上报人不能为空" }],
  // reporterPhone: [{ required: true, message: "上报人电话不能为空" }],
  // reportDate: [{ required: true, message: "上报日期不能为空" }],
  user2: [{ required: true, message: '问题分发人不能为空' }],
  user3: [{ required: true, message: '质量整改人不能为空' }],
  user4: [{ required: true, message: '整改监理不能为空' }],
})
// 弹窗核心变量
const showNativePopup = ref(false)
const dialogTitleText = ref('新增质量问题')
const dialogFormRef = ref()
const editIndex = ref(-1)
const treeData = ref<any[]>([])

// 弹窗表单数据
const dialogFormData = ref<any>({
  id: '',
  sysOrgCode: userInfo.value.department || '',
  recordId: formData.value.id || '',
  code: '',
  workArea: '',
  rectificationPart: '',
  rectificationDeadline: '',
  rectificationContent: '',
  rectificationSuggestions: '',
  file: '',
  overdueStatus: '',
  rectificationStatus: '',
  status: '',
  user1: userInfo.value.id || '',
  reporterName: userInfo.value.nickname || '',
  reporterPhone: userInfo.value.phone || '',
  reporterDepart: userInfo.value.departmentName || '',
  reportDate: dayjs().format('YYYY-MM-DD'),
  user2: '',
  user3: '',
  user4: '',
  user5: userInfo.value.id || '',
})

// 树形数据格式化
// 格式化工区树形数据为 wd-picker 兼容的单列格式
function formatTreeToPickerColumns(tree: any[]) {
  const result: { label: string, value: string }[] = []
  function traverse(node: any, level: number = 0, prefix: string = '') {
    const currentLabel = `${prefix}${node.name}`
    // 如果需要只选叶子节点，可以加判断 if (!node.children || node.children.length === 0)
    result.push({ label: currentLabel, value: node.id })
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) =>
        traverse(child, level + 1, `${currentLabel} - `),
      )
    }
  }
  tree.forEach(node => traverse(node))
  return [result]
}

// 重置弹窗表单
function resetDialogForm() {
  dialogFormData.value = {
    id: '',
    sysOrgCode: userInfo.value.department || '',
    recordId: formData.value.id || '',
    code: '',
    workArea: '',
    rectificationPart: '',
    rectificationDeadline: '',
    rectificationContent: '',
    rectificationSuggestions: '',
    file: '',
    overdueStatus: '',
    rectificationStatus: '',
    status: '',
    user1: userInfo.value.id || '',
    reporterName: userInfo.value.nickname || '',
    reporterPhone: userInfo.value.phone || '',
    reporterDepart: userInfo.value.departmentName || '',
    reportDate: dayjs().format('YYYY-MM-DD'),
    user2: '',
    user3: '',
    user4: '',
    user5: userInfo.value.id || '',
  }
  dialogFormRef.value?.resetFields?.()
}

// 打开新增弹窗
function openAddDialog() {
  dialogTitleText.value = '新增质量问题'
  editIndex.value = -1
  resetDialogForm()
  showNativePopup.value = true
}

// 打开编辑弹窗（赋值当前数据）
function openEditDialog(item: any, index: number) {
  dialogTitleText.value = '编辑质量问题'
  editIndex.value = index
  dialogFormData.value = deepClone(item)
  // 日期格式兼容
  if (dialogFormData.value.reportDate) {
    dialogFormData.value.reportDate = formatDate(dialogFormData.value.reportDate, 'YYYY-MM-DD')
  }
  if (dialogFormData.value.rectificationDeadline) {
    dialogFormData.value.rectificationDeadline = formatDate(dialogFormData.value.rectificationDeadline, 'YYYY-MM-DD')
  }
  showNativePopup.value = true
}

// 关闭弹窗
function closeNativePopup() {
  showNativePopup.value = false
}

// 保存弹窗数据
async function saveDialogForm() {
  if (!dialogFormRef.value)
    return
  const { valid } = await dialogFormRef.value.validate()
  if (!valid)
    return toast.error('请完善必填项！')

  if (editIndex.value === -1) {
    formData.value.detailList.push(deepClone(dialogFormData.value))
    toast.success('新增整改项成功')
  } else {
    formData.value.detailList[editIndex.value] = deepClone(dialogFormData.value)
    toast.success('编辑整改项成功')
  }
  showNativePopup.value = false
}

// 删除确认
function handleDeleteConfirm(item: any, index: number) {
  uni.showModal({
    title: '删除确认',
    content: '确定要删除这条整改记录吗？删除后不可恢复',
    confirmColor: '#FF3333',
    success: (res) => {
      if (res.confirm) {
        handleDelete(item, index)
      }
    },
  })
}

// 删除单条数据
function handleDelete(item: any, index: number) {
  formData.value.detailList.splice(index, 1)
  toast.success('删除整改项成功')
}

// 重置表单
function resetForm() {
  formData.value = {
    id: undefined,
    sysOrgCode: undefined,
    code: undefined,
    workArea: undefined,
    inspectionType: undefined,
    inspectionDate: undefined,
    inspectionResult: 'zc',
    inspector: undefined,
    reporter: undefined,
    reportingUnit: undefined,
    inspectionContent: undefined,
    inspectionBasis: undefined,
    structure: undefined,
    file: undefined,
    detailList: [],
    state: undefined,
  }
  formRef.value?.resetFields?.()
}

// 获取详情数据
async function getInfo(id: string) {
  formLoading.value = true
  toast.loading({ msg: '加载中...', forbidClick: true })
  try {
    const res = await InspectionApi.get(id)
    formData.value = {
      ...formData.value,
      ...res,
      inspectionDate: res.inspectionDate ? new Date(res.inspectionDate).getTime() : undefined,
      detailList: res.detailList || [],
    }
  } catch (e) {
    console.error('获取详情失败：', e)
    toast.error('加载数据失败')
  } finally {
    formLoading.value = false
    toast.close()
  }
}

// 提交表单
async function submitForm(state?: string) {
  if (!formRef.value)
    return
  const { valid } = await formRef.value.validate()
  if (!valid)
    return toast.error('请完善表单信息！')

  formLoading.value = true
  toast.loading({ msg: '提交中...', forbidClick: true })
  try {
    const payload = deepClone(formData.value)
    payload.state = state
    if (payload.inspectionDate) {
      payload.inspectionDate = formatDate(payload.inspectionDate, 'YYYY-MM-DD')
    }
    if (payload.detailList && payload.detailList.length > 0) {
      payload.detailList = payload.detailList.map((item: any) => {
        if (item.rectificationDeadline) {
          item.rectificationDeadline = formatDate(item.rectificationDeadline, 'YYYY-MM-DD')
        }
        return item
      })
    }

    if (formType.value === 'create') {
      await InspectionApi.create(payload)
    } else {
      await InspectionApi.update(payload)
    }
    toast.success('提交成功')
    navigateBackPlus()
  } catch (e) {
    console.error('提交失败：', e)
    toast.error('提交失败')
  } finally {
    formLoading.value = false
    toast.close()
  }
}

// 关闭页面
const dialogClose = () => navigateBackPlus()

// 检查结果变更处理
function handleInspectionResultChange() {}

// 页面初始化
onMounted(async () => {
  formType.value = props.type || 'create'
  try {
    treeData.value = await InspectionApi.getTree(null)
  } catch (e) {
    console.error('加载树形数据失败：', e)
    toast.error('加载工区数据失败')
  }
  resetForm()
  if (props.id) {
    await getInfo(props.id)
  } else {
    formData.value.inspectionDate = new Date().getTime()
    formData.value.structure = 'yzjc'
    formData.value.inspector = userInfo.value.id
    formData.value.reporter = userInfo.value.id
  }
  if (props.defaultParams) {
    formData.value = { ...formData.value, ...props.defaultParams }
  }
})
</script>

<style lang="scss" scoped>
/* 基础样式 */
.max-w-400rpx {
  max-width: 400rpx;
}
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 列表项样式 */
.list-item {
  width: 100%;
}

/* 弹窗样式 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-content {
  width: 90%;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  max-height: 80vh;
  overflow-y: auto;
}
.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
}
.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}
.btn-cancel {
  flex: 1;
  margin-right: 10rpx;
}
.btn-confirm {
  flex: 1;
  margin-left: 10rpx;
}
</style>
