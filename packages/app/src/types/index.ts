// 通用类型定义
export interface JhAppConfig {
  baseURL: string;
  timeout: number;
  platform: string;
  [key: string]: any;
}

export interface HttpResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 路由相关类型
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  keepAlive?: boolean;
  level?: number;
}

// 用户信息类型
export interface UserInfo {
  id: number | string;
  nickname: string;
  avatar?: string;
  mobile?: string;
  email?: string;
  token?: string;
  tenantId?: string;
  permissions?: string[];
  roles?: string[];
  [key: string]: any;
}

// 应用配置类型
export interface AppConfig {
  baseURL: string;
  timeout: number;
  platform: string;
  [key: string]: any;
}

// 系统信息类型
export interface SystemInfo {
  platform: string;
  version: string;
  SDKVersion: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  statusBarHeight: number;
  safeArea: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  };
}

// 主题配置类型
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

// 存储配置类型
export interface StorageConfig {
  key: string;
  data: any;
  expire?: number;
}

// 加密配置类型
export interface EncryptConfig {
  algorithm: 'AES' | 'RSA' | 'DES';
  key?: string;
  iv?: string;
}

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  message?: string;
  validator?: (value: any) => boolean | string;
}

// 组件通用属性类型
export interface ComponentProps {
  class?: string;
  style?: string | Record<string, any>;
  disabled?: boolean;
  loading?: boolean;
}

// 按钮组件属性类型
export interface ButtonProps extends ComponentProps {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  round?: boolean;
  plain?: boolean;
  icon?: string;
}

// 模态框组件属性类型
export interface ModalProps extends ComponentProps {
  title?: string;
  content?: string;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string;
  maskClosable?: boolean;
}

// Toast 组件属性类型
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
}

// Loading 组件属性类型
export interface LoadingProps {
  message?: string;
  mask?: boolean;
  duration?: number;
}

// 路由配置类型
export interface RouteConfig {
  path: string;
  name?: string;
  meta?: Record<string, any>;
  component?: any;
}
