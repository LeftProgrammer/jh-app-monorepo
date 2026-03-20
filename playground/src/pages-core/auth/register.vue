<template>
  <AuthRegisterPage />
</template>

<script lang="ts" setup>
import { AuthRegisterPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})
</script>
