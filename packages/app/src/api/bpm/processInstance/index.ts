import type { PageParam, PageResult } from '../../../http/types'
import { http } from '../../../http/http'

/** 流程实例用户信息 */
export interface User {
  id: number
  nickname: string
  avatar?: string
  deptName?: string
}

/** 流程定义 */
export interface ProcessDefinition {
  id: string
  key: string
  name: string
  description?: string
  icon?: string
  category: string
  formType?: number
  formId?: number
  formCustomCreatePath?: string
  formCustomViewPath?: string
  suspensionState: number
}

/** 流程实例 */
export interface ProcessInstance {
  id: string
  name: string
  status: number
  category?: string
  categoryName?: string
  createTime?: number
  startTime?: number
  endTime?: number
  startUser?: User
  businessKey?: string
  processDefinition?: ProcessDefinition
  summary?: {
    key: string
    value: string
  }[]
}

/** 审批详情 */
export interface ApprovalDetail {
  processInstance: ProcessInstance
  processDefinition: ProcessDefinition
  todoTask?: any
}

/** 抄送流程实例 */
export interface ProcessInstanceCopy {
  id: string
  processInstanceId: string
  processInstanceName: string
  startUser: User
  createTime: number
  summary?: {
    key: string
    value: string
  }[]
}

/** 查询我发起的流程分页列表 */
export function getProcessInstanceMyPage(params: PageParam) {
  return http.get<PageResult<ProcessInstance>>(
    '/bpm/process-instance/my-page',
    params,
  )
}

/** 新增流程实例 */
export function urgeCreate(data: any) {
  return http.post<string>('/bpm/process-instance/urge/create', data)
}

/** 查询抄送我的流程分页列表 */
export function getProcessInstanceCopyPage(params: PageParam) {
  return http.get<PageResult<ProcessInstanceCopy>>(
    '/bpm/process-instance/copy/page',
    params,
  )
}

/** 查询流程实例详情 */
export function getProcessInstance(id: string) {
  return http.get<ProcessInstance>(`/bpm/process-instance/get?id=${id}`)
}

/** 获取审批详情 */
export function getApprovalDetail(params: {
  processInstanceId: string
  activityId?: string
  taskId?: string
}) {
  return http.get<ApprovalDetail>(
    '/bpm/process-instance/get-approval-detail',
    params,
  )
}

/** 新增流程实例 */
export function createProcessInstance(data: {
  processDefinitionId: string
  variables: Record<string, any>
}) {
  return http.post<string>('/bpm/process-instance/create', data)
}

/** 申请人取消流程实例 */
export function cancelProcessInstanceByStartUser(id: string, reason: string) {
  return http.delete<boolean>('/bpm/process-instance/cancel-by-start-user', {
    id,
    reason,
  })
}

/** 查询管理员流程实例分页 */
export function getProcessInstanceManagerPage(params: PageParam) {
  return http.get<PageResult<ProcessInstance>>(
    '/bpm/process-instance/manager-page',
    params,
  )
}

/** 管理员取消流程实例 */
export function cancelProcessInstanceByAdmin(id: string, reason: string) {
  return http.delete<boolean>('/bpm/process-instance/cancel-by-admin', {
    id,
    reason,
  })
}
/** 获取流程实例的 BPMN 模型视图 */
export function getProcessInstanceBpmnModelView(id: string) {
  return http.get<any>(`/bpm/process-instance/get-bpmn-model-view?id=${id}`)
}
