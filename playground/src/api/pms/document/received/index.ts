import type { PageParam, PageResult } from "@/http";
import { http } from "@/http";

export interface ReceivedVO {
  id: number;
  status: number;
  type: number;
  reason: string;
  processInstanceId: string;
  startTime: string;
  endTime: string;
  createTime: string;
}

export function create(data: Partial<ReceivedVO>) {
  return http.post<number>("/pms/document/received/create", data);
}

export function get(id: number) {
  return http.get<ReceivedVO>(`/pms/document/received/get?id=${id}`);
}

export function getPage(params: PageParam) {
  return http.get<PageResult<ReceivedVO>>(
    "/pms/document/received/page",
    params,
  );
}
export function deleteById(id: number) {
  return http.delete("/pms/document/received/delete?id=" + id);
}
