import { useAccess } from "@/hooks/useAccess";
import { ONLY_PC_PAGE } from "@/router";

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
}

/** 菜单分组类型 */
export interface MenuGroup {
  key: string; // 分组唯一标识
  name: string; // 分组名称
  menus: MenuItem[]; // 分组下的菜单列表
}

/** 菜单分组原始数据 */
const menuGroupsData: MenuGroup[] = [
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
      {
        key: "camp-safety",
        name: "营地安全",
        url: "/pages/general/camp/safety/index",
      },
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
        name: "隐患管理",
        url: "/pages/pms/safety/safeInspection/rectification/index",
      },
    ],
  },
];

/**
 * 获取所有菜单分组数据（带权限过滤）：过滤掉没有权限的菜单项，如果整个分组都没有权限则不展示该分组
 */
export function getMenuGroups(): MenuGroup[] {
  const { hasAccessByCodes } = useAccess();
  return (
    menuGroupsData
      .map((group) => ({
        ...group,
        // 过滤掉没有权限的菜单项
        menus: group.menus.filter((menu) => {
          // 没有配置权限的菜单项默认展示
          if (!menu.permission) {
            return true;
          }
          return hasAccessByCodes([menu.permission]);
        }),
      }))
      // 过滤掉没有菜单项的分组
      .filter((group) => group.menus.length > 0)
  );
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
