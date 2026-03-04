// 通用工具函数

/**
 * 获取环境变量中的基础URL
 */
export function getEnvBaseUrl(): string {
  return import.meta.env.VITE_APP_BASE_URL || 'https://api.example.com'
}

/**
 * 解析URL为对象
 */
export function parseUrlToObj(url: string) {
  const [path, queryStr] = url.split('?')
  const query: Record<string, string> = {}

  if (queryStr) {
    queryStr.split('&').forEach(item => {
      const [key, value] = item.split('=')
      if (key) {
        query[decodeURIComponent(key)] = decodeURIComponent(value || '')
      }
    })
  }

  return { path: path || '', query }
}

/**
 * 获取所有页面
 */
export function getAllPages(type?: string) {
  // 这里应该从 pages.json 获取页面列表
  // 临时返回默认页面
  return [
    { path: '/pages/index/index', style: { navigationBarTitleText: '首页' } },
    { path: '/pages/login/index', style: { navigationBarTitleText: '登录' } }
  ]
}

/**
 * 获取最后一个页面
 */
export function getLastPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/**
 * 检查是否为小程序
 */
export function isMp(): boolean {
  // #ifdef MP
  return true
  // #endif
  return false
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 检查是否为空值
 */
export function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}
