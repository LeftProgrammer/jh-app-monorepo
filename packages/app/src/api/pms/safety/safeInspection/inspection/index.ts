import type { PageParam, PageResult } from '../../../../../http/types'
import { http } from '../../../../../http/http'

/** 安全交底信息 */
export interface Inspection {
  id?: number // 标识
}

/** 安全交底 API */
export default {
  // 查询安全交底分页
  getPage: (params: PageParam) => { // 将 any 替换为更具体的 PageParam 类型
    return http.get<PageResult<Inspection>>('/safety/inspection/page', params)
  },

  // 查询安全交底详情
  get: (id: number) => {
    return http.get(`/safety/inspection/get?id=${id}`) // 使用模板字符串更简洁
  },

  // 新增安全交底
  create: (data: Inspection) => {
    return http.post(`/safety/inspection/create`, data)
  },

  // 修改安全交底
  update: (data: Inspection) => {
    return http.put(`/safety/inspection/update`, data)
  },

  // 删除安全交底
  delete: (id: number) => {
    return http.delete(`/safety/inspection/delete?id=${id}`) // 使用模板字符串更简洁
  },

  // 查询项目划分树形结构
  getTree: async (unitId: number) => {
    return http.get(`/pms/quality/catalogue-tree/list?unitId=${unitId}`)
  },
}
