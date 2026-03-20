<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="应用设置"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- Logo 区域 -->
    <view class="flex flex-col items-center py-60rpx">
      <image class="mb-24rpx h-150rpx w-150rpx" :src="logo" mode="aspectFit" />
      <text class="text-40rpx text-gray-800 font-medium">{{ appTitle }}</text>
    </view>

    <!-- 设置列表 -->
    <view class="mx-24rpx">
      <wd-cell-group custom-class="cell-group" border>
        <wd-cell
          title="当前版本"
          :value="`v${version}`"
          is-link
          @click="handleShowVersion"
        >
          <template #icon>
            <wd-icon name="warning" size="20px" color="#4E5969" class="mr-16rpx" />
          </template>
        </wd-cell>
        <wd-cell title="本地缓存" :value="storageSize" is-link @click="handleClearCache">
          <template #icon>
            <wd-icon name="clear" size="20px" color="#4E5969" class="mr-16rpx" />
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 版本弹窗 -->
    <wd-overlay :show="showVersion" @click="showVersion = false">
      <view class="flex justify-center items-center h-100% px-16rpx">
        <view
          class="bg-#fff w-100% rounded-8rpx flex flex-col items-center justify-center py-61rpx gap-30rpx"
          @click.stop=""
        >
          <view class="text-34rpx text-#1D2129">当前版本</view>
          <view class="text-31rpx text-#86909C">v{{ version }}</view>
          <view v-if="version !== latestVersion" class="text-31rpx text-#009688">
            最新版本：v{{ latestVersion }}
          </view>
          <wd-button
            v-if="!isChecked && version === latestVersion"
            plain
            @click="checkUpdate"
          >
            检查更新
          </wd-button>
          <view v-if="isChecked && version === latestVersion" class="text-31rpx text-#009688">
            已是最新版
          </view>
          <wd-button v-if="version !== latestVersion" plain @click="handleUpdate">
            获取最新版
          </wd-button>
        </view>
      </view>
    </wd-overlay>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useMessage, useToast } from 'wot-design-uni'
import {
  getAppLogo,
  getAppTitle,
} from '../../../config/framework'
import { appUpdate } from '../../../utils'

defineOptions({
  name: 'UserSettingsPage',
})

const props = withDefaults(defineProps<{
  /** 返回页面路径 */
  backUrl?: string
  /** 获取最新版本号的函数 */
  getLatestVersion?: () => Promise<string> | string
  /** 执行更新的函数 */
  onUpdate?: () => void
}>(), {
  backUrl: '',
})

const toast = useToast()
const message = useMessage()

const logo = getAppLogo()
const appTitle = getAppTitle()
const version = ref('')
const latestVersion = ref('')
const storageSize = ref('')
const showVersion = ref(false)
const isChecked = ref(false)

function handleBack() {
  if (props.backUrl) {
    uni.navigateTo({ url: props.backUrl })
  } else {
    uni.navigateBack()
  }
}

function getAppVersion() {
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    version.value = wgtinfo.version
    latestVersion.value = wgtinfo.version
  })
  // #endif
}

function getStorageSize() {
  const info = uni.getStorageInfoSync()
  storageSize.value = `${info.currentSize}KB`
}

function handleShowVersion() {
  showVersion.value = true
  isChecked.value = false
}

function handleClearCache() {
  message
    .confirm({
      msg: '确定要清除本地缓存吗？',
      title: '提示',
    })
    .then(() => {
      try {
        uni.clearStorageSync()
        getStorageSize()
        toast.success('缓存清除成功')
      } catch {
        toast.error('缓存清除失败')
      }
    })
    .catch(() => {})
}

async function checkUpdate() {
  isChecked.value = true
  if (props.getLatestVersion) {
    const ver = await props.getLatestVersion()
    if (ver) {
      latestVersion.value = ver
    }
  }
}

function handleUpdate() {
  if (props.onUpdate) {
    props.onUpdate()
  } else {
    appUpdate()
  }
}

onMounted(() => {
  getStorageSize()
  getAppVersion()
})
</script>

<style lang="scss" scoped>
:deep(.cell-group) {
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 8rpx rgba(24, 144, 255, 0.06);
}
</style>
