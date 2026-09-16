<script setup lang="ts">
import type { PostListItem } from '~/types/post'

const route = useRoute()
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data: posts } = await useAsyncData(
  () => `home-page-${page.value}`,
  () =>
    queryContent<PostListItem>('/posts')
      .where({ _draft: { $ne: true } })
      .only(['title', 'description', 'publishedAt', 'tags', '_path'])
      .sort({ publishedAt: -1 })
      .skip((page.value - 1) * DEFAULT_PAGE_SIZE)
      .limit(DEFAULT_PAGE_SIZE)
      .find(),
)

const { data: total } = await useAsyncData('home-total', () =>
  queryContent('/posts')
    .where({ _draft: { $ne: true } })
    .only(['_path'])
    .find(),
)

const totalPages = computed(() => Math.max(1, Math.ceil((total.value?.length ?? 0) / DEFAULT_PAGE_SIZE)))

useBlogSeo({ title: '首页', description: '个人博客 - 分享技术与生活' })
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="mb-2 text-2xl font-bold">最新文章</h1>
    <PostCard v-for="post in posts ?? []" :key="post._path" :post="post" />
    <p v-if="!posts?.length" class="text-gray-400">还没有文章。</p>

    <div v-if="totalPages > 1" class="mt-4 flex justify-center gap-3 text-sm">
      <NuxtLink v-if="page > 1" :to="`/?page=${page - 1}`">上一页</NuxtLink>
      <span class="text-gray-400">{{ page }} / {{ totalPages }}</span>
      <NuxtLink v-if="page < totalPages" :to="`/?page=${page + 1}`">下一页</NuxtLink>
    </div>
  </div>
</template>
