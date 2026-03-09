import { useAccess } from "@/hooks/useAccess";
import { ONLY_PC_PAGE } from "@/router/config";

/**
 * 工作台菜单数据
 * 定义菜单分组和菜单项的数据结构
 */

/** 菜单项类型 */
export interface MenuItem {
  key: string; // 菜单唯一标识
  name: string; // 菜单名称
  icon?: string; // 菜单图标（支持 wot-design-uni 图标名或图片路径）
  url?: string; // 跳转路径
  iconColor?: string; // 图标颜色（可选）
  enabled?: boolean; // 是否启用（可选，默认 true）
  permission?: string; // 权限标识（可选）
  imageUrl?: string; // 自定义图片URL
  description?: string; // 菜单描述
  sort?: number; // 排序权重
  badge?: string | number; // 角标
}

/** 菜单分组类型 */
export interface MenuGroup {
  key: string; // 分组唯一标识
  name: string; // 分组名称
  menus: MenuItem[]; // 分组下的菜单列表
  enabled?: boolean; // 是否启用分组
  sort?: number; // 分组排序
}

/** 菜单配置接口 */
export interface MenuConfig {
  groups?: MenuGroup[]; // 自定义菜单分组
  mergeWithDefault?: boolean; // 是否与默认数据合并
  overrideDefault?: boolean; // 是否完全覆盖默认数据
  enablePermission?: boolean; // 是否启用权限过滤
}

/** 菜单分组原始数据 */
const defaultMenuGroupsData: MenuGroup[] = [
  // {
  //   key: "bpm",
  //   name: "工作流程",
  //   menus: [
  //     {
  //       key: "bpmMy",
  //       name: "我的流程",
  //       icon: "user-circle",
  //       url: "/pages/bpm/index?tab=my",
  //       iconColor: "#1890ff",
  //     },
  //     {
  //       key: "bpmTodo",
  //       name: "待办任务",
  //       icon: "time",
  //       url: "/pages/bpm/index?tab=todo",
  //       iconColor: "#fa8c16",
  //     },
  //     {
  //       key: "bpmDone",
  //       name: "已办任务",
  //       icon: "check-circle",
  //       url: "/pages/bpm/index?tab=done",
  //       iconColor: "#52c41a",
  //     },
  //     {
  //       key: "bpmCopy",
  //       name: "抄送我的",
  //       icon: "mail",
  //       url: "/pages/bpm/index?tab=copy",
  //       iconColor: "#13c2c2",
  //     },
  //   ],
  // },
  {
    key: "general",
    name: "综合管理",
    menus: [
      {
        key: "meeting",
        name: "会议预约",
        url: "/pages/general/meeting/subscribe/index",
      },
      {
        key: "leaveApply",
        name: "请假申请",
        url: "/pages/general/leaveApply/index",
      },
      {
        key: "sealdeclaration",
        name: "用印申请",
        url: "/pages/general/sealdeclaration/index",
      },
      // {
      //   key: "camp-safety",
      //   name: "营地安全",
      //   url: "/pages/general/camp/safety/index",
      // },
      {
        key: "camp-reception-apply",
        name: "接待餐预定",
        url: "/pages/general/camp/receptionapply/index",
      },
      {
        key: "contact",
        name: "通讯录",
        url: "/pages/contact/index",
      },
    ],
  },
  {
    key: "document",
    name: "公文管理",
    menus: [
      {
        key: "consortium-posted",
        name: "总包发文",
        url: "/pages/pms/document/consortium/posted/index",
        permission: "posted:consortium:query",
      },
      {
        key: "consortium-received",
        name: "总包收文",
        url: "/pages/pms/document/consortium/received/index",
        permission: "received:consortium:query",
      },
      {
        key: "owner-posted",
        name: "业主发文",
        url: "/pages/pms/document/owner/posted/index",
        permission: "posted:owner:query",
      },
      {
        key: "owner-received",
        name: "业主收文",
        url: "/pages/pms/document/owner/received/index",
        permission: "received:owner:query",
      },
      {
        key: "supervision-posted",
        name: "监理发文",
        url: "/pages/pms/document/supervision/posted/index",
        permission: "posted:supervision:query",
      },
      {
        key: "supervision-received",
        name: "监理收文",
        url: "/pages/pms/document/supervision/received/index",
        permission: "received:supervision:query",
      },
      {
        key: "construction-posted",
        name: "施工发文",
        url: "/pages/pms/document/construction/posted/index",
        permission: "posted:construction:query",
      },
      {
        key: "construction-received",
        name: "施工收文",
        url: "/pages/pms/document/construction/received/index",
        permission: "received:construction:query",
      },
    ],
  },
  {
    key: "safety",
    name: "安全管理",
    menus: [
      {
        key: "safety-inspection",
        name: "安全检查",
        url: "/pages/pms/safety/safeInspection/inspection/index",
      },
      {
        key: "safety-rectification",
        name: "隐患整改",
        url: "/pages/pms/safety/safeInspection/rectification/index",
      },
    ],
  },
];

/** 外部配置存储 */
let externalMenuConfig: MenuConfig | null = null;

/**
 * 设置外部菜单配置 - 简化版本
 * 外部项目可以调用此方法来自定义菜单数据
 */
export function setMenuConfig(config: MenuConfig | MenuGroup[]) {
  // 如果传入的是数组，自动转换为配置对象
  if (Array.isArray(config)) {
    externalMenuConfig = {
      groups: config,
      mergeWithDefault: true
    };
  } else {
    externalMenuConfig = config;
  }
}

/**
 * 快速配置菜单 - 最简单的方式
 */
export function configureMenus(groups: MenuGroup[]) {
  setMenuConfig(groups);
}

/**
 * 添加菜单分组 - 增量方式
 */
export function addMenuGroup(group: MenuGroup) {
  const currentConfig = externalMenuConfig || { groups: [] };
  setMenuConfig({
    ...currentConfig,
    groups: [...(currentConfig.groups || []), group]
  });
}

/**
 * 添加菜单项到指定分组
 */
export function addMenuItem(groupKey: string, menuItem: MenuItem) {
  const currentConfig = externalMenuConfig || { groups: [] };
  const groups = [...(currentConfig.groups || [])];
  
  const groupIndex = groups.findIndex(g => g.key === groupKey);
  if (groupIndex !== -1) {
    groups[groupIndex] = {
      ...groups[groupIndex],
      menus: [...groups[groupIndex].menus, menuItem]
    };
  } else {
    groups.push({
      key: groupKey,
      name: groupKey,
      menus: [menuItem]
    });
  }
  
  setMenuConfig({ ...currentConfig, groups });
}

/**
 * 获取菜单分组原始数据
 * 支持外部配置覆盖
 */
function getMenuGroupsData(): MenuGroup[] {
  if (!externalMenuConfig) {
    return defaultMenuGroupsData;
  }

  const { groups = [], mergeWithDefault = true, overrideDefault = false } = externalMenuConfig;

  if (overrideDefault) {
    // 完全覆盖默认数据
    return groups;
  }

  if (mergeWithDefault && groups.length > 0) {
    // 合并外部配置和默认数据
    const mergedData = [...defaultMenuGroupsData];
    
    groups.forEach(externalGroup => {
      const existingIndex = mergedData.findIndex(g => g.key === externalGroup.key);
      
      if (existingIndex !== -1) {
        // 合并到现有分组
        const existingGroup = mergedData[existingIndex];
        mergedData[existingIndex] = {
          ...existingGroup,
          ...externalGroup,
          menus: externalGroup.menus || existingGroup.menus
        };
      } else {
        // 添加新分组
        mergedData.push(externalGroup);
      }
    });
    
    return mergedData;
  }

  return defaultMenuGroupsData;
}

/**
 * 获取所有菜单分组数据（带权限过滤）：过滤掉没有权限的菜单项，如果整个分组都没有权限则不展示该分组
 */
export function getMenuGroups(): MenuGroup[] {
  const { hasAccessByCodes } = useAccess();
  const enablePermission = externalMenuConfig?.enablePermission !== false;
  
  return getMenuGroupsData()
    .filter(group => group.enabled !== false)
    .map((group) => ({
      ...group,
      // 过滤掉没有权限的菜单项
      menus: group.menus.filter((menu) => {
        // 过滤掉禁用的菜单
        if (menu.enabled === false) return false;
        
        // 权限过滤
        if (enablePermission && menu.permission) {
          return hasAccessByCodes([menu.permission]);
        }
        
        return true;
      }),
    }))
    // 过滤掉没有菜单项的分组
    .filter((group) => group.menus.length > 0)
    // 按sort字段排序
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map(group => ({
      ...group,
      // 菜单项也按sort字段排序
      menus: group.menus.sort((a, b) => (a.sort || 0) - (b.sort || 0))
    }));
}

/** 获取所有菜单项（扁平化） */
export function getAllMenuItems(): MenuItem[] {
  const groups = getMenuGroups();
  return groups.flatMap((group) => group.menus);
}

/** 根据 key 获取菜单项 */
export function getMenuItemByKey(key: string): MenuItem | undefined {
  return getAllMenuItems().find((item) => item.key === key);
}

/** 根据 keys 批量获取菜单项 */
export function getMenuItemsByKeys(keys: string[]): MenuItem[] {
  return keys.map(key => getMenuItemByKey(key)).filter(Boolean) as MenuItem[];
}

/** 搜索菜单项 */
export function searchMenuItems(keyword: string): MenuItem[] {
  const items = getAllMenuItems();
  const lowerKeyword = keyword.toLowerCase();
  
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerKeyword) ||
    item.key.toLowerCase().includes(lowerKeyword) ||
    (item.description && item.description.toLowerCase().includes(lowerKeyword))
  );
}

/** 获取菜单统计信息 */
export function getMenuStats() {
  const groups = getMenuGroups();
  const allItems = getAllMenuItems();
  
  return {
    groupCount: groups.length,
    totalMenus: allItems.length,
    enabledMenus: allItems.filter(menu => menu.enabled !== false).length,
    groupedMenus: groups.reduce((acc, group) => {
      acc[group.key] = group.menus.length;
      return acc;
    }, {} as Record<string, number>)
  };
}

/** 重置菜单配置到默认状态 */
export function resetMenuConfig() {
  externalMenuConfig = null;
}
