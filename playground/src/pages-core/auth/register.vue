<template>
  <AuthRegisterPage :captcha-enabled="captchaEnabled" />
</template>

<script lang="ts" setup>
import { AuthRegisterPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

defineOptions({
  name: 'RegisterPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})

const captchaEnabled = import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'true'
</script>
