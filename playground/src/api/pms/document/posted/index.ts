import type { PageParam, PageResult } from "@/http/types";
import { http } from "@/http/http";
import { formatDate } from "@/utils/date";

export interface PostedVO {
  id: number;
  status: number;
  type: number;
  reason: string;
  processInstanceId: string;
  startTime: string;
  endTime: string;
  createTime: string;
  sendUserName: string;
  sendUser: string;
  sendUnitName: string;
  sendUnit: string;
}

export function create(data: Partial<PostedVO>) {
  return http.post<number>("/pms/document/posted/create", data);
}

export function get(id: number | string) {
  return http.get<PostedVO>(`/pms/document/posted/get?id=${id}`);
}

export function getPage(params: PageParam) {
  return http.get<PageResult<PostedVO>>("/pms/document/posted/page", params);
}
export function deleteById(id: number) {
  return http.delete("/pms/document/posted/delete?id=" + id);
}
