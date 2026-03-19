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
        :scene="21"
        :before-send="validateBeforeSend"
      />
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

      <!-- 登录按钮 -->
      <view class="mb-2 mt-2 flex justify-between">
        <text class="text-28rpx text-[#1890ff]" @click="goToLogin">
          账号登录
        </text>
        <text class="text-28rpx text-[#1890ff]" @click="goToForgetPassword">
          忘记密码？
        </text>
      </view>
      <wd-button block :loading="loading" type="primary" @click="handleLogin">
        登录
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { isMobile, ensureDecodeURIComponent, redirectAfterLogin } from '../../../utils'
import { getLoginPage, getForgetPasswordPage } from '../../../config/framework'
import { useTokenStore } from '../../../store'
import AuthHeader from '../components/header.vue'
import CodeInput from '../components/code-input.vue'
import TenantPicker from '../components/tenant-picker.vue'
import Verify from '../components/verifition/verify.vue'

defineOptions({
  name: 'AuthCodeLoginPage',
})

const props = withDefaults(defineProps<{
  /** 验证码开关，默认从环境变量读取 */
  captchaEnabled?: boolean
  /** 登录成功后的回调，用于自定义处理 */
  onSuccess?: (data: { mobile: string; code: string }) => Promise<void> | void
  /** 跳转到账号登录的回调，用于自定义路由 */
  onGoLogin?: () => void
  /** 跳转到忘记密码的回调，用于自定义路由 */
  onGoForgetPassword?: () => void
}>(), {
  captchaEnabled: undefined,
})

const toast = useToast()
const tokenStore = useTokenStore()
const loading = ref(false)
const tenantPickerRef = ref<InstanceType<typeof TenantPicker>>()
const verifyRef = ref()
const captchaType = ref('blockPuzzle')
const redirectUrl = ref<string>()

// 验证码开关：优先使用 props，否则默认 false
const internalCaptchaEnabled = props.captchaEnabled ?? false

const formData = reactive({
  mobile: '',
  code: '',
  captchaVerification: '',
})

/** 页面加载时处理重定向 */
onLoad((options) => {
  if (options?.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect)
  }
})

/** 发送验证码前的校验 */
function validateBeforeSend(): boolean {
  return tenantPickerRef.value?.validate() ?? false
}

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
  await getCode()
}

/** 验证码验证成功回调 */
async function verifySuccess(params: any) {
  loading.value = true
  try {
    formData.captchaVerification = params.captchaVerification
    
    // 如果提供了自定义回调，则使用自定义回调
    if (props.onSuccess) {
      await props.onSuccess({
        mobile: formData.mobile,
        code: formData.code,
      })
    } else {
      // 默认行为：调用框架包的登录 API
      await tokenStore.login({
        type: 'sms',
        mobile: formData.mobile,
        code: formData.code,
        captchaVerification: formData.captchaVerification,
      })
      // 登录成功后跳转
      redirectAfterLogin(redirectUrl.value)
    }
  } finally {
    loading.value = false
  }
}

/** 跳转到账号密码登录 */
function goToLogin() {
  if (props.onGoLogin) {
    props.onGoLogin()
  } else {
    uni.navigateTo({ url: getLoginPage() })
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
</script>

<style lang="scss" scoped>
@import '../styles/auth.scss';
</style>
