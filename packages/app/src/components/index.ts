/**
 * 组件统一导出
 *
 * 所有组件均支持 easycom 自动引入，命名规范：jh-xxx
 * 外部项目配置 easycom：
 * "^jh-(.*)": "@jinghe-sanjiaoroad-app/framework/src/components/jh-$1/jh-$1.vue"
 */
export { default as JhDictTag } from './jh-dict-tag/jh-dict-tag.vue'
export { default as JhFileUpload } from './jh-file-upload/jh-file-upload.vue'
export * from './jh-tabbar'
export { default as JhUnitPicker } from './jh-unit-picker/jh-unit-picker.vue'
export { default as JhUserPicker } from './jh-user-picker/jh-user-picker.vue'
