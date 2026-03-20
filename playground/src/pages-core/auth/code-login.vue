<template>
  <AuthCodeLoginPage />
</template>

<script lang="ts" setup>
import { AuthCodeLoginPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})
</script>
