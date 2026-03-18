import type { PageParam, PageResult } from "@/http";
import { http } from "@/http"

/** 用印管理信息 */
export interface SealDeclaration {
  id: number; // 表单主键
  type: string; // 类型
  useDate: string; // 用印日期
  num: number; // 数量
  description: string; // 用印事由
  category: string; // 类别
  file: string; // 盖章文件
  reporter: string; // 申请人
  reporterDepart: string; // 上报人部门
  reporterDepartName: string; // 部门名称
  bpmStatus: string; // 审批状态
  user1: number; // 审核节点1
  user2: number; // 审核节点2
  user3: number; // 审核节点3
  user4: number; // 审核节点4
  unitId: number; // 单位id
  postedId: number; // 发文id
  postedName: string; // 发文名称
  isPosted: number; // 是否发文审批
}

export default {
  getPage: (params: PageParam) => {
    return http.get<PageResult<SealDeclaration>>(
      "/comprehensive/seal-declaration/page",
      params,
    );
  },

  get: (id: string) => {
    return http.get(`/comprehensive/seal-declaration/get?id=` + id);
  },

  create: (data: SealDeclaration) => {
    return http.post(`/comprehensive/seal-declaration/create`, data);
  },

  update: (data: SealDeclaration) => {
    return http.put(`/comprehensive/seal-declaration/update`, data);
  },

  delete: (id: string) => {
    return http.delete(`/comprehensive/seal-declaration/delete?id=` + id);
  },
  // 关联发文流程
  queryAll: (data: any) => {
    return http.get(`/pms/document/posted/queryAll`, data);
  },
};
