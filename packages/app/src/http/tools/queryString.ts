/**
 * 将对象转换为查询字符串
 */
export function stringifyQuery(query: Record<string, any>): string {
  return Object.keys(query)
    .map(key => {
      const value = query[key]
      if (value === undefined || value === null) {
        return ''
      }
      if (typeof value === 'object') {
        return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join('&')
}

/**
 * 将查询字符串解析为对象
 */
export function parseQuery(queryString: string): Record<string, string> {
  const query: Record<string, string> = {}
  
  if (queryString.startsWith('?')) {
    queryString = queryString.slice(1)
  }
  
  queryString.split('&').forEach(item => {
    const [key, value] = item.split('=')
    if (key) {
      query[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }
  })
  
  return query
}
