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
          placeholder="请输入账号"
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
      <view v-if="captchaEnabled">
        <Verify
          ref="verifyRef"
          :captcha-type="captchaType"
          explain="向右滑动完成验证"
          :img-size="{ width: '300px', height: '150px' }"
          mode="pop"
          @success="verifySuccess"
        />
      </view>

      <!-- 记住密码 -->
      <view class="mb-24rpx flex items-center justify-between">
        <wd-checkbox v-model="rememberMe" shape="square">记住密码</wd-checkbox>
        <text class="text-28rpx text-[#1890ff]" @click="goToForgetPassword">
          忘记密码？
        </text>
      </view>

      <!-- 登录按钮 -->
      <wd-button block :loading="loading" type="primary" @click="handleLogin">
        登录
      </wd-button>

      <!-- 其他登录方式 -->
      <view class="mt-40rpx flex items-center justify-center">
        <text class="text-28rpx text-[#666]" @click="goToSmsLogin">
          验证码登录
        </text>
        <text class="mx-20rpx text-[#ddd]">|</text>
        <text class="text-28rpx text-[#1890ff]" @click="goToRegister">
          注册账号
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { useTokenStore } from '../../../store/token'
import {
  getCodeLoginPage,
  getForgetPasswordPage,
  getHomePage,
  getRegisterPage,
} from '../../../config'
import AuthHeader from '../components/header.vue'
import TenantPicker from '../components/tenant-picker.vue'
import Verify from '../components/verifition/verify.vue'

defineOptions({
  name: 'AuthLoginPage',
})

const props = withDefaults(defineProps<{
  /** 重定向地址 */
  redirectUrl?: string
  /** 验证码开关 */
  captchaEnabled?: boolean
  /** 记住的用户名 */
  rememberedUsername?: string
  /** 记住的密码 */
  rememberedPassword?: string
  /** 登录成功后的回调，用于自定义处理（如记住密码、检查更新等） */
  onSuccess?: (data: { username: string; password: string; rememberMe: boolean }) => Promise<void> | void
  /** 跳转到注册页的回调 */
  onGoRegister?: () => void
  /** 跳转到验证码登录的回调 */
  onGoSmsLogin?: () => void
  /** 跳转到忘记密码的回调 */
  onGoForgetPassword?: () => void
}>(), {})

const toast = useToast()
const tokenStore = useTokenStore()
const loading = ref(false)
const rememberMe = ref(true)
const tenantPickerRef = ref<InstanceType<typeof TenantPicker>>()
const verifyRef = ref()
const captchaType = ref('blockPuzzle')

const internalCaptchaEnabled = props.captchaEnabled ?? false

const formData = reactive({
  username: props.rememberedUsername || '',
  password: props.rememberedPassword || '',
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

/** 登录处理 */
async function handleLogin() {
  if (!tenantPickerRef.value?.validate()) {
    return
  }
  if (!formData.username) {
    toast.warning('请输入账号')
    return
  }
  if (!formData.password) {
    toast.warning('请输入密码')
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
      // 自定义处理：外部处理登录逻辑
      await tokenStore.login({
        type: 'username',
        username: formData.username,
        password: formData.password,
        captchaVerification: formData.captchaVerification,
      })
      await props.onSuccess({
        username: formData.username,
        password: formData.password,
        rememberMe: rememberMe.value,
      })
    } else {
      // 默认行为：调用框架包的登录 API 并跳转
      await tokenStore.login({
        type: 'username',
        username: formData.username,
        password: formData.password,
        captchaVerification: formData.captchaVerification,
      })
      // 跳转到首页或重定向地址
      redirectAfterLogin()
    }
  } finally {
    loading.value = false
  }
}

/** 登录成功后跳转 */
function redirectAfterLogin() {
  const url = props.redirectUrl || getHomePage()
  uni.reLaunch({ url })
}

/** 跳转到注册页面 */
function goToRegister() {
  if (props.onGoRegister) {
    props.onGoRegister()
  } else {
    uni.navigateTo({ url: getRegisterPage() })
  }
}

/** 跳转到验证码登录 */
function goToSmsLogin() {
  if (props.onGoSmsLogin) {
    props.onGoSmsLogin()
  } else {
    uni.navigateTo({ url: getCodeLoginPage() })
  }
}

/** 跳转到忘记密码 */
function goToForgetPassword() {
  if (props.onGoForgetPassword) {
    props.onGoForgetPassword()
  } else {
    uni.navigateTo({ url: getForgetPasswordPage() })
  }
}

/** 设置加载状态 */
function setLoading(value: boolean) {
  loading.value = value
}

/** 获取记住密码状态 */
function getRememberMe() {
  return rememberMe.value
}

defineExpose({
  setLoading,
  getRememberMe,
})
</script>

<style lang="scss" scoped>
@import '../styles/auth.scss';
</style>
