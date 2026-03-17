import type { Dayjs } from 'dayjs'
import type { PageParam, PageResult } from '../../../../../http/types'
import { http } from '../../../../../http/http'

/** 质量问题整改列信息 */
export interface IssueRectifications {
  id: string // 主键id
  sysOrgCode: string // 组织机构编码
  recordId: string // 检查记录ID
  code?: string // 整改单号
  workArea: string // 详细区域
  rectificationPart: string // 整改部位
  rectificationDeadline: string | Dayjs // 整改期限
  rectificationContent?: string // 整改内容
  rectificationSuggestions: string // 整改建议
  file: string // 附件资料
  overdueStatus: string // 逾期状态
  rectificationStatus: string // 整改状态
  status: number // 流程状态
  user1: string // 上报人
  reporterName: string // 上报人名称
  reporterPhone: string // 上报人电话
  reporterDepart: string // 上报人部门
  reportDate: string | Dayjs // 上报日期
  user2: string // 问题分发人
  user3?: string // 问题整改人
  user4: string // 整改监理
  user5: string // 上报人复核
}

// 质量问题整改列 API
export default {
  // 查询质量问题整改列分页
  getPage: (params: PageParam) => { // 将 any 替换为更具体的 PageParam 类型
    return http.get<PageResult<IssueRectifications>>('/quality/issue-rectifications/page', params)
  },

  // 查询质量问题整改列详情
  get: (id: number) => {
    return http.get(`/quality/issue-rectifications/get?id=${id}`) // 使用模板字符串更简洁
  },

  // 新增质量问题整改列
  create: (data: IssueRectifications) => {
    return http.post(`/quality/issue-rectifications/create`, data)
  },

  // 修改质量问题整改列
  update: async (data: IssueRectifications) => {
    return http.put(`/quality/issue-rectifications/update`, data)
  },

  // 删除质量问题整改列
  delete: async (id: number) => {
    return http.delete(`/quality/issue-rectifications/delete?id=${id}`) // 使用模板字符串更简洁
  },

  // 查询项目划分树形结构
  getTree: async (unitId: number) => {
    return http.get(`/pms/quality/catalogue-tree/list?unitId=${unitId}`)
  },
}
