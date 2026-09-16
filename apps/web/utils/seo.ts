/** SEO meta 组装工具 */

interface SeoInput {
  title: string
  description: string
  path?: string
  image?: string
}

export function useBlogSeo({ title, description, path, image }: SeoInput) {
  const config = useRuntimeConfig()
  const siteUrl: string = config.public.siteUrl
  const siteName: string = config.public.siteName
  const url = path && siteUrl ? new URL(path, siteUrl).toString() : siteUrl

  useSeoMeta({
    title: `${title} - ${siteName}`,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: siteName,
    ogUrl: url || undefined,
    ogImage: image,
    twitterCard: image ? 'summary_large_image' : 'summary',
  })

  if (url) {
    useHead({ link: [{ rel: 'canonical', href: url }] })
  }
}
