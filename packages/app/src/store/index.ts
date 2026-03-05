import { defineStore } from 'pinia';
import type { UserInfo } from '../types';

// 用户状态管理
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    tenantId: '',
    permissions: [] as string[],
    roles: [] as string[],
  }),

  getters: {
    nickname: (state) => state.userInfo?.nickname || '',
    avatar: (state) => state.userInfo?.avatar || '',
    userId: (state) => state.userInfo?.id || null,
    mobile: (state) => state.userInfo?.mobile || '',
    email: (state) => state.userInfo?.email || '',
  },

  actions: {
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      if (userInfo.tenantId) {
        this.tenantId = userInfo.tenantId;
      }
      if (userInfo.permissions) {
        this.permissions = userInfo.permissions;
      }
      if (userInfo.roles) {
        this.roles = userInfo.roles;
      }
    },

    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null;
      this.tenantId = '';
      this.permissions = [];
      this.roles = [];
    },

    // 更新用户信息
    updateUserInfo(partialInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...partialInfo };
      }
    },

    // 设置租户ID
    setTenantId(tenantId: string) {
      this.tenantId = tenantId;
      if (this.userInfo) {
        this.userInfo.tenantId = tenantId;
      }
    },

    // 设置权限
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
      if (this.userInfo) {
        this.userInfo.permissions = permissions;
      }
    },

    // 设置角色
    setRoles(roles: string[]) {
      this.roles = roles;
      if (this.userInfo) {
        this.userInfo.roles = roles;
      }
    },

    // 检查是否有权限
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    },

    // 检查是否有角色
    hasRole(role: string): boolean {
      return this.roles.includes(role);
    },
  },

  persist: {
    key: 'jh-app-user-store',
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: string) => uni.setStorageSync(key, value),
    },
  },
});

// 应用状态管理
export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as 'light' | 'dark',
    language: 'zh-CN',
    platform: '' as string,
    systemInfo: null as any,
    isOnline: true,
  }),

  getters: {
    isDarkMode: (state) => state.theme === 'dark',
    isH5: (state) => state.platform === 'h5',
    isMp: (state) => state.platform.includes('mp'),
    isApp: (state) => state.platform === 'app',
  },

  actions: {
    // 设置主题
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
    },

    // 设置语言
    setLanguage(language: string) {
      this.language = language;
    },

    // 设置平台信息
    setPlatform(platform: string) {
      this.platform = platform;
    },

    // 设置系统信息
    setSystemInfo(info: any) {
      this.systemInfo = info;
    },

    // 设置网络状态
    setOnlineStatus(isOnline: boolean) {
      this.isOnline = isOnline;
    },

    // 初始化应用信息
    async initApp() {
      try {
        const systemInfo = await new Promise<any>((resolve, reject) => {
          uni.getSystemInfo({
            success: resolve,
            fail: reject,
          })
        })
        this.setSystemInfo(systemInfo)
        this.setPlatform(systemInfo.platform)
      } catch (error) {
        console.error('Failed to get system info:', error)
      }
    },
  },

  persist: {
    key: 'jh-app-store',
    storage: {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: string) => uni.setStorageSync(key, value),
    },
  },
});
