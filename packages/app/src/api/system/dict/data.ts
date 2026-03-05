import type { PageParam, PageResult } from '@/http/types'
import { httpGet, httpPost, httpPut, httpDelete } from '@/http'

/** 字典数据 */
export interface DictData {
  id?: number
  dictType: string
  label: string
  value: string
  colorType?: string
  cssClass?: string
  sort?: number
  status: number
  remark?: string
  createTime?: Date
}

/** 查询字典数据（精简）列表 */
export function getSimpleDictDataList() {
  return httpGet<DictData[]>('/system/dict-data/simple-list')
}

/** 查询字典数据分页列表 */
export function getDictDataPage(params: PageParam) {
  return httpGet<PageResult<DictData>>('/system/dict-data/page', { query: params })
}

/** 查询字典数据详情 */
export function getDictData(id: number) {
  return httpGet<DictData>(`/system/dict-data/get?id=${id}`)
}

/** 新增字典数据 */
export function createDictData(data: DictData) {
  return httpPost<number>('/system/dict-data/create', { data })
}

/** 修改字典数据 */
export function updateDictData(data: DictData) {
  return httpPut<boolean>('/system/dict-data/update', { data })
}

/** 删除字典数据 */
export function deleteDictData(id: number) {
  return httpDelete<boolean>(`/system/dict-data/delete?id=${id}`)
}
