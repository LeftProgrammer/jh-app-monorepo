<script lang="ts" setup>
import { Error404Page } from '@jinghe-sanjiaoroad-app/framework/pages/error'

definePage({
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})
</script>

<template>
  <Error404Page />
</template>
