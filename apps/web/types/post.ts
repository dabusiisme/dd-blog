export interface PostFrontmatter {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  draft?: boolean
  cover?: string
  featured?: boolean
}

/** @nuxt/content v2 文档的元字段（路径字段是 `_path`，注意不是 `path`） */
export interface ContentMeta {
  _path: string
  _draft?: boolean
  _partial?: boolean
  _locale?: string
  _stem?: string
}

/** 列表场景使用的文章文档（配合 .only() 裁剪字段） */
export interface PostListItem extends PostFrontmatter, ContentMeta {}

/** 详情场景使用的文章文档（含解析后的 body，交由 <ContentRenderer> 渲染） */
export interface Post extends PostFrontmatter, ContentMeta {
  body?: unknown
}

export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}
