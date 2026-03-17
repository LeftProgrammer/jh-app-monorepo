import type { Dayjs } from 'dayjs'
import type { PageParam, PageResult } from '../../../../../http/types'
import { http } from '../../../../../http/http'

/** 质量检查记录信息 */
export interface InspectionRecords {
  id: string // 主键
  sysOrgCode: string // 组织机构编码
  code?: string // 检查编号
  workArea?: string // 检查工区
  inspectionType?: string // 检查类型
  inspectionDate?: string | Dayjs // 检查日期
  inspectionResult?: string // 检查结果
  inspector?: string // 检查人员
  reporter?: string // 检查上报人
  reportingUnit?: string // 检查单位
  inspectionContent?: string // 检查内容
  inspectionBasis: string // 检查依据
  structure: string// 检查结构：业主检查
  file: string
  detailList: []
  state: string
}

// 质量检查记录 API
export default {
  // 查询质量问题整改列分页
  getPage: (params: PageParam) => { // 将 any 替换为更具体的 PageParam 类型
    return http.get<PageResult<InspectionRecords>>('/pms/quality/inspection-records/page', params)
  },

  // 查询质量问题整改列详情
  get: (id: number) => {
    return http.get(`/pms/quality/inspection-records/get?id=${id}`) // 使用模板字符串更简洁
  },

  // 新增质量问题整改列
  create: (data: InspectionRecords) => {
    return http.post(`/pms/quality/inspection-records/create`, data)
  },

  // 修改质量问题整改列
  update: async (data: InspectionRecords) => {
    return http.put(`/pms/quality/inspection-records/update`, data)
  },

  // 删除质量问题整改列
  delete: async (id: number) => {
    return http.delete(`/pms/quality/inspection-records/delete?id=${id}`) // 使用模板字符串更简洁
  },

  // 查询项目划分树形结构
  getTree: async (unitId: number) => {
    return http.get(`/pms/quality/catalogue-tree/list?unitId=${unitId}`)
  },
}
