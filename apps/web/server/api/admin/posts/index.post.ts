import { apiFailure, apiSuccess } from '../../../../types/api'
import type { PostFrontmatter } from '../../../../types/post'
import { readFile, writeFile } from '../../../utils/github'
import { postRepoPath, repoPathToSlug, serializePost } from '../../../utils/markdown'

/** 新建文章：提交 Markdown 到 Git 仓库，自动触发构建部署 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    slug?: string
    frontmatter?: PostFrontmatter
    body?: string
  }>(event)

  if (!body?.slug || !body.frontmatter?.title || !body.frontmatter?.publishedAt) {
    return apiFailure('BAD_REQUEST', 'slug、title、publishedAt 为必填项')
  }
  if (!/^[\w-]+$/.test(body.slug)) {
    return apiFailure('BAD_REQUEST', 'slug 仅允许字母、数字、中划线、下划线')
  }

  const repoPath = postRepoPath(body.slug, body.frontmatter.publishedAt)
  const existing = await readFile(repoPath).catch(() => null)
  if (existing) {
    return apiFailure('CONFLICT', `文章已存在：${repoPathToSlug(repoPath)}`)
  }

  await writeFile(
    repoPath,
    serializePost(body.frontmatter, body.body ?? ''),
    `feat(content): create post ${body.slug}`,
  )

  return apiSuccess({ slug: repoPathToSlug(repoPath), path: repoPath }, { deployed: 'auto' })
})
