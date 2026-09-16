/** Google Analytics（仅在配置了 NUXT_PUBLIC_GA_ID 时加载） */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = config.public.gaId as string
  if (!gaId) return

  // TODO: 引入 gtag.js（可改用 @nuxtjs/google-analytics 模块）
  console.info('GA enabled:', gaId)
})
