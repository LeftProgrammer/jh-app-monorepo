<template>
  <HomeMenuSettings :menu-groups="menuGroups" />
</template>

<script lang="ts" setup>
import { HomeMenuSettings } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { getMenuGroups } from '../index'

defineOptions({
  name: 'FavoriteSettings',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

/** 菜单分组（带权限过滤） */
const menuGroups = computed(() => getMenuGroups())
</script>
