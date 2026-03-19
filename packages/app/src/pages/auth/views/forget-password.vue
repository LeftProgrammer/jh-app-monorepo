<template>
  <view class="auth-container">
    <!-- 顶部 -->
    <AuthHeader />

    <!-- 表单区域 -->
    <view class="form-container">
      <TenantPicker ref="tenantPickerRef" />
      <view class="input-item">
        <wd-icon name="phone" size="20px" color="#1890ff" />
        <wd-input
          v-model="formData.mobile"
          placeholder="请输入手机号"
          clearable
          clear-trigger="focus"
          no-border
          type="number"
          :maxlength="11"
        />
      </view>
      <CodeInput
        v-model="formData.code"
        :mobile="formData.mobile"
        :scene="23"
        :before-send="validateBeforeSend"
      />
      <view class="input-item">
        <wd-icon name="lock-on" size="20px" color="#1890ff" />
        <wd-input
          v-model="formData.password"
          placeholder="请输入新密码"
          clearable
          clear-trigger="focus"
          show-password
          no-border
        />
      </view>
      <view class="input-item">
        <wd-icon name="lock-on" size="20px" color="#1890ff" />
        <wd-input
          v-model="formData.confirmPassword"
          placeholder="请确认新密码"
          clearable
          clear-trigger="focus"
          show-password
          no-border
        />
      </view>

      <!-- 重置密码按钮 -->
      <wd-button
        block
        :loading="loading"
        type="primary"
        @click="handleResetPassword"
      >
        重置密码
      </wd-button>
      <wd-button class="mt-2" block type="info" @click="goToLogin">
        返回登录
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { isMobile } from '../../../utils'
import { getLoginPage } from '../../../config/framework'
import { smsResetPassword } from '../../../api/login'
import AuthHeader from '../components/header.vue'
import CodeInput from '../components/code-input.vue'
import TenantPicker from '../components/tenant-picker.vue'

defineOptions({
  name: 'AuthForgetPasswordPage',
})

const props = withDefaults(defineProps<{
  /** 重置密码成功后的回调，用于自定义处理 */
  onSuccess?: (data: { mobile: string; code: string; password: string }) => Promise<void> | void
  /** 跳转到登录页的回调 */
  onGoLogin?: () => void
}>(), {})

const toast = useToast()
const loading = ref(false)
const tenantPickerRef = ref<InstanceType<typeof TenantPicker>>()

const formData = reactive({
  mobile: '',
  code: '',
  password: '',
  confirmPassword: '',
})

/** 发送验证码前的校验 */
function validateBeforeSend(): boolean {
  return tenantPickerRef.value?.validate() ?? false
}

/** 重置密码处理 */
async function handleResetPassword() {
  if (!tenantPickerRef.value?.validate()) {
    return
  }
  if (!formData.mobile) {
    toast.warning('请输入手机号')
    return
  }
  if (!isMobile(formData.mobile)) {
    toast.warning('请输入正确的手机号')
    return
  }
  if (!formData.code) {
    toast.warning('请输入验证码')
    return
  }
  if (!formData.password) {
    toast.warning('请输入新密码')
    return
  }
  if (!formData.confirmPassword) {
    toast.warning('请确认新密码')
    return
  }
  if (formData.password !== formData.confirmPassword) {
    toast.warning('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    if (props.onSuccess) {
      await props.onSuccess({
        mobile: formData.mobile,
        code: formData.code,
        password: formData.password,
      })
    } else {
      // 默认行为：调用框架包的重置密码 API
      await smsResetPassword({
        mobile: formData.mobile,
        code: formData.code,
        password: formData.password,
      })
      toast.success('密码重置成功')
      setTimeout(() => {
        goToLogin()
      }, 500)
    }
  } finally {
    loading.value = false
  }
}

/** 跳转到登录页面 */
function goToLogin() {
  if (props.onGoLogin) {
    props.onGoLogin()
  } else {
    uni.navigateTo({ url: getLoginPage() })
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/auth.scss';
</style>
