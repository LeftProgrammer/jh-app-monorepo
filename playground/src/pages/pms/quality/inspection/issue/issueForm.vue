<template>
  <view :class="embedded ? '' : 'yd-page-container'" class="bg-#F5F5F5">
    <!-- 顶部导航栏（仅路由访问时显示） -->
    <wd-navbar
      v-if="!embedded"
      title="质量整改"
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
          v-model="formData.code"
          label="整改单号"
          label-width="200rpx"
          align-right
          disabled
          prop="code"
          placeholder="自动生成"
        />
        <wd-picker
          v-model="formData.rectificationPart"
          :columns="formatTreeToPickerColumns(treeData)"
          label="整改部位"
          align-right
          label-width="200rpx"
          :readonly="disabled"
          prop="rectificationPart"
          placeholder="请选择整改部位"
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
        <wd-input
          v-model="formData.workArea"
          label="详细区域"
          label-width="200rpx"
          align-right
          :readonly="disabled"
          prop="workArea"
          placeholder="请输入详细区域"
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
          v-model="formData.rectificationSuggestions"
          label="整改建议"
          label-width="200rpx"
          :readonly="disabled"
          prop="rectificationSuggestions"
          align-right
          placeholder="请输入整改建议"
          auto-height
          :maxlength="500"
          show-word-limit
        />
        <wd-cell title="附件资料" title-width="200rpx" prop="file">
          <file-upload v-model:file-id="formData.file" :disabled="disabled" />
        </wd-cell>
      </wd-cell-group>

      <!-- 上报人信息（只读） -->
      <wd-cell-group border title="上报人信息" class="mb-16rpx">
        <wd-input
          v-model="formData.reporterName"
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
        <jh-user-picker
          v-model="formData.user2"
          label="问题分发人"
          label-width="200rpx"
          prop="user2"
          align-right
          :readonly="disabled"
        />
        <jh-user-picker
          v-model="formData.user3"
          label="质量整改人"
          label-width="200rpx"
          prop="user3"
          align-right
          :readonly="disabled"
        />
        <jh-user-picker
          v-model="formData.user4"
          label="整改监理"
          label-width="200rpx"
          prop="user4"
          align-right
          :readonly="disabled"
        />
      </wd-cell-group>
    </wd-form>

    <!-- 底部操作按钮（非详情且非嵌入模式时显示） -->
    <view
      v-if="!embedded && type !== 'detail'"
      class="bottom-0px left-0px right-0px flex justify-around bg-#fff py-24rpx !position-fixed"
    >
      <wd-button plain :round="false" @click="handleSubmit('-1')">
        暂存
      </wd-button>
      <wd-button :round="false" @click="handleSubmit('1')">
        提交
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useMessage, useToast } from 'wot-design-uni'
import IssueApi from '@/api/pms/quality/inspection/issue'
import { useUserStore } from '@/store' // 替换为你的用户 store 路径
import { DICT_TYPE } from '@/utils'
import { deepClone, navigateBackPlus } from '@/utils' // 确保提供 deepClone
import { formatDate } from '@/utils' // 确保提供 formatDate

defineOptions({ name: 'IssueForm' })

const props = defineProps<{
  id?: string
  embedded?: boolean // 是否作为嵌入组件使用（非路由访问）
  type?: string // 类型 create新增 update 修改 detail查看 todo 待办
  todoTask?: any // 当前办理人
  flowInfo?: any // 流程信息，可能有 taskName
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const disabled = computed(
  () => props.type === 'detail' || props.type === 'todo' || props.embedded,
)

const toast = useToast()
const message = useMessage()
const userStore = useUserStore()
const userInfo: any = computed(() => userStore.userInfo || {})
const formLoading = ref(false) // 移动端通常通过toast.loading来显示，所以这个可能用不上，但保留
const formRef = ref()
const treeData = ref<any[]>([]) // 工区树形数据

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

const formData = ref<any>({
  id: '',
  sysOrgCode: userInfo.value.department,
  recordId: '',
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
  user1: userInfo.value.id,
  reporterName: userInfo.value.nickname,
  reporterPhone: userInfo.value.phone,
  reporterDepart: userInfo.value.departmentName,
  reportDate: dayjs().format('YYYY-MM-DD'), // 默认当前日期
  user2: '',
  user3: '',
  user4: '',
  user5: userInfo.value.id,
})

/** 校验规则 */
const formRules = reactive({
  rectificationContent: [{ required: true, message: '整改内容不能为空' }],
  rectificationDeadline: [{ required: true, message: '整改期限不能为空' }],
  rectificationPart: [{ required: true, message: '请先选择树节点在新增' }],
  user2: [{ required: true, message: '问题分发人不能为空' }],
  user3: [{ required: true, message: '问题整改人不能为空' }],
  user4: [{ required: true, message: '整改监理不能为空' }],
})

/** 获取详情数据 */
async function getInfo() {
  if (!props.id)
    return
  toast.loading({
    msg: '加载中...',
    forbidClick: true,
  })
  try {
    const res: any = await IssueApi.get(props.id)
    // 适配日期格式，转换为时间戳或Date对象
    if (res.rectificationDeadline) {
      res.rectificationDeadline = dayjs(res.rectificationDeadline).valueOf()
    }
    if (res.reportDate) {
      res.reportDate = dayjs(res.reportDate).valueOf()
    }
    formData.value = {
      ...formData.value, // 保留默认值
      ...res,
    }
  } finally {
    toast.close()
  }
}

/** 提交表单 */
async function handleSubmit(status: string) {
  if (!formRef.value)
    return
  try {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      toast.error('请检查表单填写！')
      return
    }

    toast.loading({
      msg: '提交中...',
      forbidClick: true,
    })
    const payload = deepClone(formData.value)
    payload.status = status
    // 格式化日期字段
    payload.rectificationDeadline = payload.rectificationDeadline
      ? formatDate(payload.rectificationDeadline, 'YYYY-MM-DD')
      : ''
    // 上报日期是只读的，通常不需要改动，但确保格式
    payload.reportDate = payload.reportDate
      ? formatDate(payload.reportDate, 'YYYY-MM-DD')
      : ''
    // 如果 workArea 是数组，但后台要求字符串，需要做处理，这里假设后台接受字符串
    // if (Array.isArray(payload.workArea)) {
    //   payload.workArea = payload.workArea.join(','); // 例如逗号分隔
    // }
    if (props.type === 'create') {
      await IssueApi.create(payload)
      toast.success('新增成功')
    } else {
      await IssueApi.update(payload)
      toast.success('修改成功')
    }
    if (!props.embedded)
      navigateBackPlus() // 提交成功后返回上一页
  } catch (error) {
    console.error('提交失败', error)
    toast.error('提交失败')
  } finally {
    toast.close()
  }
}

/** 初始化 */
onMounted(async () => {
  // 根据审批节点处理某业务逻辑
  const taskName = props.todoTask?.name || props.flowInfo?.taskName
  switch (taskName) {
    case '问题整改':
      break
    case '上报人复核':
      break
  }
  // 加载字典和下拉选项
  toast.loading({ msg: '加载数据...', forbidClick: true })
  try {
    treeData.value = await IssueApi.getTree(null)
  } catch (e) {
    console.error('加载基础数据失败', e)
    toast.error('加载基础数据失败')
  } finally {
    toast.close()
  }

  // 3. 获取详情数据（如果有ID）
  if (props.id) {
    await getInfo()
  } else {
    formData.value.reportDate = dayjs().valueOf()
  }
})

// exposed for parent component call
defineExpose({ formRef, handleSubmit })
</script>

<style lang="scss" scoped></style>
