/** 站点配置：前台读 runtimeConfig，后台可经 Git API 读写 content/site.config.json */

export function useSiteConfig() {
  const config = useRuntimeConfig()
  const siteName = computed(() => config.public.siteName as string)
  const siteUrl = computed(() => config.public.siteUrl as string)

  async function saveSiteConfig(payload: Record<string, unknown>) {
    return $fetch('/api/admin/config', { method: 'PUT', body: payload })
  }

  return { siteName, siteUrl, saveSiteConfig }
}
