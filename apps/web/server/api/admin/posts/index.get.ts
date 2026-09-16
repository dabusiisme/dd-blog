import { apiSuccess } from '../../../../types/api'
import type { PostFrontmatter } from '../../../../types/post'
import { listMarkdownFiles, readFile } from '../../../utils/github'
import { parseFrontmatter, repoPathToSlug } from '../../../utils/markdown'

/** 列出全部文章（含草稿），按发布时间倒序 */
export default defineEventHandler(async () => {
  const paths = await listMarkdownFiles('content/posts')

  const posts = await Promise.all(
    paths.map(async (repoPath) => {
      const file = await readFile(repoPath).catch(() => null)
      if (!file) return null
      const { frontmatter } = parseFrontmatter(file.content)
      return {
        slug: repoPathToSlug(repoPath),
        path: repoPath,
        frontmatter: {
          title: frontmatter.title ?? repoPath,
          description: frontmatter.description ?? '',
          publishedAt: frontmatter.publishedAt ?? '',
          tags: frontmatter.tags ?? [],
          draft: frontmatter.draft ?? false,
        } satisfies PostFrontmatter,
      }
    }),
  )

  const result = posts
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt))

  return apiSuccess(result, { total: result.length })
})
