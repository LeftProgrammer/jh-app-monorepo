import type { PageParam, PageResult } from "@/http";
import { http } from "@/http"

/** 请假申请信息 */
export interface LeaveApply {
    id: string // 标识

    sysOrgCode?: string // 组织机构编码
    sysOrgCodeName?: string // 部门名称
    position?: string // 岗位/职务

    applyDate?: string // 申请日期
    phone?: string // 电话
    urgentPhone?: string // 紧急电话

    startApplyTime?: string  // 请假开始时间
    endApplyTime?: string // 请假结束时间
    days?: number // 请假天数（或 string，看后端返回）

    type?: string // 请假类别
    applyCause?: string // 请假事由
    file?: string // 附件

    createName?: string // 申请人
    status?: number // 审批状态
    processInstanceId?: string // 流程实例id（如果后端有）

    unitId?: string // 单位id

    createTime?: string  // 创建时间（如果后端返回）
}

// 请假管理 API
export default {
    // 查询请假分页
    getPage: (params: PageParam) => {
        return http.get<PageResult<LeaveApply>>("/comprehensive/leaveApply/page", params)
    },

    // 查询请假详情
    get: (id: string) => {
        return http.get(`/comprehensive/leaveApply/get?id=` + id)
    },

    // 新增请假
    create: (data: LeaveApply) => {
        return http.post(`/comprehensive/leaveApply/create`, data)
    },

    // 修改请假
    update: (data: LeaveApply) => {
        return http.put(`/comprehensive/leaveApply/update`, data)
    },

    // 删除请假
    delete: (id: string) => {
        return http.delete(`/comprehensive/leaveApply/delete?id=` + id)
    },
}
