import type { PageParam, PageResult } from "@/http";
import { http } from "@/http"

export function create(data: any) {
  return http.post<number>("/camp/safety/create", data);
}
export function update(data: any) {
  return http.put<number>("/camp/safety/update", data);
}
export function get(id: number | string) {
  return http.get(`/camp/safety/get?id=${id}`);
}

export function getPage(params: PageParam) {
  return http.get<PageResult<any>>("/camp/safety/page", params);
}
export function deleteById(id: number) {
  return http.delete("/camp/safety/delete?id=" + id);
}
