/**
 * 本地存储工具类
 */
export class Storage {
  /**
   * 设置存储
   */
  static set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      ;(globalThis as any).uni?.setStorageSync(key, serializedValue)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  /**
   * 获取存储
   */
  static get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = (globalThis as any).uni?.getStorageSync(key)
      if (!item) {
        return defaultValue || null
      }
      return JSON.parse(item)
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue || null
    }
  }

  /**
   * 删除存储
   */
  static remove(key: string): void {
    try {
      ;(globalThis as any).uni?.removeStorageSync(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  }

  /**
   * 清空存储
   */
  static clear(): void {
    try {
      ;(globalThis as any).uni?.clearStorageSync()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }

  /**
   * 获取存储大小
   */
  static size(): number {
    try {
      const info = (globalThis as any).uni?.getStorageInfoSync()
      return info.currentSize
    } catch (error) {
      console.error('Storage size error:', error)
      return 0
    }
  }

  /**
   * 获取所有键
   */
  static keys(): string[] {
    try {
      const info = (globalThis as any).uni?.getStorageInfoSync()
      return info.keys
    } catch (error) {
      console.error('Storage keys error:', error)
      return []
    }
  }
}

/**
 * 简化的存储操作
 */
export const storage = {
  set: Storage.set.bind(Storage),
  get: Storage.get.bind(Storage),
  remove: Storage.remove.bind(Storage),
  clear: Storage.clear.bind(Storage),
  size: Storage.size.bind(Storage),
  keys: Storage.keys.bind(Storage),
}
