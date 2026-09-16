<script setup lang="ts">
const keyword = ref('')

// TODO(P1): 接入 Pagefind 静态索引
// 构建流程：nuxt build（SSG）→ pagefind --site dist 生成索引
// 前端：动态 import('/pagefind/pagefind.js') 后调用 pagefind.search(keyword)

useBlogSeo({ title: '搜索', description: '搜索博客文章' })
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">搜索</h1>
    <input
      v-model="keyword"
      type="search"
      placeholder="输入关键词…"
      class="w-full rounded border px-4 py-2"
    />
    <p v-if="keyword" class="mt-6 text-gray-400">
      搜索功能将在 P1 阶段接入 Pagefind 静态索引。
    </p>
  </div>
</template>
