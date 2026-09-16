<script setup lang="ts">
import type { PostListItem } from '~/types/post'

const { data: posts } = await useAsyncData('archive', () =>
  queryContent<PostListItem>('/posts')
    .where({ _draft: { $ne: true } })
    .only(['title', 'publishedAt', '_path'])
    .sort({ publishedAt: -1 })
    .find(),
)

const groups = computed(() => groupByYear(posts.value ?? []))

useBlogSeo({ title: '归档', description: '全部文章的时间线归档' })
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">归档</h1>
    <section v-for="[year, items] in groups" :key="year" class="mb-8">
      <h2 class="mb-3 text-xl font-semibold">{{ year }}</h2>
      <ul class="flex flex-col gap-2">
        <li v-for="post in items" :key="post._path" class="flex gap-4 text-sm">
          <time class="shrink-0 text-gray-400">{{ formatDate(post.publishedAt) }}</time>
          <NuxtLink :to="post._path" class="hover:text-blue-600">
            {{ post.title }}
          </NuxtLink>
        </li>
      </ul>
    </section>
    <p v-if="!posts?.length" class="text-gray-400">还没有文章。</p>
  </div>
</template>
