/**
 * 认证页面组件统一导出
 * 
 * @description 提供认证相关的页面组件，外部项目需要保留页面文件用于 pages.json 路由注册，
 * 但内部可以使用这些封装好的页面组件
 */

export { default as AuthLoginPage } from './login.vue'
export { default as AuthCodeLoginPage } from './code-login.vue'
export { default as AuthRegisterPage } from './register.vue'
export { default as AuthForgetPasswordPage } from './forget-password.vue'
