export const DEFAULT_PAGE_SIZE = 10

export const SESSION_COOKIE = 'blog_session'
export const LOGGED_IN_COOKIE = 'blog_logged_in'

/**
 * 内容在仓库中的位置（路径相对 Git 仓库根目录）。
 * monorepo 中 Nuxt 应用位于 apps/web，后台 Git API 必须带此前缀。
 */
export const CONTENT_ROOT_DIR = 'apps/web/content'
export const CONTENT_POSTS_DIR = `${CONTENT_ROOT_DIR}/posts`
export const SITE_CONFIG_PATH = `${CONTENT_ROOT_DIR}/site.config.json`
