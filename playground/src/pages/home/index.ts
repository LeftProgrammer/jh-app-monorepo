import type { MenuGroup } from '@jinghe-sanjiaoroad-app/framework/pages/home'
import { useMenuGroups } from '@jinghe-sanjiaoroad-app/framework/pages/home'

/**
 * 工作台菜单配置数据
 * 业务特定的菜单分组和菜单项定义
 */
const menuGroupsData: MenuGroup[] = [
  {
    key: 'general',
    name: '综合管理',
    menus: [
      {
        key: 'meeting',
        name: '会议预约',
        url: '/pages/general/meeting/subscribe/index',
      },
      {
        key: 'leaveApply',
        name: '请假申请',
        url: '/pages/general/leaveApply/index',
      },
      {
        key: 'sealdeclaration',
        name: '用印申请',
        url: '/pages/general/sealdeclaration/index',
      },
      {
        key: 'camp-safety',
        name: '营地安全',
        url: '/pages/general/camp/safety/index',
      },
      {
        key: 'camp-reception-apply',
        name: '接待餐预定',
        url: '/pages/general/camp/receptionapply/index',
      },
      {
        key: 'contact',
        name: '通讯录',
        url: '/pages/contact/index',
      },
    ],
  },
  {
    key: 'document',
    name: '公文管理',
    menus: [
      {
        key: 'consortium-posted',
        name: '总包发文',
        url: '/pages/pms/document/consortium/posted/index',
      },
      {
        key: 'consortium-received',
        name: '总包收文',
        url: '/pages/pms/document/consortium/received/index',
      },
      {
        key: 'owner-posted',
        name: '业主发文',
        url: '/pages/pms/document/owner/posted/index',
      },
      {
        key: 'owner-received',
        name: '业主收文',
        url: '/pages/pms/document/owner/received/index',
      },
      {
        key: 'supervision-posted',
        name: '监理发文',
        url: '/pages/pms/document/supervision/posted/index',
      },
      {
        key: 'supervision-received',
        name: '监理收文',
        url: '/pages/pms/document/supervision/received/index',
      },
      {
        key: 'construction-posted',
        name: '施工发文',
        url: '/pages/pms/document/construction/posted/index',
      },
      {
        key: 'construction-received',
        name: '施工收文',
        url: '/pages/pms/document/construction/received/index',
      },
    ],
  },
  {
    key: 'safety',
    name: '安全管理',
    menus: [
      {
        key: 'safety-inspection',
        name: '安全检查',
        url: '/pages/pms/safety/safeInspection/inspection/index',
      },
      {
        key: 'safety-rectification',
        name: '隐患管理',
        url: '/pages/pms/safety/safeInspection/rectification/index',
      },
    ],
  },
  {
    key: 'quality',
    name: '质量管理',
    menus: [
      {
        key: 'quality-records',
        name: '质量检查',
        url: '/pages/pms/quality/inspection/records/index',
      },
      {
        key: 'quality-issue',
        name: '质量整改',
        url: '/pages/pms/quality/inspection/issue/index',
      },
    ],
  },
]

/**
 * 首页菜单 composable 实例
 * 使用框架提供的 useMenuGroups 封装权限过滤和查询逻辑
 */
export const { menuGroups, getMenuItemByKey, getMenusByKeys } = useMenuGroups(menuGroupsData)
