<template>
  <view class="yd-page-container bg-#f5f5f5">
    <wd-navbar
      title="详情"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="navigateBackPlus()"
    />
    <wd-form ref="formRef" :model="formData" class="pb-0px">
      <wd-input
        v-model="formData.name"
        label="文件名称"
        label-width="200rpx"
        align-right
        prop="name"
        :readonly="disabled"
        placeholder="请输入文件名称"
      />
      <wd-input
        v-model="formData.code"
        label="文件编号"
        label-width="200rpx"
        align-right
        prop="code"
        :readonly="disabled"
        placeholder="请输入"
      />
      <jh-user-picker
        v-model="formData.sendUser"
        :readonly="disabled"
        label="发起人"
        label-width="120px"
        prop="sendUser"
      />
      <wd-datetime-picker
        v-model="formData.sendTime"
        label="发起时间"
        type="date"
        align-right
        :readonly="disabled"
        label-width="200rpx"
        :min-date="new Date().getTime()"
        prop="sendTime"
      />

      <wd-cell title="上传资料" title-width="100px" prop="file">
        <jh-file-upload v-model:file-id="formData.file" :disabled="disabled" />
      </wd-cell>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { createCirculateReadStatus, getCirculate } from '@/api/bpm/circulate'
import { useUserStore } from '@/store'
import { navigateBackPlus } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const toast = useToast()

const disabled = true
const userStore = useUserStore()
const userInfo: any = computed(() => userStore.userInfo || {})

const formData = ref<any>({})

/** 回显 */
async function getInfo(id: string) {
  const data = await getCirculate(id)
  formData.value = data
  createCirculateReadStatus({
    userId: userInfo.value.id,
    userName: userInfo.value.nickname,
    sex: userInfo.value.sex,
    readId: id,
    departId: userInfo.value.deptId,
    status: '2',
  })
}

onLoad(async (options) => {
  if (!options?.id) {
    toast.show('参数错误')
    return
  }
  getInfo(options.id)
})
</script>

<style lang="scss" scoped></style>
