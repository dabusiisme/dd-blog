import type { PostFrontmatter } from '~/types/post'

/** 后台文章管理（数据经 Git API 读写仓库） */

export interface AdminPost {
  slug: string
  path: string
  frontmatter: PostFrontmatter
}

export function usePosts() {
  // SSR 时内部请求默认不携带 Cookie，需用 useRequestFetch 透传会话（否则后台页面硬刷新会 401）
  const requestFetch = useRequestFetch()

  async function listPosts(): Promise<AdminPost[]> {
    const res = await requestFetch<{ data: AdminPost[] }>('/api/admin/posts')
    return res.data
  }

  async function createPost(slug: string, frontmatter: PostFrontmatter, body: string) {
    return requestFetch('/api/admin/posts', {
      method: 'POST',
      body: { slug, frontmatter, body },
    })
  }

  async function updatePost(slug: string, frontmatter: PostFrontmatter, body: string) {
    return requestFetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: { frontmatter, body },
    })
  }

  async function deletePost(slug: string) {
    return requestFetch(`/api/admin/posts/${encodeURIComponent(slug)}`, { method: 'DELETE' })
  }

  return { listPosts, createPost, updatePost, deletePost }
}
