<template>
  <AuthDefaultLoginPage
    :captcha-enabled="captchaEnabled"
    :on-success="handleSuccess"
  />
</template>

<script lang="ts" setup>
import { AuthDefaultLoginPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'
import { appUpdate } from '@/utils'

defineOptions({
  name: 'LoginPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})

const captchaEnabled = import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'true'

function handleSuccess() {
  // 检查更新
  setTimeout(() => {
    appUpdate()
  }, 2000)
}
</script>
