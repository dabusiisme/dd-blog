import { apiFailure, apiSuccess } from '../../../../types/api'
import { readFile } from '../../../utils/github'
import { parseFrontmatter, postRepoPathById, repoPathToSlug } from '../../../utils/markdown'

/** 获取单篇文章（含正文），id 为相对路径（如 2026/09/hello-world） */
export default defineEventHandler(async (event) => {
  const id = decodeURIComponent(getRouterParam(event, 'id') ?? '')
  if (!id) return apiFailure('BAD_REQUEST', '缺少文章 id')

  const repoPath = postRepoPathById(id)
  const file = await readFile(repoPath).catch(() => null)
  if (!file) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const { frontmatter, body } = parseFrontmatter(file.content)
  return apiSuccess({ slug: repoPathToSlug(repoPath), frontmatter, body })
})
