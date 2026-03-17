<template>
  <view class="login-container bg-#F8FCFD h-100vh position-relative">
    <image src="/static/images/login/login-bg.png" class="w-100% h-37%" />
    <!-- 顶部阴影 -->
    <view
      class="top-bg position-absolute rounded-34px left-12% h-10% right-12% top-24% index-8"
    />
    <view
      class="login-form position-absolute rounded-34px left-7.2% h-55% right-7.2% top-25% index-10 bg-#fff px-53rpx pt-57rpx"
    >
      <view class="text-#1D2129 text-34rpx text-center mb-69rpx">{{ title }}</view>
      <view class="flex items-center mb-30rpx">
        <image src="/static/images/login/user.png" class="w-46rpx h-46rpx mr-23rpx" />
        <text class="text-#1D2129 text-31rpx">账号</text>
      </view>
      <wd-input
        v-model="formData.username"
        clear-trigger="focus"
        type="text"
        class="mb-38rpx"
        clearable
        placeholder="请输入账号"
      />
      <view class="flex items-center mb-30rpx">
        <image src="/static/images/login/password.png" class="w-46rpx h-46rpx mr-23rpx" />
        <text class="text-31rpx text-#1D2129">密码</text>
      </view>
      <wd-input
        v-model="formData.password"
        type="text"
        clear-trigger="focus"
        placeholder="请输入密码"
        clearable
        class="mb-46rpx"
        show-password
      />
      <wd-checkbox v-model="RememberMe" shape="square" class="!mb-80rpx">
        记住密码
      </wd-checkbox>
      <wd-button
        block
        :loading="loading"
        type="primary"
        :round="false"
        @click="handleLogin"
      >
        登录
      </wd-button>
    </view>
    <!-- 当前版本 -->
    <view
      class="text-#C9CDD4 text-23rpx position-absolute left-50% bottom-5% translate-x--50%"
    >
      当前版本：{{ version }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useToast } from "wot-design-uni";
import { CODE_LOGIN_PAGE, FORGET_PASSWORD_PAGE, REGISTER_PAGE } from "@/router";
import { useTokenStore } from "@/store";
import { ensureDecodeURIComponent, redirectAfterLogin } from "@/utils";
import appUpdate from "@/utils/appUpdate";
import Header from "./components/header.vue";
import TenantPicker from "./components/tenant-picker.vue";
import Verify from "./components/verifition/verify.vue";
const title = import.meta.env.VITE_APP_TITLE; // 应用标题
import { useSystemState } from "@/store";

defineOptions({
  name: "LoginPage",
  style: {
    navigationStyle: "custom"
  }
});

definePage({
  style: {
    navigationStyle: "custom"
  }
});
const systemStore = useSystemState();
const version = ref("");
const RememberMe = ref(true);
const toast = useToast();
const loading = ref(false); // 加载状态
const redirectUrl = ref<string>(); // 重定向地址
const tenantPickerRef = ref<InstanceType<typeof TenantPicker>>(); // 租户选择器引用
const captchaEnabled = import.meta.env.VITE_APP_CAPTCHA_ENABLE === "true"; // 验证码开关
const verifyRef = ref();
const captchaType = ref("blockPuzzle"); // 滑块验证码 blockPuzzle|clickWord

const formData = reactive({
  username: systemStore.systemConfig.username || "",
  password: systemStore.systemConfig.password || "",
  captchaVerification: "" // 验证码校验值
}); // 表单数据

/** 页面加载时处理重定向 */
onLoad((options) => {
  if (options?.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect);
  }
});
onMounted(() => {
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    version.value = wgtinfo.version;
  });
  // #endif
});
/** 获取验证码 */
async function getCode() {
  // 情况一，未开启：则直接登录
  if (!captchaEnabled) {
    await verifySuccess({});
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verifyRef.value.show();
  }
}

/** 登录处理 */
async function handleLogin() {
  // if (!tenantPickerRef.value?.validate()) {
  //   return;
  // }
  if (!formData.username) {
    toast.warning("请输入账号");
    return;
  }
  if (!formData.password) {
    toast.warning("请输入密码");
    return;
  }
  await getCode();
}

async function verifySuccess(params: any) {
  loading.value = true;
  try {
    // 调用登录接口
    const tokenStore = useTokenStore();
    formData.captchaVerification = params.captchaVerification;
    await tokenStore.login({
      type: "username",
      ...formData
    });
    // 处理跳转
    redirectAfterLogin(redirectUrl.value, true);
    if (RememberMe.value) {
      systemStore.setSystemInfo({
        username: formData.username,
        password: formData.password
      });
    }
    setTimeout(() => {
      appUpdate();
    }, 2000);
  } finally {
    loading.value = false;
  }
}

/** 跳转到注册页面 */
function goToRegister() {
  uni.navigateTo({ url: REGISTER_PAGE });
}

/** 跳转到验证码登录 */
function goToSmsLogin() {
  uni.navigateTo({ url: CODE_LOGIN_PAGE });
}

/** 跳转到忘记密码 */
function goToForgetPassword() {
  uni.navigateTo({ url: FORGET_PASSWORD_PAGE });
}

/** 微信登录 */
// TODO @芋艿：后续开发
function handleWechatLogin() {
  toast.info("微信登录功能开发中");
}

/** 钉钉登录 */
// TODO @芋艿：后续开发
function handleDingTalkLogin() {
  toast.info("钉钉登录功能开发中");
}
</script>

<style lang="scss" scoped>
.login-container {
}
.login-form {
  box-shadow: 0rpx 6rpx 19rpx 0rpx rgba(172, 196, 219, 0.3);
}
.top-bg {
  box-shadow: 0rpx 6rpx 19rpx 0rpx rgba(172, 196, 219, 0.3);
  background: rgba(244, 249, 251, 0.73);
}
</style>
