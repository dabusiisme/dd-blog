<script setup lang="ts">
const { siteName } = useSiteConfig()
const { logout, loggedIn } = useAuth()

const nav = [
  { to: '/admin', label: '仪表盘' },
  { to: '/admin/posts', label: '文章' },
  { to: '/admin/settings', label: '设置' },
]
</script>

<template>
  <div class="min-h-screen flex">
    <aside class="w-56 shrink-0 border-r bg-white p-4">
      <div class="mb-6 text-lg font-bold">{{ siteName }} · 后台</div>
      <nav class="flex flex-col gap-2 text-sm">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="rounded px-3 py-2 hover:bg-gray-100">
          {{ item.label }}
        </NuxtLink>
        <button
          v-if="loggedIn"
          class="mt-4 rounded px-3 py-2 text-left text-red-500 hover:bg-red-50"
          @click="logout"
        >
          退出登录
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>
