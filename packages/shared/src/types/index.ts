/** 站点配置 */
export interface SiteConfig {
  siteName: string
  siteUrl: string
  description?: string
  social?: {
    github?: string
    twitter?: string
    email?: string
  }
}
