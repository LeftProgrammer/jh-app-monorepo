import type { PageParam, PageResult } from '../../../http'
import { http } from '../../../http'

export interface News { }

/** 查询新闻分页列表 */
export function getPage(params: PageParam) {
  return http.get<PageResult<News>>('/pms/project/news/page', params)
}
