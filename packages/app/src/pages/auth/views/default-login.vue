<template>
  <view class="login-container bg-#F8FCFD h-100vh position-relative">
    <image :src="bgImage" class="w-100% h-37%" />
    <!-- 顶部阴影 -->
    <view
      class="top-bg position-absolute rounded-34px left-12% h-10% right-12% top-24% index-8"
    />
    <view
      class="login-form position-absolute rounded-34px left-7.2% h-55% right-7.2% top-25% index-10 bg-#fff px-53rpx pt-57rpx"
    >
      <view class="text-#1D2129 text-34rpx text-center mb-69rpx">{{ title }}</view>
      <view class="flex items-center mb-30rpx">
        <image :src="userIcon" class="w-46rpx h-46rpx mr-23rpx" />
        <text class="text-#1D2129 text-31rpx">账号</text>
      </view>
      <wd-input
        v-model="formData.username"
        clear-trigger="focus"
        type="text"
        class="mb-38rpx"
        clearable
        placeholder="请输入账号"
      />
      <view class="flex items-center mb-30rpx">
        <image :src="passwordIcon" class="w-46rpx h-46rpx mr-23rpx" />
        <text class="text-31rpx text-#1D2129">密码</text>
      </view>
      <wd-input
        v-model="formData.password"
        type="text"
        clear-trigger="focus"
        placeholder="请输入密码"
        clearable
        class="mb-46rpx"
        show-password
      />
      <!-- 验证码 -->
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
      <wd-checkbox v-model="rememberMe" shape="square" class="!mb-80rpx">
        记住密码
      </wd-checkbox>
      <wd-button
        block
        :loading="loading"
        type="primary"
        :round="false"
        @click="handleLogin"
      >
        登录
      </wd-button>
    </view>
    <!-- 当前版本 -->
    <view
      v-if="showVersion"
      class="text-#C9CDD4 text-23rpx position-absolute left-50% bottom-5% translate-x--50%"
    >
      当前版本：{{ version }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { useTokenStore } from '../../../store/token'
import { getAppTitle, getHomePage } from '../../../config/framework'
import { useSystemState } from '../../../store'
import Verify from '../components/verifition/verify.vue'

defineOptions({
  name: 'AuthDefaultLoginPage',
})

const props = withDefaults(defineProps<{
  /** 背景图片 */
  bgImage?: string
  /** 用户图标 */
  userIcon?: string
  /** 密码图标 */
  passwordIcon?: string
  /** 验证码开关 */
  captchaEnabled?: boolean
  /** 是否显示版本号 */
  showVersion?: boolean
  /** 登录成功后的回调，用于额外处理（如检查更新等），内部已处理记住密码和跳转 */
  onSuccess?: () => Promise<void> | void
}>(), {
  bgImage: '/static/images/login/login-bg.png',
  userIcon: '/static/images/login/user.png',
  passwordIcon: '/static/images/login/password.png',
  captchaEnabled: false,
  showVersion: true,
})

const toast = useToast()
const tokenStore = useTokenStore()
const systemStore = useSystemState()
const loading = ref(false)
const rememberMe = ref(true)
const verifyRef = ref()
const captchaType = ref('blockPuzzle')
const version = ref('')
const redirectUrl = ref<string>()

const title = getAppTitle()

const formData = reactive({
  username: systemStore.systemConfig?.username || '',
  password: systemStore.systemConfig?.password || '',
  captchaVerification: '',
})

/** 页面加载时处理重定向参数 */
onLoad((options) => {
  if (options?.redirect) {
    redirectUrl.value = decodeURIComponent(options.redirect)
  }
})

/** 获取版本号 */
onMounted(() => {
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    version.value = wgtinfo.version
  })
  // #endif
})

/** 获取验证码 */
async function getCode() {
  if (!props.captchaEnabled) {
    await verifySuccess({})
  } else {
    verifyRef.value.show()
  }
}

/** 登录处理 */
async function handleLogin() {
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

    // 调用框架包的登录 API
    await tokenStore.login({
      type: 'username',
      username: formData.username,
      password: formData.password,
      captchaVerification: formData.captchaVerification,
    })

    // 记住密码
    if (rememberMe.value) {
      systemStore.setSystemInfo({
        username: formData.username,
        password: formData.password,
      })
    }

    // 跳转到首页或重定向地址
    const url = redirectUrl.value || getHomePage()
    uni.reLaunch({ url })

    // 外部额外处理（如检查更新）
    if (props.onSuccess) {
      await props.onSuccess()
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  box-shadow: 0rpx 6rpx 19rpx 0rpx rgba(172, 196, 219, 0.3);
}
.top-bg {
  box-shadow: 0rpx 6rpx 19rpx 0rpx rgba(172, 196, 219, 0.3);
  background: rgba(244, 249, 251, 0.73);
}
</style>
