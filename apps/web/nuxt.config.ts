// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-15',

  modules: ['@nuxt/content', '@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // 组件自动导入不使用目录前缀：components/blog/PostCard.vue → <PostCard />
  // 仅扫描 .vue；shadcn-vue 的 index.ts 用于 Vite import，不应被 Nuxt 当成组件
  components: [{ path: '~/components', pathPrefix: false, extensions: ['vue'] }],

  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

  typescript: {
    strict: true,
  },

  runtimeConfig: {
    // 服务端私有（ NUXT_ 前缀环境变量自动映射）
    authSecret: '',
    adminUsername: '',
    adminPasswordHash: '',
    github: {
      token: '',
      owner: '',
      repo: '',
      branch: 'main',
    },
    // 公开（ NUXT_PUBLIC_ 前缀）
    public: {
      siteName: 'My Blog',
      siteUrl: '',
      gaId: '',
      giscus: {
        repo: '',
        repoId: '',
      },
    },
  },

  content: {
    highlight: {
      theme: 'github-dark',
    },
    markdown: {
      anchorLinks: true,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/posts/**': { prerender: true },
    '/tags/**': { prerender: true },
    '/archive': { prerender: true },
    '/about': { prerender: true },
    '/search': { prerender: true },
    '/admin/**': { ssr: true },
    '/api/admin/**': { cors: true },
    '/api/auth/**': { cors: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
