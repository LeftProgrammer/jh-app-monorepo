<template>
  <AuthCodeLoginPage :captcha-enabled="captchaEnabled" />
</template>

<script lang="ts" setup>
import { AuthCodeLoginPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

defineOptions({
  name: 'SmsLoginPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})

const captchaEnabled = import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'true'
</script>
