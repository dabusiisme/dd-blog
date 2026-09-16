import { apiSuccess } from '../../../../types/api'
import { readFile, writeFile } from '../../../utils/github'

/** 保存站点配置（提交到 Git，构建部署后生效） */
export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: '请求体必须为 JSON 对象' })
  }

  const existing = await readFile('content/site.config.json').catch(() => null)
  const content = `${JSON.stringify(body, null, 2)}\n`

  await writeFile(
    'content/site.config.json',
    content,
    'chore(config): update site config',
    existing?.sha,
  )

  return apiSuccess({ saved: true }, { deployed: 'auto' })
})
