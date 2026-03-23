import type { PageParam, PageResult } from '../../../http/types'
import { http } from '../../../http/http'

/** 新闻信息 */
export interface News {
  id: number
  name: string
  publishDate: string
  picture?: string | any[]
  content?: string
  status?: number
}

/** 查询新闻分页列表 */
export function getNewsPage(params: PageParam) {
  return http.get<PageResult<News>>('/pms/project/news/page', params)
}

/** 查询新闻详情 */
export function getNews(id: number) {
  return http.get<News>('/pms/project/news/get', { id })
}
