<template>
  <BpmDetailPage
    :process-instance-id="processInstanceId"
    :type="type"
    :form-modules="formModules"
    :register-component-fn="registerComponentFn"
  />
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { BpmDetailPage } from '@jinghe-sanjiaoroad-app/framework/pages/bpm'
import { ref } from 'vue'
// ============ 业务表单组件（小程序不支持动态组件，必须静态导入） ============
import ReceptionApplyForm from '@/pages/general/camp/receptionapply/ReceptionApplyForm.vue'
import SafetyForm from '@/pages/general/camp/safety/SafetyForm.vue'
import leaveApplyForm from '@/pages/general/leaveApply/dataForm.vue'
import meetForm from '@/pages/general/meeting/subscribe/SubscribeForm.vue'
import SealDeclarationForm from '@/pages/general/sealdeclaration/SealDeclarationForm.vue'
import consortiumPostedDataForm from '@/pages/pms/document/consortium/posted/dataForm.vue'
import consortiumReceivedDataForm from '@/pages/pms/document/consortium/received/dataForm.vue'
import constructionPostedDataForm from '@/pages/pms/document/construction/posted/dataForm.vue'
import ownerPostedDataForm from '@/pages/pms/document/owner/posted/dataForm.vue'
import supervisionPostedDataForm from '@/pages/pms/document/supervision/posted/dataForm.vue'
import rectificationDataForm from '@/pages/pms/safety/safeInspection/rectification/dataForm.vue'
import { registerComponent } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const processInstanceId = ref('')
const type = ref('todo')

/**
 * 业务表单组件映射（小程序环境必须静态导入）
 * key: 后端配置的表单路径
 * value: 对应的组件引用
 */
const formModules: Record<string, Component> = {
  '/general/camp/receptionapply/ReceptionApplyForm': ReceptionApplyForm,
  '/general/camp/safety/SafetyForm': SafetyForm,
  '/general/sealdeclaration/SealDeclarationForm': SealDeclarationForm,
  '/general/leaveApply/dataForm': leaveApplyForm,
  '/general/meeting/subscribe/SubscribeForm': meetForm,
  '/pms/document/consortium/posted/dataForm': consortiumPostedDataForm,
  '/pms/document/consortium/received/dataForm': consortiumReceivedDataForm,
  '/pms/document/supervision/posted/dataForm': supervisionPostedDataForm,
  '/pms/document/construction/posted/dataForm': constructionPostedDataForm,
  '/pms/document/owner/posted/dataForm': ownerPostedDataForm,
  '/pms/safety/safeInspection/rectification/dataForm': rectificationDataForm,
}

/**
 * H5 环境下的动态组件注册函数
 * 小程序环境返回 undefined，使用 formModules 静态映射
 */
function registerComponentFn(path?: string): Component | undefined {
  // #ifdef H5
  return registerComponent(path)
  // #endif
  // #ifndef H5
  return undefined
  // #endif
}

/** 初始化 */
onLoad((options) => {
  if (!options?.id) {
    return
  }
  processInstanceId.value = options.id
  type.value = options?.type || 'todo'
})
</script>

