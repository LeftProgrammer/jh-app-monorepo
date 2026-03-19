<template>
  <view class="auth-container">
    <!-- 顶部 -->
    <AuthHeader />

    <!-- 表单区域 -->
    <view class="form-container">
      <TenantPicker ref="tenantPickerRef" />
      <view class="input-item">
        <wd-icon name="user" size="20px" color="#1890ff" />
        <wd-input
          v-model="formData.username"
          placeholder="请输入用户名"
          clearable
          clear-trigger="focus"
          no-border
        />
      </view>
      <view class="input-item">
        <wd-icon name="person" size="20px" color="#1890ff" />
        <wd-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          clearable
          clear-trigger="focus"
          no-border
        />
      </view>
      <view class="input-item">
        <wd-icon name="lock-on" size="20px" color="#1890ff" />
        <wd-input
          v-model="formData.password"
          placeholder="请输入密码"
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
          placeholder="请确认密码"
          clearable
          clear-trigger="focus"
          show-password
          no-border
        />
      </view>
      <view v-if="internalCaptchaEnabled">
        <Verify
          ref="verifyRef"
          :captcha-type="captchaType"
          explain="向右滑动完成验证"
          :img-size="{ width: '300px', height: '150px' }"
          mode="pop"
          @success="verifySuccess"
        />
      </view>

      <!-- 用户协议 -->
      <view class="mb-24rpx flex items-center">
        <wd-checkbox v-model="agreePolicy" shape="square" />
        <text class="text-24rpx text-[#666]">我已阅读并同意</text>
        <text class="text-24rpx text-[#1890ff]" @click="goToUserAgreement">
          《用户协议》
        </text>
        <text class="text-24rpx text-[#666]">与</text>
        <text class="text-24rpx text-[#1890ff]" @click="goToPrivacyPolicy">
          《隐私政策》
        </text>
      </view>

      <!-- 注册按钮 -->
      <wd-button
        block
        :loading="loading"
        type="primary"
        @click="handleRegister"
      >
        注册
      </wd-button>

      <!-- 已有账号 -->
      <view class="mt-40rpx flex items-center justify-center">
        <text class="text-28rpx text-[#666]">已有账号？</text>
        <text class="text-28rpx text-[#1890ff]" @click="goToLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { redirectAfterLogin } from '../../../utils'
import { getLoginPage } from '../../../config/framework'
import { useTokenStore } from '../../../store'
import AuthHeader from '../components/header.vue'
import TenantPicker from '../components/tenant-picker.vue'
import Verify from '../components/verifition/verify.vue'

defineOptions({
  name: 'AuthRegisterPage',
})

const props = withDefaults(defineProps<{
  /** 验证码开关 */
  captchaEnabled?: boolean
  /** 注册成功后的回调，用于自定义处理 */
  onSuccess?: (data: { username: string; nickname: string; password: string }) => Promise<void> | void
  /** 跳转到登录页的回调 */
  onGoLogin?: () => void
  /** 跳转到用户协议的回调 */
  onGoUserAgreement?: () => void
  /** 跳转到隐私政策的回调 */
  onGoPrivacyPolicy?: () => void
  /** 用户协议页面路径 */
  userAgreementPage?: string
  /** 隐私政策页面路径 */
  privacyPolicyPage?: string
}>(), {
  captchaEnabled: undefined,
  userAgreementPage: '/pages-core/user/settings/agreement/index',
  privacyPolicyPage: '/pages-core/user/settings/privacy/index',
})

const toast = useToast()
const tokenStore = useTokenStore()
const loading = ref(false)
const agreePolicy = ref(false)
const tenantPickerRef = ref<InstanceType<typeof TenantPicker>>()
const verifyRef = ref()
const captchaType = ref('blockPuzzle')

const internalCaptchaEnabled = props.captchaEnabled ?? false

const formData = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  captchaVerification: '',
})

/** 获取验证码 */
async function getCode() {
  if (!internalCaptchaEnabled) {
    await verifySuccess({})
  } else {
    verifyRef.value.show()
  }
}

/** 注册处理 */
async function handleRegister() {
  if (!tenantPickerRef.value?.validate()) {
    return
  }
  if (!agreePolicy.value) {
    toast.warning('请阅读并同意《用户协议》与《隐私政策》')
    return
  }
  if (!formData.username) {
    toast.warning('请输入用户名')
    return
  }
  if (!formData.nickname) {
    toast.warning('请输入昵称')
    return
  }
  if (!formData.password) {
    toast.warning('请输入密码')
    return
  }
  if (!formData.confirmPassword) {
    toast.warning('请确认密码')
    return
  }
  if (formData.password !== formData.confirmPassword) {
    toast.warning('两次输入的密码不一致')
    return
  }
  await getCode()
}

/** 验证码验证成功回调 */
async function verifySuccess(params: any) {
  loading.value = true
  try {
    formData.captchaVerification = params.captchaVerification
    
    if (props.onSuccess) {
      await props.onSuccess({
        username: formData.username,
        nickname: formData.nickname,
        password: formData.password,
      })
    } else {
      // 默认行为：调用框架包的注册 API
      await tokenStore.login({
        type: 'register',
        username: formData.username,
        nickname: formData.nickname,
        password: formData.password,
        captchaVerification: formData.captchaVerification,
      })
      toast.success('注册成功')
      redirectAfterLogin()
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

/** 跳转到用户协议 */
function goToUserAgreement() {
  if (props.onGoUserAgreement) {
    props.onGoUserAgreement()
  } else {
    uni.navigateTo({ url: props.userAgreementPage })
  }
}

/** 跳转到隐私政策 */
function goToPrivacyPolicy() {
  if (props.onGoPrivacyPolicy) {
    props.onGoPrivacyPolicy()
  } else {
    uni.navigateTo({ url: props.privacyPolicyPage })
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/auth.scss';
</style>
