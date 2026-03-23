import type { PageParam, PageResult } from '@/http'
import { http } from '@/http'

/** 传阅记录 */
export interface CirculateRecord {
  id: string
  name: string
  code?: string
  sendUser?: string
  sendTime?: number
  file?: string
}

/** 查询传阅分页列表 */
export function getCirculatePage(params: PageParam) {
  return http.get<PageResult<CirculateRecord>>('/document/read/page', params)
}

/** 查询传阅详情 */
export function getCirculate(id: number | string) {
  return http.get<CirculateRecord>(`/document/read/get?id=${id}`)
}

/** 创建传阅已读状态 */
export function createCirculateReadStatus(data: any) {
  return http.post<string>('/document/read-status/create', data)
}
