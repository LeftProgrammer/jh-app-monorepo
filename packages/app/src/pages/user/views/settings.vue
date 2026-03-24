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
            v-if="!isCheck && version === latestVersion"
            plain
            @click="checkUpdate"
          >
            检查更新
          </wd-button>
          <view v-if="isCheck && version === latestVersion" class="text-31rpx text-#009688">
            已是最新版
          </view>
          <wd-button v-if="version !== latestVersion" plain @click="handleUpdate">
            获取最新版
          </wd-button>
        </view>
      </view>
    </wd-overlay>

    <wd-message-box />
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useMessage, useToast } from 'wot-design-uni'
import {
  getAppLogo,
  getAppTitle,
} from '../../../config'
import { appUpdate } from '../../../utils'
import { useDictStore } from '../../../store/dict'

defineOptions({
  name: 'UserSettingsPage',
})

// APP 更新字典 key
const APP_UPDATE_DICT_TYPE = 'app_update'

const props = withDefaults(defineProps<{
  /** 返回页面路径，不传则使用 navigateBack */
  backUrl?: string
}>(), {
  backUrl: '',
})

const toast = useToast()
const message = useMessage()
const dictStore = useDictStore()

const logo = getAppLogo()
const appTitle = getAppTitle()
const version = ref('')
const storageSize = ref('')
const showVersion = ref(false)
const isCheck = ref(false)
const latestVersion = ref('')

/** 从字典获取最新版本号 */
function getLatestVersionFromDict() {
  const APP_UPDATE = dictStore.getDictOptions(APP_UPDATE_DICT_TYPE)
  return APP_UPDATE.find(x => x.label === 'version')?.value || ''
}

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
  })
  // #endif
}

function getStorageSize() {
  const info = uni.getStorageInfoSync()
  storageSize.value = `${info.currentSize}KB`
}

function handleShowVersion() {
  showVersion.value = true
  isCheck.value = false
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
    .catch(() => {
      console.log('点击了取消按钮')
    })
}

async function checkUpdate() {
  isCheck.value = true
  // 重新加载字典数据
  await dictStore.loadDictCache()
  const ver = getLatestVersionFromDict()
  if (ver) {
    latestVersion.value = ver
  }
}

function handleUpdate() {
  appUpdate()
}

onMounted(() => {
  // 从字典获取初始最新版本号
  latestVersion.value = getLatestVersionFromDict()
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
