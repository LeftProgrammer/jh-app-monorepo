<template>
  <UserProfilePage
    :sex-options="sexOptions"
    :get-sex-label="getSexLabel"
  />
</template>

<script lang="ts" setup>
import { UserProfilePage } from '@jinghe-sanjiaoroad-app/framework/pages/user'
import { getDictLabel, getIntDictOptions } from '@/hooks'
import { DICT_TYPE } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const sexOptions = getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)

function getSexLabel(sex?: number): string {
  return getDictLabel(DICT_TYPE.SYSTEM_USER_SEX, sex) || ''
}
</script>
