<template>
  <HomeDefaultPage :menu-groups="menuGroups" />
</template>

<script lang="ts" setup>
import { HomeDefaultPage } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { menuGroups } from './index'

defineOptions({
  name: 'Home',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
  },
})
</script>
