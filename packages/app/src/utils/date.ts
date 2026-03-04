import dayjs from 'dayjs'

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}

/**
 * 获取当前时间戳
 */
export function getCurrentTimestamp(): number {
  return Date.now()
}

/**
 * 时间戳转日期
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp)
}

/**
 * 计算时间差
 */
export function timeDiff(startTime: Date | string | number, endTime: Date | string | number): number {
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  return end.diff(start, 'second')
}

/**
 * 相对时间（如：2小时前）
 */
export function timeAgo(date: Date | string | number): string {
  return dayjs(date).fromNow()
}

/**
 * 获取日期范围
 */
export function getDateRange(type: 'week' | 'month' | 'year'): [string, string] {
  const now = dayjs()
  let start: dayjs.Dayjs

  switch (type) {
    case 'week':
      start = now.startOf('week')
      break
    case 'month':
      start = now.startOf('month')
      break
    case 'year':
      start = now.startOf('year')
      break
    default:
      start = now.startOf('day')
  }

  return [start.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')]
}
