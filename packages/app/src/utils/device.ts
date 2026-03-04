/**
 * 设备信息工具类
 */
export class Device {
  /**
   * 获取系统信息
   */
  static async getSystemInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      ;(globalThis as any).uni?.getSystemInfo({
        success: resolve,
        fail: reject,
      })
    })
  }

  /**
   * 获取设备信息（同步）
   */
  static getSystemInfoSync(): any {
    return (globalThis as any).uni?.getSystemInfoSync()
  }

  /**
   * 获取网络类型
   */
  static async getNetworkType(): Promise<any> {
    return new Promise((resolve, reject) => {
      ;(globalThis as any).uni?.getNetworkType({
        success: resolve,
        fail: reject,
      })
    })
  }

  /**
   * 检查是否为 iOS
   */
  static isIOS(): boolean {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.system.toLowerCase().includes('ios')
  }

  /**
   * 检查是否为 Android
   */
  static isAndroid(): boolean {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.system.toLowerCase().includes('android')
  }

  /**
   * 检查是否为移动端
   */
  static isMobile(): boolean {
    const systemInfo = this.getSystemInfoSync()
    return ['ios', 'android'].includes(systemInfo.platform.toLowerCase())
  }

  /**
   * 检查是否为小程序
   */
  static isMiniProgram(): boolean {
    // #ifdef MP
    return true
    // #endif
    return false
  }

  /**
   * 检查是否为 H5
   */
  static isH5(): boolean {
    // #ifdef H5
    return true
    // #endif
    return false
  }

  /**
   * 获取设备像素比
   */
  static getPixelRatio(): number {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.pixelRatio
  }

  /**
   * 获取屏幕宽度
   */
  static getScreenWidth(): number {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.screenWidth
  }

  /**
   * 获取屏幕高度
   */
  static getScreenHeight(): number {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.screenHeight
  }

  /**
   * 获取状态栏高度
   */
  static getStatusBarHeight(): number {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.statusBarHeight || 0
  }

  /**
   * 获取安全区域
   */
  static getSafeArea(): any {
    const systemInfo = this.getSystemInfoSync()
    return systemInfo.safeArea || {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: systemInfo.screenWidth,
      height: systemInfo.screenHeight,
    }
  }
}
