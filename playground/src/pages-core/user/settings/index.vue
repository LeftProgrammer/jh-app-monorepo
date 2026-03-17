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
      <image class="mb-24rpx h-150rpx w-150rpx" src="/static/logo.svg" mode="aspectFit" />
      <text class="text-40rpx text-gray-800 font-medium">绵竹抽蓄项目管理平台</text>
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
    <wd-overlay :show="showVersion" @click="showVersion = false">
      <view class="flex justify-center items-center h-100% px-16rpx">
        <view
          class="bg-#fff w-100% rounded-8rpx flex flex-col items-center justify-center py-61rpx gap-30rpx"
          @click.stop=""
        >
          <view class="text-34rpx text-#1D2129">当前版本</view>
          <view class="text-31rpx text-#86909C">v{{ version }}</view>
          <view v-if="version !== nowVersion" class="text-31rpx text-#009688">
            最新版本：v{{ nowVersion }}
          </view>
          <wd-button
            v-if="!isCheck && version === nowVersion"
            plain
            @click="checkUpdate()"
          >
            检查更新
          </wd-button>
          <view v-if="isCheck && version === nowVersion" class="text-31rpx text-#009688">
            已是最新版
          </view>
          <wd-button v-if="version !== nowVersion" plain @click="appUpdate()">
            获取最新版
          </wd-button>
        </view>
      </view>
    </wd-overlay>
    <!-- 底部协议和版权 -->
    <!-- <view class="!hidden mt-80rpx flex flex-col items-center">
      <view class="mb-40rpx flex items-center text-26rpx">
        <text class="text-[#1890ff]" @click="handleGoAgreement">《用户协议》</text>
        <text class="text-gray-500">与</text>
        <text class="text-[#1890ff]" @click="handleGoPrivacy">《隐私协议》</text>
      </view>
      <text class="mb-10rpx text-24rpx text-gray-400">
        Copyright © 2026 iocoder.cn All Rights Reserved.
      </text>
      <text class="text-24rpx text-gray-400"> 芋道源码 </text>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import { DICT_TYPE, navigateBackPlus } from '@/utils'
import { onMounted, ref } from "vue";
import { useToast } from "wot-design-uni";
;
import appUpdate from "@/utils/appUpdate";
import { useDictStore } from "@/store";
;
import { useMessage } from "wot-design-uni";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const toast = useToast();
const version = ref(""); // 当前版本号
const storageSize = ref(""); // 本地缓存大小
const message = useMessage();

/** 返回上一页 */
function handleBack() {
  navigateBackPlus("/pages/user/index");
}

/** 获取应用版本号 */
function getAppVersion() {
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    version.value = wgtinfo.version;
  });
  // #endif
}

/** 获取本地缓存大小 */
function getStorageSize() {
  const info = uni.getStorageInfoSync();
  storageSize.value = `${info.currentSize}KB`;
}
const showVersion = ref(false);
const isCheck = ref(false);
/** 显示版本信息 */
function handleShowVersion() {
  showVersion.value = true;
  isCheck.value = false;
  // toast.info(`当前版本：v${version.value}`);
  // nextTick(() => {
  //   appUpdate();
  // });
}
/** 清除缓存 */
function handleClearCache() {
  message
    .confirm({
      msg: "确定要清除本地缓存吗？",
      title: "提示"
    })
    .then(() => {
      try {
        uni.clearStorageSync();
        getStorageSize();
        toast.success("缓存清除成功");
      } catch {
        toast.error("缓存清除失败");
      }
    })
    .catch(() => {
      console.log("点击了取消按钮");
    });
}

const nowVersion = ref("");
const dictStore = useDictStore();
// 检查更新
function checkUpdate() {
  isCheck.value = true;
  dictStore.loadDictCache().then(() => {
    const APP_UPDATE = dictStore.getDictOptions(DICT_TYPE.APP_UPDATE);
    nowVersion.value = APP_UPDATE.find((x) => x.label === "version")?.value;
  });
}
/** 初始化 */
onMounted(() => {
  const APP_UPDATE = dictStore.getDictOptions(DICT_TYPE.APP_UPDATE);
  nowVersion.value = APP_UPDATE.find((x) => x.label === "version")?.value;

  getStorageSize();
  getAppVersion();
});
</script>

<style lang="scss" scoped>
:deep(.cell-group) {
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 8rpx rgba(24, 144, 255, 0.06);
}
</style>
