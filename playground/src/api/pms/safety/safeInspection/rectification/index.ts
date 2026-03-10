import type { PageParam, PageResult } from "@/http/types";
import { http } from "@/http/http";

/** 安全整改信息 */
export interface Rectification {
  id?: number // 标识
}

/** 安全整改 API */
export default {
  // 查询安全整改分页
  getPage: (params: PageParam) => { // 将 any 替换为更具体的 PageParam 类型
    return http.get<PageResult<Rectification>>("/safety/rectification/page", params);
  },

  // 查询安全整改详情
  get: (id: number) => {
    return http.get(`/safety/rectification/get?id=${id}`); // 使用模板字符串更简洁
  },

  // 新增安全整改
  create: (data: Rectification) => {
    return http.post(`/safety/rectification/create`, data);
  },

  // 修改安全整改
  update: (data: Rectification) => {
    return http.put(`/safety/rectification/update`, data);
  },

  // 删除安全整改
  delete: (id: number) => {
    return http.delete(`/safety/rectification/delete?id=${id}`); // 使用模板字符串更简洁
  },

  // 查询危险源管理列表
  getDangerSourceList: async (params: any) => {
    return http.get(`/safety/danger-source/list`, params )
  },

  // 查询项目划分树形结构
  getTree: async (unitId: number) => {
    return http.get(`/pms/quality/catalogue-tree/list?unitId=` + unitId)
  },

};
