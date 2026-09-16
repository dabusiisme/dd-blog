/** 计算阅读时长（分钟），按中文 ~300 字 / 英文 ~200 词估算 */
export function estimateReadingTime(text: string): number {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) ?? []).length
  const words = (text.replace(/[\u4e00-\u9fff]/g, ' ').match(/[a-zA-Z0-9]+/g) ?? []).length
  const minutes = cjk / 300 + words / 200
  return Math.max(1, Math.round(minutes))
}
