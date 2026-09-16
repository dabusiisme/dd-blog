import type { PostFrontmatter } from '~/types/post'

/** 后台文章管理（数据经 Git API 读写仓库） */

export interface AdminPost {
  slug: string
  path: string
  frontmatter: PostFrontmatter
}

export function usePosts() {
  async function listPosts(): Promise<AdminPost[]> {
    const res = await $fetch<{ data: AdminPost[] }>('/api/admin/posts')
    return res.data
  }

  async function createPost(slug: string, frontmatter: PostFrontmatter, body: string) {
    return $fetch('/api/admin/posts', {
      method: 'POST',
      body: { slug, frontmatter, body },
    })
  }

  async function updatePost(slug: string, frontmatter: PostFrontmatter, body: string) {
    return $fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: { frontmatter, body },
    })
  }

  async function deletePost(slug: string) {
    return $fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, { method: 'DELETE' })
  }

  return { listPosts, createPost, updatePost, deletePost }
}
