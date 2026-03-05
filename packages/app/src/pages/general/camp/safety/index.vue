<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="营地安全"
      placeholder
      safe-area-inset-top
      left-arrow
      fixed
      @click-left="handleBack"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useToast } from "wot-design-uni";
import { navigateBackPlus } from "@/utils";

definePage({
  style: {
    navigationBarTitleText: "",
    navigationStyle: "custom"
  }
});

const loading = ref(false);
const toast = useToast();
/** 返回上一页 */
function handleBack() {
  navigateBackPlus();
}
/** 初始化 */
onMounted(async () => {
  loading.value = true;
  try {
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
