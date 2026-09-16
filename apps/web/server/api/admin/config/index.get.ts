import { apiSuccess } from '../../../../types/api'
import { readFile } from '../../../utils/github'

/** 读取站点配置（content/site.config.json） */
export default defineEventHandler(async () => {
  const file = await readFile('content/site.config.json').catch(() => null)
  if (!file) return apiSuccess({})

  try {
    return apiSuccess(JSON.parse(file.content) as Record<string, unknown>)
  } catch {
    return apiSuccess({})
  }
})
