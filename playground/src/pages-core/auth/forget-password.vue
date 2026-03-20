<template>
  <AuthForgetPasswordPage />
</template>

<script lang="ts" setup>
import { AuthForgetPasswordPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})
</script>
