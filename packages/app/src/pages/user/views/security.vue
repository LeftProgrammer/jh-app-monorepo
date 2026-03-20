<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="账号安全"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 安全设置区域 -->
    <wd-cell-group custom-class="cell-group" border>
      <wd-cell title="修改密码" is-link @click="handleChangePassword" />
    </wd-cell-group>

    <!-- 第三方绑定区域（可选显示） -->
    <wd-cell-group v-if="showThirdPartyBind" custom-class="cell-group mt-24rpx" border>
      <wd-cell title="微信小程序" is-link @click="handleBindWechatMiniProgram">
        <template #icon>
          <wd-icon name="chat" size="20px" color="#07c160" class="mr-16rpx" />
        </template>
        <view class="text-[#999]">未绑定</view>
      </wd-cell>
      <wd-cell title="微信公众号" is-link @click="handleBindWechatOfficialAccount">
        <template #icon>
          <wd-icon name="chat" size="20px" color="#07c160" class="mr-16rpx" />
        </template>
        <view class="text-[#999]">未绑定</view>
      </wd-cell>
    </wd-cell-group>

    <!-- 修改密码弹窗 -->
    <PasswordForm v-model="showPasswordPopup" @success="handlePasswordSuccess" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'
import PasswordForm from '../components/password-form.vue'

defineOptions({
  name: 'UserSecurityPage',
})

const props = withDefaults(defineProps<{
  /** 返回页面路径 */
  backUrl?: string
  /** 是否显示第三方绑定 */
  showThirdPartyBind?: boolean
  /** 密码修改成功回调 */
  onPasswordSuccess?: () => void
}>(), {
  backUrl: '',
  showThirdPartyBind: false,
})

const toast = useToast()
const showPasswordPopup = ref(false)

function handleBack() {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl })
  } else {
    uni.navigateBack()
  }
}

function handleChangePassword() {
  showPasswordPopup.value = true
}

function handlePasswordSuccess() {
  if (props.onPasswordSuccess) {
    props.onPasswordSuccess()
  }
}

function handleBindWechatMiniProgram() {
  toast.info('正在开发中')
}

function handleBindWechatOfficialAccount() {
  toast.info('正在开发中')
}
</script>

<style lang="scss" scoped>
:deep(.cell-group) {
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 8rpx rgba(24, 144, 255, 0.06);
}
</style>
