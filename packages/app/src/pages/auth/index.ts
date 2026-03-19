/**
 * 认证模块统一导出
 * 
 * @description 提供认证相关的组件、页面和样式
 * 
 * 使用说明：
 * 1. 外部项目需要保留页面文件（如 login.vue）用于 UniApp pages.json 路由注册
 * 2. 页面文件内部使用框架包封装的页面组件（如 AuthLoginPage）
 * 3. 页面组件通过 props/events 支持自定义配置和业务逻辑
 */

// 认证子组件导出（Header、CodeInput、TenantPicker、Verify）
export * from './components'

// 认证页面组件导出（LoginPage、CodeLoginPage、RegisterPage、ForgetPasswordPage）
export * from './views'

// 认证样式路径（供外部引用）
export const AUTH_STYLE_PATH = '@jinghe-sanjiaoroad-app/framework/pages/auth/styles/auth.scss'
