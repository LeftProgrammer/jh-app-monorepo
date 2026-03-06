import { createPinia, setActivePinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate"; // 数据持久化

const store = createPinia();
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
);
// 立即激活 Pinia 实例, 这样即使在 app.use(store)之前调用 store 也能正常工作 （解决APP端白屏问题）
setActivePinia(store);

export default store;

// 直接导出
export { useTokenStore } from "./token";
export { useUserStore } from "./user";
export { useThemeStore } from "./theme";
export { useSystemState } from "./system";
export { useGlobalState } from "./global";
export { useDictStore } from "./dict";

// 模块命名空间导出 - 避免潜在的 actions/getters 冲突
export * as dictStores from "./dict";
export * as themeStores from "./theme";
export * as tokenStores from "./token";
export * as userStores from "./user";
export * as globalStores from "./global";
export * as systemStores from "./system";