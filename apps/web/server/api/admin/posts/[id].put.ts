import { apiFailure, apiSuccess } from '../../../../types/api'
import type { PostFrontmatter } from '../../../../types/post'
import { readFile, writeFile } from '../../../utils/github'
import { serializePost } from '../../../utils/markdown'

/** 更新文章：以仓库当前 sha 做乐观锁覆盖提交 */
export default defineEventHandler(async (event) => {
  const id = decodeURIComponent(getRouterParam(event, 'id') ?? '')
  if (!id) return apiFailure('BAD_REQUEST', '缺少文章 id')

  const body = await readBody<{ frontmatter?: PostFrontmatter; body?: string }>(event)
  if (!body?.frontmatter?.title) {
    return apiFailure('BAD_REQUEST', 'frontmatter.title 为必填项')
  }

  const repoPath = `content/posts/${id}.md`
  const existing = await readFile(repoPath).catch(() => null)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const frontmatter: PostFrontmatter = {
    ...body.frontmatter,
    updatedAt: new Date().toISOString().slice(0, 10),
  }

  await writeFile(
    repoPath,
    serializePost(frontmatter, body.body ?? ''),
    `feat(content): update post ${id}`,
    existing.sha,
  )

  return apiSuccess({ path: repoPath }, { deployed: 'auto' })
})
