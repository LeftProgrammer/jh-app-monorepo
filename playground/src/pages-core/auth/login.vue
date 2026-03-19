<template>
  <view class="login-container bg-#F8FCFD h-100vh position-relative">
    <image src="/static/images/login/login-bg.png" class="w-100% h-37%" />
    <!-- 顶部阴影 -->
    <view
      class="top-bg position-absolute rounded-34px left-12% h-10% right-12% top-24% index-8"
    />
    <view
      class="login-form position-absolute rounded-34px left-7.2% h-55% right-7.2% top-25% index-10 bg-#fff px-53rpx pt-57rpx"
    >
      <view class="text-#1D2129 text-34rpx text-center mb-69rpx">{{ title }}</view>
      <view class="flex items-center mb-30rpx">
        <image src="/static/images/login/user.png" class="w-46rpx h-46rpx mr-23rpx" />
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
        <image src="/static/images/login/password.png" class="w-46rpx h-46rpx mr-23rpx" />
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
      class="text-#C9CDD4 text-23rpx position-absolute left-50% bottom-5% translate-x--50%"
    >
      当前版本：{{ version }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getAppTitle } from '@jinghe-sanjiaoroad-app/framework/config/framework'
import { useSystemState, useTokenStore } from '@/store'
import { appUpdate, ensureDecodeURIComponent, redirectAfterLogin } from '@/utils'
import { useToast } from 'wot-design-uni'

defineOptions({
  name: 'LoginPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})

const title = getAppTitle()
const systemStore = useSystemState()
const tokenStore = useTokenStore()
const toast = useToast()

const version = ref('')
const rememberMe = ref(true)
const loading = ref(false)
const redirectUrl = ref<string>()

const formData = reactive({
  username: systemStore.systemConfig.username || '',
  password: systemStore.systemConfig.password || '',
})

onLoad((options) => {
  if (options?.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect)
  }
})

onMounted(() => {
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    version.value = wgtinfo.version
  })
  // #endif
})

async function handleLogin() {
  if (!formData.username) {
    toast.warning('请输入账号')
    return
  }
  if (!formData.password) {
    toast.warning('请输入密码')
    return
  }

  loading.value = true
  try {
    await tokenStore.login({
      type: 'username',
      ...formData,
    })
    redirectAfterLogin(redirectUrl.value, true)
    if (rememberMe.value) {
      systemStore.setSystemInfo({
        username: formData.username,
        password: formData.password,
      })
    }
    setTimeout(() => {
      appUpdate()
    }, 2000)
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
