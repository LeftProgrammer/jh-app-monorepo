import type { JhAppConfig } from '../types'

// 默认配置
export const defaultConfig: JhAppConfig = {
  baseURL: '',
  timeout: 10000,
  platform: 'h5',
}

// 配置管理
class ConfigManager {
  private config: JhAppConfig = { ...defaultConfig };

  setConfig(newConfig: Partial<JhAppConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): JhAppConfig {
    return { ...this.config };
  }

  resetConfig() {
    this.config = { ...defaultConfig };
  }
}

export const configManager = new ConfigManager();
export type { JhAppConfig } from '../types';
