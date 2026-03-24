<template>
  <HomeMenuPage :menu-groups="menuGroups" />
</template>

<script lang="ts" setup>
import { HomeMenuPage } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { menuGroups } from './index'

defineOptions({
  name: 'FavoriteSettings',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
})
</script>
