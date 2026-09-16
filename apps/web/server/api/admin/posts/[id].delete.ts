import { apiFailure, apiSuccess } from '../../../../types/api'
import { deleteFile, readFile } from '../../../utils/github'
import { postRepoPathById } from '../../../utils/markdown'

/** 删除文章（从 Git 仓库移除） */
export default defineEventHandler(async (event) => {
  const id = decodeURIComponent(getRouterParam(event, 'id') ?? '')
  if (!id) return apiFailure('BAD_REQUEST', '缺少文章 id')

  const repoPath = postRepoPathById(id)
  const existing = await readFile(repoPath).catch(() => null)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  await deleteFile(repoPath, `chore(content): delete post ${id}`, existing.sha)
  return apiSuccess({ deleted: repoPath })
})
