import type { ProcessInstance } from "@/api/bpm/processInstance";
import type { PageParam, PageResult } from "@/http/types";
import { http } from "@/http/http";

/** 任务处理人 */
// TODO @芋艿：貌似暂时不需要这个？！
export interface TaskUser {
  id: number;
  nickname: string;
  avatar?: string;
  deptName?: string;
}

/** 流程任务 */
export interface Task {
  id: string;
  name: string;
  status: number;
  createTime: Date;
  endTime?: Date;
  durationInMillis?: number; // 持续时间
  reason?: string;
  assigneeUser?: TaskUser;
  ownerUser?: TaskUser;
  processInstanceId?: string; // 流程实例 ID
  processInstance: ProcessInstance;
  processDefinition: any;
}

/** 查询待办任务分页列表 */
export function getTaskTodoPage(params: PageParam) {
  return http.get<PageResult<Task>>("/bpm/task/todo-page", params);
}

/** 查询已办任务分页列表 */
export function getTaskDonePage(params: PageParam) {
  return http.get<PageResult<Task>>("/bpm/task/done-page", params);
}

/** 审批通过 */
export function approveTask(data: any) {
  return http.put<boolean>("/bpm/task/approve", data);
}

/** 审批拒绝 */
export function rejectTask(data: { id: string; reason: string }) {
  return http.put<boolean>("/bpm/task/reject", data);
}
/** 审批退回 */
export function returnTask(data: any) {
  return http.put<boolean>("/bpm/task/return", data);
}

/** 审批委派 */
export function delegateTask(data: any) {
  return http.put<boolean>("/bpm/task/delegate", data);
}
/** 获取所有可退回的节点 */
export function getTaskListByReturn(id: string) {
  return http.get<any>("/bpm/task/list-by-return", { id });
}

/** 根据流程实例 ID 查询任务列表 */
export function getTaskListByProcessInstanceId(processInstanceId: string) {
  return http.get<Task[]>(
    `/bpm/task/list-by-process-instance-id?processInstanceId=${processInstanceId}`,
  );
}

/** 查询任务管理分页 */
export function getTaskManagerPage(params: PageParam) {
  return http.get<PageResult<Task>>("/bpm/task/manager-page", params);
}
