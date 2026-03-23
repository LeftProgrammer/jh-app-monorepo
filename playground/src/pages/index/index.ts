import type { MenuGroup, MenuItem } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { filterMenuGroupsByPermission, getAllMenuItems } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { useAccess } from '@/hooks'

// 重新导出类型供组件使用
export type { MenuGroup, MenuItem }

/**
 * 工作台菜单配置数据
 * 业务特定的菜单分组和菜单项定义
 */
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
  {
    key: "quality",
    name: "质量管理",
    menus: [
      {
        key: "quality-records",
        name: "质量检查",
        url: "/pages/pms/quality/inspection/records/index",
      },
      {
        key: "quality-issue",
        name: "质量整改",
        url: "/pages/pms/quality/inspection/issue/index",
      },
    ],
  },
];

/**
 * 获取所有菜单分组数据（带权限过滤）
 */
export function getMenuGroups(): MenuGroup[] {
  const { hasAccessByCodes } = useAccess()
  return filterMenuGroupsByPermission(menuGroupsData, hasAccessByCodes)
}

/** 根据 key 获取菜单项 */
export function getMenuItemByKey(key: string): MenuItem | undefined {
  return getAllMenuItems(getMenuGroups()).find(item => item.key === key)
}

/** 根据 keys 获取菜单列表 */
export function getMenusByKeys(keys: string[]): MenuItem[] {
  return keys.map(key => getMenuItemByKey(key)).filter(Boolean) as MenuItem[]
}
