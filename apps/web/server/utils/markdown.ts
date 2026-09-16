import type { PostFrontmatter } from '../../types/post'
import { CONTENT_POSTS_DIR } from '../../utils/constants'

/**
 * Frontmatter 解析 / 序列化（仅支持本项目使用的 YAML 子集：
 * 字符串、布尔、字符串数组）
 */

export function parseFrontmatter(raw: string): { frontmatter: Partial<PostFrontmatter>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { frontmatter: {}, body: raw }

  const frontmatter: Partial<PostFrontmatter> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line.trim())
    if (!kv) continue
    const [, key, rawValue] = kv
    const value = rawValue.trim()

    if (key === 'tags') {
      frontmatter.tags = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((t) => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      ;(frontmatter as Record<string, unknown>)[key] = value === 'true'
    } else {
      ;(frontmatter as Record<string, unknown>)[key] = value.replace(/^["']|["']$/g, '')
    }
  }
  return { frontmatter, body: match[2] }
}

export function serializePost(frontmatter: PostFrontmatter, body: string): string {
  const lines: string[] = ['---']
  lines.push(`title: "${frontmatter.title.replace(/"/g, '\\"')}"`)
  lines.push(`description: "${(frontmatter.description ?? '').replace(/"/g, '\\"')}"`)
  lines.push(`publishedAt: "${frontmatter.publishedAt}"`)
  if (frontmatter.updatedAt) lines.push(`updatedAt: "${frontmatter.updatedAt}"`)
  lines.push(`tags: [${(frontmatter.tags ?? []).map((t) => `"${t}"`).join(', ')}]`)
  if (frontmatter.draft) lines.push('draft: true')
  if (frontmatter.cover) lines.push(`cover: "${frontmatter.cover}"`)
  if (frontmatter.featured) lines.push('featured: true')
  lines.push('---', '')
  return `${lines.join('\n')}\n${body}`
}

/** 由发布日期推导文章在仓库中的路径：apps/web/content/posts/YYYY/MM/<slug>.md */
export function postRepoPath(slug: string, publishedAt: string): string {
  const [, year, month] = /^(\d{4})-(\d{2})/.exec(publishedAt) ?? []
  const datePart = year && month ? `${year}/${month}` : new Date().toISOString().slice(0, 7).replace('-', '/')
  return `${CONTENT_POSTS_DIR}/${datePart}/${slug.replace(/\.md$/, '')}.md`
}

/** 文章 id（相对 content/posts 的路径，如 2026/09/hello-world）→ 仓库文件路径 */
export function postRepoPathById(id: string): string {
  return `${CONTENT_POSTS_DIR}/${id.replace(/\.md$/, '')}.md`
}

/** 仓库文件路径 → slug（CONTENT_POSTS_DIR 前缀与 .md 后缀去掉） */
export function repoPathToSlug(repoPath: string): string {
  const prefix = `${CONTENT_POSTS_DIR}/`
  const relative = repoPath.startsWith(prefix) ? repoPath.slice(prefix.length) : repoPath
  return relative.replace(/\.md$/, '')
}
