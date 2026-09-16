<script setup lang="ts">
const { siteName } = useSiteConfig()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b bg-white">
      <nav class="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
        <NuxtLink to="/" class="text-xl font-bold">{{ siteName }}</NuxtLink>
        <div class="ml-auto flex gap-4 text-sm text-gray-600">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/archive">归档</NuxtLink>
          <NuxtLink to="/search">搜索</NuxtLink>
          <NuxtLink to="/about">关于</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <slot />
    </main>

    <footer class="border-t py-4 text-center text-sm text-gray-400">
      © {{ new Date().getFullYear() }} {{ siteName }}
    </footer>
  </div>
</template>
