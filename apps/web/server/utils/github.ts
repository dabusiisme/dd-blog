/**
 * GitHub Git API 客户端：Git 仓库是唯一内容数据源。
 * 后台的文章读写均通过 Contents / Trees API 完成，提交后自动触发 Cloudflare Pages 构建。
 */

interface GithubTarget {
  token: string
  owner: string
  repo: string
  branch: string
}

function getTarget(): GithubTarget {
  const gh = useRuntimeConfig().github
  if (!gh?.token || !gh?.owner || !gh?.repo) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GitHub 未配置（请检查 NUXT_GITHUB_* 环境变量）',
    })
  }
  return { token: gh.token, owner: gh.owner, repo: gh.repo, branch: gh.branch || 'main' }
}

async function ghFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = getTarget()
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw createError({
      statusCode: res.status === 404 ? 404 : 502,
      statusMessage: `GitHub API ${res.status}: ${text.slice(0, 200)}`,
    })
  }
  return (await res.json()) as T
}

export interface RepoFile {
  path: string
  content: string
  sha: string
}

/** 读取单个文件（UTF-8），不存在返回 null */
export async function readFile(path: string): Promise<RepoFile | null> {
  const { owner, repo, branch } = getTarget()
  const data = await ghFetch<{
    content?: string
    encoding?: string
    sha?: string
    message?: string
  }>(`/repos/${owner}/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`).catch(
    (err) => {
      if (err?.statusCode === 404) return null
      throw err
    },
  )
  if (!data || typeof data.content !== 'string') return null
  const content =
    data.encoding === 'base64' || data.encoding === 'base64url'
      ? Buffer.from(data.content, 'base64url').toString('utf8')
      : data.content
  return { path, content, sha: data.sha ?? '' }
}

/** 创建或更新文件（sha 存在时为更新） */
export async function writeFile(
  path: string,
  content: string,
  message: string,
  sha?: string,
): Promise<{ sha: string }> {
  const { owner, repo, branch } = getTarget()
  return ghFetch<{ content: { sha: string } }>(
    `/repos/${owner}/${repo}/contents/${encodeURI(path)}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf8').toString('base64'),
        branch,
        ...(sha ? { sha } : {}),
      }),
    },
  ).then((res) => ({ sha: res.content.sha }))
}

/** 删除文件 */
export async function deleteFile(path: string, message: string, sha: string): Promise<void> {
  const { owner, repo, branch } = getTarget()
  await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURI(path)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch }),
  })
}

/** 递归列出某目录下全部 .md 文件路径（基于 Git Trees API） */
export async function listMarkdownFiles(dir: string): Promise<string[]> {
  const { owner, repo, branch } = getTarget()
  const tree = await ghFetch<{ tree: Array<{ path: string; type: string }> }>(
    `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  )
  return tree.tree
    .filter((node) => node.type === 'blob' && node.path.startsWith(`${dir}/`) && node.path.endsWith('.md'))
    .map((node) => node.path)
}
