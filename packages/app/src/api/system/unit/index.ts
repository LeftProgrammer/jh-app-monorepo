import type { PageParam, PageResult } from '../../../http/types'
import { http } from '../../../http/http'

export interface ProjectUnit {
  id?: number
  sysOrgCode?: string
  projectId?: number
  name?: string
  code?: string
  unitType?: string
  abbreviation?: string
  contact?: string
  phone?: string
  file: string
  introduction?: string
  sort?: number
  createTime?: Date
}

export function getList() {
  return http.get<PageResult<ProjectUnit>>('/pms/project/unit/list')
}
