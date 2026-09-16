import { apiSuccess } from '../../../../types/api'
import { SITE_CONFIG_PATH } from '../../../../utils/constants'
import { readFile } from '../../../utils/github'

/** 读取站点配置（apps/web/content/site.config.json） */
export default defineEventHandler(async () => {
  const file = await readFile(SITE_CONFIG_PATH).catch(() => null)
  if (!file) return apiSuccess({})

  try {
    return apiSuccess(JSON.parse(file.content) as Record<string, unknown>)
  } catch {
    return apiSuccess({})
  }
})
