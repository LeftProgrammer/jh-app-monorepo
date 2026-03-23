import { http } from '../../../http'

/** 部门信息 */
export interface Dept {
  id?: number
  name: string
  parentId: number
  status: number
  sort: number
  leaderUserId?: number
  phone?: string
  email?: string
  createTime?: Date
  children?: Dept[]
}

/** 获取部门列表 */
export function getDeptList(params?: { name?: string, status?: number }) {
  return http.get<Dept[]>('/system/dept/list', params)
}

/** 获取部门精简列表 */
export function getSimpleDeptList() {
  return http.get<Dept[]>('/system/dept/simple-list')
}

/** 获取部门详情 */
export function getDept(id: number) {
  return http.get<Dept>(`/system/dept/get?id=${id}`)
}
