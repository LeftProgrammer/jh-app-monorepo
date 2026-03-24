<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="意见反馈"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 表单区域 -->
    <view class="p-24rpx">
      <wd-form ref="formRef" :model="formData" :rules="formRules">
        <wd-cell-group custom-class="cell-group" border>
          <wd-textarea
            v-model="formData.content"
            label="反馈内容"
            label-width="180rpx"
            prop="content"
            placeholder="请输入您的宝贵意见和建议"
            :maxlength="500"
            show-word-limit
            clearable
            :rows="5"
          />
          <wd-cell title="反馈图片" title-width="180rpx" />
          <view class="px-24rpx pb-24rpx">
            <wd-upload
              v-model:file-list="fileList"
              :upload-method="customUpload"
              multiple
              :limit="9"
            />
          </view>
        </wd-cell-group>
      </wd-form>
    </view>

    <!-- 底部提交按钮 -->
    <view class="yd-detail-footer">
      <wd-button type="primary" block :loading="formLoading" @click="handleSubmit">
        提交反馈
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import type { UploadFile, UploadMethod } from 'wot-design-uni/components/wd-upload/types'
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { getBaseUrl } from '../../../config'

defineOptions({
  name: 'UserFeedbackPage',
})

const props = withDefaults(defineProps<{
  /** 返回页面路径 */
  backUrl?: string
  /** 提交反馈的函数 */
  onSubmit?: (data: { content: string; images: string[] }) => Promise<void>
}>(), {
  backUrl: '',
})

const toast = useToast()
const formLoading = ref(false)
const fileList = ref<UploadFile[]>([])
const formData = ref({
  content: '',
})
const formRules = {
  content: [
    { required: true, message: '请输入反馈内容' },
    {
      required: true,
      validator: (value: string) => value.length >= 10,
      message: '反馈内容至少10个字符',
    },
  ],
}
const formRef = ref<FormInstance>()

function handleBack() {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl })
  } else {
    uni.navigateBack()
  }
}

const customUpload: UploadMethod = (file, formData, options) => {
  const uploadTask = uni.uploadFile({
    url: `${getBaseUrl()}/infra/file/upload`,
    header: {
      ...options.header,
    },
    name: options.name,
    fileType: options.fileType,
    formData,
    filePath: file.url,
    success(res) {
      if (res.statusCode === options.statusCode) {
        options.onSuccess(res, file, formData)
      } else {
        options.onError({ ...res, errMsg: res.errMsg || '' }, file, formData)
      }
    },
    fail(err) {
      options.onError(err, file, formData)
    },
  })
  uploadTask.onProgressUpdate((res) => {
    options.onProgress(res, file)
  })
}

async function handleSubmit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) {
    return
  }

  formLoading.value = true
  try {
    const submitData = {
      content: formData.value.content,
      images: fileList.value
        .filter(file => file.status === 'success')
        .map((file) => {
          if (file.response) {
            try {
              const res = typeof file.response === 'string'
                ? JSON.parse(file.response)
                : file.response
              return res.data || file.url
            } catch {
              return file.url
            }
          }
          return file.url
        }),
    }

    if (props.onSubmit) {
      await props.onSubmit(submitData)
      toast.success('提交成功，感谢您的反馈！')
    } else {
      // 未配置提交函数时，仅提示（实际项目应配置 onSubmit）
      console.warn('[UserFeedbackPage] 未配置 onSubmit 函数，反馈数据:', submitData)
      toast.success('提交成功，感谢您的反馈！')
    }
    setTimeout(() => {
      handleBack()
    }, 1500)
  } finally {
    formLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
:deep(.cell-group) {
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 8rpx rgba(24, 144, 255, 0.06);
}

.safe-area-inset-bottom {
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
</style>
