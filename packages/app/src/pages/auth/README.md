# 认证模块 (Auth Module)

认证模块提供了完整的用户认证功能，包括登录、注册、验证码登录、忘记密码等页面组件。

## 目录结构

```
auth/
├── components/          # 认证子组件
│   ├── header.vue       # 认证页面头部
│   ├── code-input.vue   # 验证码输入组件
│   ├── tenant-picker.vue # 租户选择器
│   └── verifition/      # 滑块验证码组件
│       └── verify.vue
├── views/               # 认证页面组件
│   ├── login.vue        # 登录页面组件
│   ├── code-login.vue   # 验证码登录页面组件
│   ├── register.vue     # 注册页面组件
│   └── forget-password.vue # 忘记密码页面组件
├── styles/              # 认证样式
│   └── auth.scss        # 公共样式
└── index.ts             # 统一导出
```

## 快速使用

外部项目只需保留页面文件用于 UniApp `pages.json` 路由注册，内部使用框架包组件即可：

```vue
<!-- pages-core/auth/code-login.vue -->
<template>
  <AuthCodeLoginPage :captcha-enabled="captchaEnabled" />
</template>

<script setup>
import { AuthCodeLoginPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

const captchaEnabled = import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'true'
</script>
```

**就这么简单！** 组件内部已处理：
- 登录/注册 API 调用
- Token 存储和用户信息获取
- 登录成功后的路由跳转
- 表单验证和错误提示
- 验证码发送和校验

## 导入方式

```typescript
// 导入页面组件
import { 
  AuthLoginPage, 
  AuthCodeLoginPage, 
  AuthRegisterPage, 
  AuthForgetPasswordPage 
} from '@jinghe-sanjiaoroad-app/framework/pages/auth'

// 导入子组件（如需单独使用）
import { 
  AuthHeader, 
  CodeInput, 
  TenantPicker, 
  Verify 
} from '@jinghe-sanjiaoroad-app/framework/pages/auth/components'

// 导入样式（在 scss 文件中）
@import '@jinghe-sanjiaoroad-app/framework/pages/auth/styles/auth.scss';
```

## 自定义扩展

如果需要自定义行为，可以通过 props 回调覆盖默认逻辑：

```vue
<template>
  <AuthCodeLoginPage 
    :captcha-enabled="true"
    :on-success="handleCustomLogin"
    :on-go-login="goToCustomLogin"
  />
</template>

<script setup>
import { AuthCodeLoginPage } from '@jinghe-sanjiaoroad-app/framework/pages/auth'

// 自定义登录成功处理
async function handleCustomLogin(data) {
  // 自定义登录逻辑...
}

// 自定义路由跳转
function goToCustomLogin() {
  uni.navigateTo({ url: '/my-custom-login-page' })
}
</script>
```

## Props 说明

### AuthCodeLoginPage

| Prop | 类型 | 说明 |
|------|------|------|
| `captchaEnabled` | `boolean` | 是否启用滑块验证码 |
| `onSuccess` | `Function` | 自定义登录成功回调，覆盖默认行为 |
| `onGoLogin` | `Function` | 自定义跳转到账号登录 |
| `onGoForgetPassword` | `Function` | 自定义跳转到忘记密码 |

### AuthRegisterPage

| Prop | 类型 | 说明 |
|------|------|------|
| `captchaEnabled` | `boolean` | 是否启用滑块验证码 |
| `onSuccess` | `Function` | 自定义注册成功回调 |
| `onGoLogin` | `Function` | 自定义跳转到登录页 |
| `onGoUserAgreement` | `Function` | 自定义跳转到用户协议 |
| `onGoPrivacyPolicy` | `Function` | 自定义跳转到隐私政策 |
| `userAgreementPage` | `string` | 用户协议页面路径 |
| `privacyPolicyPage` | `string` | 隐私政策页面路径 |

### AuthForgetPasswordPage

| Prop | 类型 | 说明 |
|------|------|------|
| `onSuccess` | `Function` | 自定义重置密码成功回调 |
| `onGoLogin` | `Function` | 自定义跳转到登录页 |

## 样式自定义

组件样式已内置，如需覆盖可使用 `:deep()` 选择器：

```scss
:deep(.auth-container) {
  // 自定义样式
}
```

## 注意事项

1. **路由配置**：确保在 `initFramework()` 中正确配置了路由路径
2. **验证码开关**：通过 `captchaEnabled` prop 控制是否启用滑块验证
3. **默认行为**：不传回调 props 时使用框架内置的默认行为
4. **自定义覆盖**：传入回调 props 可完全覆盖默认行为
