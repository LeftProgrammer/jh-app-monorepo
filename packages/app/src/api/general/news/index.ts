import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'

export interface News { }

/** 查询新闻分页列表 */
export function getPage(params: PageParam) {
  return http.get<PageResult<News>>('/pms/project/news/page', params)
}
