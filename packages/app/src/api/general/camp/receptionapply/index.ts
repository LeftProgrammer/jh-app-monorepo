import type { PageParam, PageResult } from '../../../../http'
import { http } from '../../../../http'
import { formatDate } from '../../../../utils/date'

export interface PostedVO {
  id: number
  status: number
  applicant: string
  filingDate: string
  startMealTime: string
  endMealTime: string
  reception: string
  receptionNumber: number
  receptionMatters: string
  accompanyingPerson: string
  accompanyingNumber: number
  diningRoom: string
}

export function create(data: Partial<PostedVO>) {
  return http.post<number>('/camp/reception-apply/create', data)
}
export function update(data: Partial<PostedVO>) {
  return http.put<number>('/camp/reception-apply/update', data)
}
export function get(id: number | string) {
  return http.get<PostedVO>(`/camp/reception-apply/get?id=${id}`)
}

export function getPage(params: PageParam) {
  return http.get<PageResult<PostedVO>>('/camp/reception-apply/page', params)
}
export function deleteById(id: number) {
  return http.delete(`/camp/reception-apply/delete?id=${id}`)
}
