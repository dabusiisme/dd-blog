/** 日期格式化为 YYYY-MM-DD */
export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 按年份分组：['2026', PostListItem[]][] */
export function groupByYear<T extends { publishedAt: string }>(items: T[]): Array<[string, T[]]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const year = item.publishedAt.slice(0, 4)
    const group = map.get(year)
    if (group) group.push(item)
    else map.set(year, [item])
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}
