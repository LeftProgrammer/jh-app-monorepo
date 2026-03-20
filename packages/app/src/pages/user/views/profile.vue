<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="个人资料"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 信息区域 -->
    <wd-cell-group custom-class="cell-group" border>
      <wd-cell title="头像" title-width="120rpx" is-link center @click="handleEditAvatar">
        <view class="ml-auto h-50rpx w-50rpx overflow-hidden rounded-full">
          <image :src="userProfile?.avatar" mode="aspectFill" class="h-full w-full" />
        </view>
      </wd-cell>
      <wd-cell
        title="昵称"
        title-width="120rpx"
        :value="userProfile?.nickname || '-'"
        is-link
        @click="handleEdit('nickname')"
      />
      <wd-cell
        title="性别"
        :value="getSexLabel(userProfile?.sex) || '-'"
        is-link
        @click="handleEdit('sex')"
      />
      <wd-cell
        title="手机"
        title-width="120rpx"
        :value="userProfile?.mobile || '-'"
        is-link
        @click="handleEdit('mobile')"
      />
      <wd-cell
        title="邮箱"
        title-width="120rpx"
        :value="userProfile?.email || '-'"
        is-link
        @click="handleEdit('email')"
      />
    </wd-cell-group>
    <wd-cell-group custom-class="cell-group mt-24rpx" border>
      <wd-cell
        title="部门"
        title-width="120rpx"
        :value="userProfile?.dept?.name || '-'"
      />
      <wd-cell
        title="岗位"
        title-width="120rpx"
        :value="userProfile?.posts?.map((p) => p.name).join('、') || '-'"
      />
      <wd-cell
        title="角色"
        title-width="120rpx"
        :value="userProfile?.roles?.map((r) => r.name).join('、') || '-'"
      />
    </wd-cell-group>

    <!-- 头像裁剪 -->
    <wd-img-cropper
      v-model="showCropper"
      :img-src="cropperSrc"
      @confirm="handleCropperConfirm"
    />
    <!-- 编辑弹窗 -->
    <ProfileForm
      v-model="formVisible"
      :field="formType"
      :value="formValue"
      :sex-options="sexOptions"
      @success="loadUserProfile"
    />
  </view>
</template>

<script lang="ts" setup>
import type { UserProfileVO } from '../../../api/system/user/profile'
import { onMounted, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { getUserProfile, updateUserProfile } from '../../../api/system/user/profile'
import { getFileByIds } from '../../../api/infra/file'
import { useUserStore } from '../../../store'
import { uploadFileFromPath } from '../../../utils'
import ProfileForm from '../components/profile-form.vue'

defineOptions({
  name: 'UserProfilePage',
})

const props = withDefaults(defineProps<{
  /** 返回页面路径 */
  backUrl?: string
  /** 性别选项 */
  sexOptions?: { label: string; value: number }[]
  /** 获取性别标签的函数 */
  getSexLabel?: (sex?: number) => string
}>(), {
  backUrl: '',
  sexOptions: () => [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
  ],
})

const toast = useToast()
const userStore = useUserStore()
const loading = ref(true)
const userProfile = ref<UserProfileVO | null>(null)

const showCropper = ref(false)
const cropperSrc = ref('')

const formVisible = ref(false)
const formType = ref<'nickname' | 'sex' | 'mobile' | 'email'>('nickname')
const formValue = ref<string | number>('')

function getSexLabel(sex?: number): string {
  if (props.getSexLabel) {
    return props.getSexLabel(sex)
  }
  const option = props.sexOptions?.find(o => o.value === sex)
  return option?.label || ''
}

function handleBack() {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl })
  } else {
    uni.navigateBack()
  }
}

async function loadUserProfile() {
  loading.value = true
  try {
    userProfile.value = await getUserProfile()
    if (userProfile.value.avatar) {
      const file = await getFileByIds(userProfile.value.avatar)
      if (file && file.length > 0) {
        userProfile.value.avatar = file[0].url
      }
    }
  } finally {
    loading.value = false
  }
}

function handleEditAvatar() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      cropperSrc.value = res.tempFilePaths[0]
      showCropper.value = true
    },
  })
}

async function handleCropperConfirm(event: { tempFilePath: string }) {
  const avatarObj: any = await uploadFileFromPath(event.tempFilePath, 'avatar')
  await updateUserProfile({ avatar: avatarObj.id })

  if (userProfile.value) {
    userProfile.value.avatar = avatarObj.url
  }
  userStore.setUserAvatar(avatarObj.id)
  toast.success('头像修改成功')
}

function handleEdit(field: 'nickname' | 'sex' | 'mobile' | 'email') {
  formType.value = field
  formValue.value = userProfile.value?.[field] ?? (field === 'sex' ? 1 : '')
  formVisible.value = true
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style lang="scss" scoped>
:deep(.cell-group) {
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 8rpx rgba(24, 144, 255, 0.06);
}
</style>
